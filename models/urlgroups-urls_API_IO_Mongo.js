/**
 * Nines API IO Interface for MongoDB collection defined and supported by
 * Mongoose Schema outlined in UrlGroups-Urls_Mongo.js model
 **/

// Node Module Dependencies
var mongoose = require('mongoose');

// Local Module Dependencies
var Urls = require('../models/UrlGroups-Urls_Mongo');

/**
 * API Methods
 */

// Retrieve all URL Groups - URL relationship data
exports.getUrlGroupsUrls = function(callback) {
    Urls.find(function(err, returnVal) {
        if (err) return next(err);
        callback(returnVal);
    });
}

// Post a new URL Group - URL relationship
exports.postUrlGroupsUrl = function(req, callback) {
    Urls.create(req.body, function(err, returnVal) {
        if (err) return next(err);
        callback(returnVal);
    });
}
