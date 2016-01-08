/**
 * IO Interface for MongoDB collection defined and supported by Mongoose Schema
 * outlined in Eveents_Mongo.js model
 **/

// Dependencies:
var mongoose = require('mongoose');
var Events = require('../../models/Heads_Mongo');

/**
 * Events model methods
 */

// Create new MongoDB doc in Events collection for a general event (e.g. URL ping)
exports.writeEventEntry = function(eventDateTime, urlID, statusCode) {
    // Create a new general log entry from data passed to this function
    var newEventEntry = Events({
        datetime: eventDateTime,
        url_id: urlID,
        status_code: statusCode
    });

    // Save the new general log entry to MongoDB
    newEventEntry.save(function(err) {
        if (err) console.log(err);
        console.log('HEAD request logged');
    });
};