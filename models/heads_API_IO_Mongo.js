/**
 * Nines API IO Interface for MongoDB collection defined and supported by
 * Mongoose Schema outlined in Errors_Mongo.js model
 **/

// Node Module Dependencies
var mongoose = require('mongoose');

// Local Module Dependencies
var Heads = require('../models/Heads_Mongo');

/**
 * API Methods
 */

// Retrieve all Heads documents
exports.getHeads = function(callback) {
    Heads.find(function(err, returnVal) {
        if (err) return next(err);
        callback(returnVal);
    });
};


