/**
 * Nines API IO Interface for MongoDB collection defined and supported by
 * Mongoose Schema outlined in Errors_Mongo.js model
 **/

// Node Module Dependencies
var mongoose = require('mongoose');

// Local Module Dependencies
var Events = require('../models/Events_Mongo');

/**
 * API Methods
 */

exports.getEvents = function(callback) {
    Events.find(function(err, returnVal) {
        if (err) return next(err);
        callback(returnVal);
    });
}
