/**
 * This module contains all methods needed to use the given URL data to send
 * requests to the URLs. The only method currently exposed for client code
 * use is pingUrls(). All other methods are private to this module.
 *
 * The initial request to a URL is always just a request for the response
 * headers (method = 'HEAD'). If the response for any request results in a
 * status code equal to or exceeding the threshold set in config.js, then a
 * full-page (method = 'GET') follow-up request is sent to the URL in order 
 * to get any valuable error message information that might be included in the 
 * page response. This also gives us a view of what the a user would have seen.
 **/

// Node.js Module Dependencies
var http = require('http');   // Used to make HTTP requests
var https = require('https'); // Used to make HTTPS requests

// Local Module Dependencies
var config = require('../../modules/config-convey'); // Config data from config.js
var logger = require('../../modules/logger.js'); // Logging module
var db = require('../../modules/database.js'); // Open and close DB connections
var errorIO = require('../models/errors_Ping_IO_Mongo.js'); // Errors model IO ops
var headIO = require('../models/heads_Ping_IO_Mongo.js'); // Heads model IO ops
var UrlGroupsIO = require('../models/urlgroups_Ping_IO_Mongo.js'); // URL Groups model IO ops

/* ----------------------------------------------------------------------------
   Functions exposed to client code
   ------------------------------------------------------------------------- */

// Function to run through and ping all URLs to be pinged in this round (as
// expressed in the arrays containing the URLs and related URL Group objects)
exports.pingUrls = function(arrUrls, arrPingUrlGroups) {

    // Verify URL data was passed to function. If the array is empty, then close
    // the database connection end return out of this function
    if (arrUrls[0] === undefined || arrPingUrlGroups[0] === undefined) {
        logger.error("No URL or URL Group data found. Closing DB connection");
        db.closeConnection();
        return;
    }

    /* Counter to track ping responses. This is used in the callback generated
     * below in order to determine when the last ping response has been
     * received. Following this, a process to tally the URL response data at
     * the URL Group level will be kicked off, and the database connection will
     * be closed.
     */
    var pings = { count: 0 };

    // URL data has been received, so iterate through the array of objects
    // containing the URLs and send requests for each URL
    for (var i = 0; i < arrUrls.length; i++) {

        var reqMethod = 'HEAD'; // Method of http request to be sent
        var reqDateTime = new Date(); // Timestamp for request

        // Generate request options
        var options = generateOptions(arrUrls[i].host, arrUrls[i].path, reqMethod);

        // Generate request callback
        var callback = generateCallback(arrUrls[i], arrUrls.length, pings, reqMethod, reqDateTime,
                                        arrPingUrlGroups);

        // Send the request as http or https depending on protocol specified
        if (arrUrls[i].protocol === 'http') {
            var req = http.request(options, callback);

            /* If there is an error with the request, then (1) log the error,
             * and (2) wait for the same period specified for waiting after the
             * last of Ping response data has been recorded and close the DB
             * connection
             */
            req.on('error', function(err) {
                logger.info("Likely an incorrectly formed domain:", err);
                setTimeout(function() {
                    db.closeConnection();
                }, config.urlGroupQueryWait);
            });
            req.end();
        } else if (arrUrls[i].protocol === 'https') {
            var req = https.request(options, callback);
            
            req.on('error', function(err) {
                logger.info("Likely an incorrectly formed domain:", err);
                setTimeout(function() {
                    db.closeConnection();
                }, config.urlGroupQueryWait);
            });
            req.end();
        } else {
            // some protocol other than http and https was specified
            logger.info(
                "The specified protocol for the URL " + arrUrls[i].host
                + arrUrls[i].path + " is '" + arrUrls[i].protocol + "'"
                + ". It should be either 'http' or 'https'."
            );
        }
    }
}

/* ----------------------------------------------------------------------------
   Private Functions (used in this module only)
   ------------------------------------------------------------------------- */

// Function to generate options to be used for http.request
function generateOptions(host, path, method) {
    return {
        method: method,
        host: host,
        path: path
    };
}

// Function to generate a callback to be used for http.request
function generateCallback(pingUrl, urlCount, pings, method, reqDateTime,
                          pingUrlGroups) {

    var urlName = pingUrl.name;
    var urlHost = pingUrl.host;
    var urlPath = pingUrl.path;
    var urlProtocol = pingUrl.protocol;
    var urlId = pingUrl._id;
    var urlGroupId = pingUrl.urlgroup_id;

    return function(res) {

        // Output the response body (web page code)
        var pageData = '';

        // The way streaming works in node.js, you must listen for and consume 
        // the response data in order for the response 'end' event to be fired. 
        res.on('data', function(data) {    
            pageData += data;
        });

        /* Upon response completion, log the response info. If the status code
         * of the response exceeds the 'error' threshold (defined in config)
         * then kick off a follow-up GET request to retrieve full page data.
         */
        res.on('end', function() {
            // Create a full URL from host and path values
            var fullUrl = urlProtocol + "://" +  urlHost + urlPath;

            // If the request method is HEAD, log the output from the response.
            // Then execute the follow-up GET request, if needed.
            if (method == 'HEAD') {
                
                // Follow-up GET request if status code >= error threshold
                if (res.statusCode >= config.statusCodeThreshold) {
                    // Setup for the follow-up request
                    var fullReqOptions = generateOptions(urlHost, urlPath,
                        'GET');
                    var fullReqCallback = generateCallback(pingUrl, urlCount,
                        pings, 'GET', reqDateTime, pingUrlGroups);
                    // Execute the follow-up request
                    http.request(fullReqOptions, fullReqCallback).end();

                    // decrement the response counter because an extra GET
                    // request will be needed for this error
                    pings.count -= 1;
                }

                // Log the response info to the Heads model (this will also log
                // it to the Urls model
                headIO.writeHeadsEntry(reqDateTime, urlName, fullUrl, urlId, res.statusCode);

            // If the request method is GET, this was a follow-up request for 
            // a full page. Log this in the errors log.
            } else if (method === 'GET') {
                // Get the current date for logging
                var reqTime = new Date();

                // Log the error response to MongoDB
                errorIO.writeErrorEntry(res.statusCode, urlName, fullUrl, urlId, 
                    urlGroupId, reqTime, pageData);
            }

            // Increment the response counter
            pings.count += 1;

            /* If this is the last response, then kick off the process to
             * tally URL response data at the URL Group level. But first wait a
             * few seconds (wait time modifyable in config) to ensure that all
             * the async db calls from the ping response logging have completed.
             */
            if (pings.count === urlCount) {
                setTimeout(function() {
                    UrlGroupsIO.updateAllUrlGroupResponses(pingUrlGroups, reqDateTime);
                }, config.urlGroupQueryWait);
            }
        });
    };
}