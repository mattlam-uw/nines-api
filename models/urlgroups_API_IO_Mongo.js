/**
 * Nines API IO Interface for MongoDB collection defined and supported by
 * Mongoose Schema outlined in UrlGroups_Mongo.js model
 **/

// Node Module Dependencies
var mongoose = require('mongoose');

// Local Module Dependencies
var UrlGroups = require('../models/UrlGroups_Mongo');

/**
 * API Methods
 */

// Retrieve all URL Groups data
exports.getUrlGroups = function(callback) {
    UrlGroups.find(function(err, returnVal) {
        if (err) return next(err);
        callback(returnVal);
    });
}

/* ENABLE WHEN READY

// Post a new URL Group
exports.postUrlGroup = function(req, callback) {
    Urls.create(req.body, function(err, returnVal) {
        if (err) return next(err);
        callback(returnVal);
    });
}

*/