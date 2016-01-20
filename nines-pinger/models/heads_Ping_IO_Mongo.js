/**
 * IO Interface for MongoDB collection defined and supported by Mongoose Schema
 * outlined in Heads_Mongo.js model
 **/

// Dependencies:
var mongoose = require('mongoose');
var Heads = require('../../models/Heads_Mongo');

/**
 * Heads model methods
 */

// Create new MongoDB doc in Heads collection for a response to HEAD request
exports.writeHeadsEntry = function(reqDateTime, urlID, statusCode) {
    // Create a new general log entry from data passed to this function
    var newHeadsEntry = Heads({
        datetime: reqDateTime,
        url_id: urlID,
        status_code: statusCode
    });

    // Save the new Heads entry to MongoDB
    newHeadsEntry.save(function(err) {
        if (err) console.log(err);
        console.log('HEAD request logged');
    });
};