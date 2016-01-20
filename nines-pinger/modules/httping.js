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
 * page response.
 **/

// Node.js Module Dependencies
var http = require('http'); // Used to make HTTP requests

// Local Module Dependencies
var config = require('../../modules/config-convey'); // Config data from config.js
var db = require('../../modules/database.js'); // Open and close DB connections
var errorIO = require('../models/errors_Ping_IO_Mongo.js'); // Errors model IO ops
var headIO = require('../models/heads_Ping_IO_Mongo.js'); // Heads model IO ops

/* ----------------------------------------------------------------------------
   Functions exposed to client code
   ------------------------------------------------------------------------- */

// Function to run through and ping all defined URLs
exports.pingUrls = function(arrUrls) {
    // Check for URL data passed to function. If the array is empty, then close 
    // the database connection end return out of this function
    if (arrUrls[0] === undefined) {
        console.log('Error - no URL data provided');
        db.closeConnection();
        return;
    }

    // The database connection will be closed following a timed delay after the
    // last ping request has been sent. This Object will be used to store the
    // timer controlling the delay. I am using and object because it will be
    // passed by reference. Thus, each callback will not have its own delay
    // timer instance. The same instance will be used by all callbacks.
    var dbCloseTimer = {};

    // URL data has been received, so iterate through the array of objects 
    // containing the URLs and send requests for each URL
    for (var i = 0; i < arrUrls.length; i++) {
        var reqMethod = 'HEAD'; // Method of http request to be sent
        var reqDateTime = new Date(); // Timestamp for request

        // Generate request options
        var options = generateOptions(arrUrls[i].host, arrUrls[i].path, reqMethod);

        // Generate request callback
        var callback = generateCallback(arrUrls[i].name, arrUrls[i].host,
            arrUrls[i].path, arrUrls[i].protocol, arrUrls[i]._id, reqMethod,
            reqDateTime, dbCloseTimer);

        // Send the request as http or https depending on protocol specified
        if (arrUrls[i].protocol === 'http') {
            var req = http.request(options, callback);
            req.on('error', function(err) {
                console.log('Likely an incorrectly formed domain', err);
            });
            req.end();
        } else if (arrUrls[i].protocol === 'https') {
            // https capability coming in the future
        } else {
            // some protocol other than http and https was specified
            console.log(
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
function generateCallback(urlName, urlHost, urlPath, urlProtocol, urlID,
                          method, reqDateTime, timer) {

    return function(res) {

        // Output the response body (web page code)
        var pageData = '';

        // The way streaming works in node.js, you must listen for and consume 
        // the response data in order for the response 'end' event to be fired. 
        res.on('data', function(data) {    
            pageData += data;
        });

        // Upon response completion, kick off a follow-up request if needed and
        // log the response info
        res.on('end', function() {
            // If the request method is HEAD, log the output from the response.
            // If the status code was >= threshold set in config.js, then do a 
            // follow-up GET request to retrieve the full page data.
            if (method == 'HEAD') {
                
                // If status code >= threshold set in config.js, follow-up with 
                // a GET request.
                if (res.statusCode >= config.statusCodeThreshold) {
                    // Set up for the follow-up request
                    var fullReqOptions = generateOptions(urlHost, urlPath, 'GET');
                    var fullReqCallback = generateCallback(urlName, urlHost,
                            urlPath, urlProtocol, urlID, 'GET', reqDateTime,
                            timer);
                    // Execute the follow-up request
                    http.request(fullReqOptions, fullReqCallback).end();
                }

                // Add log of this request to the events Log
                /*
                var eventType = urlProtocol + ' request';
                var eventDescription = 'name: ' + urlName + '\n'
                                     + 'host: ' + urlHost + '\n'
                                     + 'path: ' + urlPath + '\n'
                                     + 'response code: ' + res.statusCode;
                */

                headIO.writeHeadsEntry(reqDateTime, urlID, res.statusCode);

                // Close the database connection. Because there may be one or
                // more outstanding responses to receive and log, we want to
                // give those responses a chance to be received. We'll set a
                // timer such that the db connection will be closed when the
                // timer expires. This timer is set with the first response,
                // and then cancelled and set anew with each subsequent
                // response. The timer delay time is set by config.dbCloseWait.
                if (timer.dbCloseTimer) {
                    clearTimeout(timer.dbCloseTimer);
                }
                timer.dbCloseTimer = setTimeout(function() {
                    db.closeConnection();
                }, config.dbCloseWait);

            // If the request method is GET, this was a follow-up request for 
            // a full page. Log this in the errors log.
            } else if (method === 'GET') {
                // Get the current date for logging
                var reqTime = new Date();
                // Combine protocol host and path into a URL for logging
                var fullUrl = urlProtocol + "://" +  urlHost + urlPath;

                // Log the error response to MongoDB
                errorIO.writeErrorEntry(res.statusCode, urlName, fullUrl, reqTime, pageData);
            }
        });
    };
}