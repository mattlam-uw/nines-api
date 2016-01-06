/**
 * IO Interface for MongoDB collection defined and supported by Mongoose Schema
 * outlined in Errors_Mongo.js model
 **/

// Dependencies:
var mongoose = require('mongoose');
var Errors = require('../../models/Errors_Mongo');

/**
 * Errors model methods
 */

// Create new MongoDB doc in Errors collection for a request error occurrence
exports.writeErrorEntry = function(statusCode, resourceName, resourceUrl, requestDateTime, responseData) {

    // Create a new error log entry from data passed to this function
    var newErrorEntry = Errors({
        status_code: statusCode,
        resource_name: resourceName,
        resource_url: resourceUrl,
        response: responseData,
        request_datetime: requestDateTime
    });

    // Save the new error log entry to MongoDB
    newErrorEntry.save(function(err) {
        if (err) console.log(err);
        console.log('Error Log Entry Added');
    });
};