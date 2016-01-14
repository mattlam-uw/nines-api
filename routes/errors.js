/**
 * API Router for /errors
 * Translates API URL (resource) calls to calls against IO methods for Errors Model.
 * Current Errors model is MongoDB-based. If a different database is to be used,
 * then a new IO methods file for the model will need to be provided and
 * required here in place of errors_API_IO_Mongo.js
 */

// Node.js Module Dependencies
var express = require('express');
var router = express.Router();

// Local Module Dependencies
var Errors = require('../models/errors_API_IO_Mongo.js'); // Mongo-based Errors model IO

// GET (retrieve all error data -- provided in one object)
router.get('/', function(req, res, next) {
    Errors.getErrors(function(data) {
        res.json(data);
    });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// EVERYTHING BELOW MUST BE REFACTORED
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/*
// GET status codes
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

// GET count for given status code
router.get('/:id/count', function(req, res, next) {
    Errors.getReqErrStats(config.logFileDir, function(errors) {
        var result = [];
        result.push(errors[req.params.id].count);
        res.json(result);
    });
});

// GET file names for given status code
router.get('/:id/files', function(req, res, next) {
    Errors.getReqErrStats(config.logFileDir, function(errors) {
        res.json(errors[req.params.id].files);
    });
});
*/

module.exports = router;
