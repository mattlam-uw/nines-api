/**
 * IO Interface for MongoDB collection defined and supported by Mongoose Schema
 * outlined in Eveents_Mongo.js model
 **/

// Dependencies:
var mongoose = require('mongoose');
var Events = require('../../models/Events_Mongo');

/**
 * Events model methods
 */

// Create new MongoDB doc in Events collection for a general event (e.g. URL ping)
exports.writeEventEntry = function(eventDateTime, eventType, eventDescription) {
    // Create a new general log entry from data passed to this function
    var newEventEntry = Events({
        event_datetime: eventDateTime,
        event_type: eventType,
        event_description: eventDescription
    });

    // Save the new general log entry to MongoDB
    newEventEntry.save(function(err) {
        if (err) console.log(err);
        console.log('General Log Entry Added');
    });
};