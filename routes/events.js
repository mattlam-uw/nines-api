/**
 * API Router for /events
 * Translates API URL (resource) calls to calls against IO methods for Events Model.
 * Current Events model is MongoDB-based. If a different database is to be used,
 * then a new IO methods file for the model will need to be provided and
 * required here in place of events_API_IO_Mongo.js
 */

// Node.js Module Dependencies
var express = require('express');
var router = express.Router();
var path = require('path');

// Local Module Dependencies
var Events = require('../models/events_API_IO_Mongo.js'); // Mongo-based Events model IO

/* GET (retrieve all error data -- provided in one object) */
// NOTE: Keeping it simple for now. I may decide in the future to provide
//       separate GET requests for status codes, associated counts, and
//       associated file names. But for now, just returning the whole object
router.get('/', function(req, res, next) {
    Events.getEvents(function(data) {
        res.json(data);
    });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// EVERYTHING BELOW MUST BE REFACTORED
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/* GET status codes */
router.get('/codes', function(req, res, next) {
    Errors.getReqErrStats(config.logFileDir, function(errors) {
        var statusCodes = [];
        // iterate over errors object and add codes to array
        for (var code in errors) {
            statusCodes.push(code);
        }
        res.json(statusCodes);
    });
});

/* GET count for given status code */
router.get('/:id/count', function(req, res, next) {
    Errors.getReqErrStats(config.logFileDir, function(errors) {
        var result = [];
        result.push(errors[req.params.id].count);
        res.json(result);
    });
});

/* GET file names for given status code */
router.get('/:id/files', function(req, res, next) {
    Errors.getReqErrStats(config.logFileDir, function(errors) {
        res.json(errors[req.params.id].files);
    });
});

module.exports = router;