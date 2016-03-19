/**
 * Nines Pinger internal IO Interface for MongoDB collection defined and
 * supported by Mongoose Schema outlined in Errors_Mongo.js model
 **/

// Node Module Dependencies
var mongoose = require('mongoose');

// Local Module Dependencies
var Errors = require('../../models/Errors_Mongo');
var logger = require('../../modules/logger.js'); // Logging module

/**
 * Errors model IO methods
 */

// Create new MongoDB doc in Errors collection for a request error occurrence
exports.writeErrorEntry = function(statusCode, urlName, url,
    urlId, urlGroupId, requestDateTime, responseData) {

    // Create a new error log entry from data passed to this function
    var newErrorEntry = Errors({
        status_code: statusCode,
        url_name: urlName,
        url: url,
        url_id: urlId,
        urlgroup_id: urlGroupId,
        response: responseData,
        request_datetime: requestDateTime
    });

    // Save the new error log entry to MongoDB
    newErrorEntry.save(function(err) {
        if (err) logger.error(err);
        logger.info('GET response | status code: ' + statusCode +
                    ' | URL Name: ' + urlName + ' | URL: ' + url);
    });
};