/**
 * IO Interface for MongoDB collection defined and supported by Mongoose Schema
 * outlined in ErrorsMongo.js model
 **/

// Dependencies:
// -- Express Router
var express = require('express');
var router = express.Router();
// -- ErrorsMongo mongoose model
var mongoose = require('mongoose');
var Errors = require('../../models/Errors');
var Events = require('../../models/Events');


/* GET (retrieve all) errors */
router.get('/', function(req, res, next) {
    Errors.find(function(err, returnVal) {
        if (err) return next(err);
        res.json(returnVal);
    });
});

/* GET (retrive all) errors by user_id */

/* POST (create new) error */
router.post('/', function(req, res, next) {
    Errors.create(req.body, function(err, returnVal) {
        if (err) return next(err);
        res.json(returnVal);
    })
});

// Create new MongoDB doc in Errors collection for a request error occurrence
exports.writeErrLogEntry = function(statusCode, resourceName, resourceUrl, requestDateTime, responseData) {

    // Create a new error log entry from data passed to this function
    var newErrLogEntry = Errors({
        status_code: statusCode,
        resource_name: resourceName,
        resource_url: resourceUrl,
        response: responseData,
        request_datetime: requestDateTime
    });

    // Save the new error log entry to MongoDB
    newErrLogEntry.save(function(err) {
        if (err) console.log(err);
        console.log('Error Log Entry Added');
    });
};

exports.writeGeneralLogEntry = function(eventDateTime, eventType, eventDescription) {
    // Create a new general log entry from data passed to this function
    var newGeneralLogEntry = Events({
        event_datetime: eventDateTime,
        event_type: eventType,
        event_description: eventDescription
    });

    // Save the new general log entry to MongoDB
    newGeneralLogEntry.save(function(err) {
        if (err) console.log(err);
        console.log('General Log Entry Added');
    });
};
