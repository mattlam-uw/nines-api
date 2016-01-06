/**
 * This module contains all methods needed to use the given URL data to send
 * requests to the URLs. The only method currently exposed for client code
 * use is pingUrls(). All other methods are used within this module.
 *
 * The initial request to a URL is always just a request for the response
 * headers (method = 'HEAD'). If the response for any request results in a
 * status code of 400 or more, then a full-page (method = 'GET') follow-up
 * request is sent to the URL in order to get any valuable error message
 * information that might be included in the page response.
 */

// Node.js Module Dependencies
var http = require('http'); // Used to make HTTP requests
var path = require('path'); // Used for creating urls to file resources

// Define constants. These may later be placed in a config file.
const ROOT_DIR = path.join(__dirname, '..', '..');

// Require local modules for interacting with Errors and Events models
var db = require(ROOT_DIR + '/modules/database.js');
var errorIO = require(ROOT_DIR + '/nines-pinger/modules/errorIO_Mongo.js');
var eventIO = require(ROOT_DIR + '/nines-pinger/modules/eventIO_Mongo.js');

// Function to run through and ping all defined urls
exports.pingUrls = function(arrUrls) {
    // Don't do anything if no parameter values provided
    if (!arrUrls) {
        console.log('Error - no URL data provided');
        return;
    }

    // Iterate through the array of objects containing the URLs to ping and
    // send a request for each URL
    for (var i = 0; i < arrUrls.length; i++) {
        var reqMethod = 'HEAD'; // Method of http request to be sent
        var reqDateTime = new Date(); // Timestamp for request

        // Generate request options
        var options = generateOptions(arrUrls[i].host, arrUrls[i].path, reqMethod);

        // Generate request callback
        var callback = generateCallback(arrUrls[i].name, arrUrls[i].host,
            arrUrls[i].path, arrUrls[i].protocol, reqMethod, reqDateTime, i,
            arrUrls.length);

        // Send the request as http or https depending on protocol specified
        if (arrUrls[i].protocol == 'http') {
            var req = http.request(options, callback);
            req.end();
        } else if (arrUrls[i].protocol == 'https') {
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

// Function to generate options to be used for http.request
function generateOptions(host, path, method) {
    return {
        method: method,
        host: host,
        path: path
    };
}

// Function to generate a callback to be used for http.request
function generateCallback(urlName, urlHost, urlPath, urlProtocol, method,
                          reqDateTime, iteration, arrUrlsLength) {

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
            // If the status code was >= 400 as well, then do a follow-up GET
            // request to retrieve the full page data.
            if (method == 'HEAD') {
                
                // If status code >= 400, follow-up with a GET request.
                if (res.statusCode >= 400) {
                    // Set up for the follow-up request
                    var fullReqOptions = generateOptions(urlHost, urlPath, 'GET');
                    var fullReqCallback = generateCallback(urlName, urlHost,
                            urlPath, urlProtocol, 'GET', reqDateTime, iteration,
                            arrUrlsLength);
                    // Execute the follow-up request
                    http.request(fullReqOptions, fullReqCallback).end();
                }

                // Add log of this request to the General Log
                var eventType = urlProtocol + ' request';
                var eventDescription = 'name: ' + urlName + '\n'
                                     + 'host: ' + urlHost + '\n'
                                     + 'path: ' + urlPath + '\n'
                                     + 'response code: ' + res.statusCode;

                eventIO.writeEventEntry(reqDateTime, eventType, eventDescription);

                // Check to see if this is the last of the request batch. If it
                // is, then close the MongoDB connection following a 10 second
                // wait. I was unable to come up with a more elegant solution
                // for closing the MongoDB connection without stepping on any
                // possible pending log writes. I think this is pretty safe.
                if (iteration == arrUrlsLength - 1) {
                    setTimeout(
                        function() {
                            if (db.closeConnection()) {
                                console.log('Database connection closed');
                            } else {
                                console.log('Failed to close database connection');
                            }
                        },
                        10000
                    );
                }
            
            // If the request method is GET, this was a follow-up request for 
            // a full page. Log this in a separate file. Each follow-up request
            // gets its own file. The name of the file will be:
            // "err-[timestamp]-[name for URL].html
            } else if (method == 'GET') {
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
