/**
 * Nines API IO Interface for MongoDB collection defined and supported by
 * Mongoose Schema outlined in Errors_Mongo.js model
 **/

// Node Module Dependencies
var mongoose = require('mongoose');

// Local Module Dependencies
var Errors = require('../models/Errors_Mongo');
var logger = require('../modules/logger.js');

/**
 * API Methods
 */

// Return all error documents from errors collection
exports.getErrors = function(callback) {
    Errors.find(function(err, returnArr) {
        if (err) logger.error(err);
        callback(returnArr);
    });
};

// Return error documents having requested urlgroup ID from errors collection
exports.getErrorsByUrlGroup = function(req, callback) {
    Errors.find({ urlgroup_id: req.params.id }, function(err, returnArr) {
        if (err) logger.error(err);
        callback(returnArr);
    });
};

// Return single error document having requested error ID
exports.getErrorById = function(req, callback) {
    Errors.find({ _id: req.params.id }, function(err, returnVal) {
        if (err) logger.error(err);
        callback(returnVal);
    });
};

// Delete all Error documents having URL Group ID provided as request parameter
exports.deleteUrlGroupErrors = function(req, callback) {
    Errors.find({ urlgroup_id: req.params.id }).remove( function(err, returnVal) {
        if (err) logger.error(err);
        callback(returnVal);
    });
};

// Delete an existing URL Group
exports.deleteUrlGroup = function(req, callback) {
    UrlGroups.findByIdAndRemove(req.params.id, function(err, returnVal) {
        if (err) return next(err);
        callback(returnVal);
    });
};
