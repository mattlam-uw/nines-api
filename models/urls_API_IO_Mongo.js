/**
 * Nines API IO Interface for MongoDB collection defined and supported by
 * Mongoose Schema outlined in Urls_Mongo.js model
 **/

// Node Module Dependencies
var mongoose = require('mongoose');

// Local Module Dependencies
var Urls = require('../models/Urls_Mongo');

/**
 * API Methods
 */

exports.getUrls = function(callback) {
    Urls.find(function(err, returnVal) {
        if (err) return next(err);
        callback(returnVal);
    });
}
