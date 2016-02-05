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

// Retrieve all URL data
exports.getUrls = function(callback) {
    Urls.find(function(err, returnVal) {
        if (err) return next(err);
        callback(returnVal);
    });
};

// Post a new URL
exports.postUrl = function(req, callback) {
    Urls.create(req.body, function(err, returnVal) {
        if (err) return next(err);
        callback(returnVal);
    });
};

// Put (modify) a URL
exports.updateUrl = function(req, callback) {
    Urls.findByIdAndUpdate(req.params.id, req.body, function(err, returnVal) {
        if (err) return next(err);
        callback(returnVal);
    })
};

// Delete an existing URL
exports.deleteUrl = function(req, callback) {
    Urls.findByIdAndRemove(req.params.id, function(err, returnVal) {
        if (err) return next(err);
        callback(returnVal);
    })
};
