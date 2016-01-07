/**
 * Nines API IO Interface for MongoDB collection defined and supported by
 * Mongoose Schema outlined in Errors_Mongo.js model
 **/

// Node Module Dependencies
var mongoose = require('mongoose');

// Local Module Dependencies
var Errors = require('../models/Errors_Mongo');

/**
 * API Methods
 */

exports.getErrors = function(callback) {
    Errors.find(function(err, returnVal) {
        if (err) return next(err);
        callback(returnVal);
    });
}
