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

router.get('/urlgroup/:id', function(req, res, next) {
	Errors.getErrorsByUrlGroup(req, function(data) {
		res.json(data);
	});
});

router.get('/response/:id', function(req, res, next) {
    Errors.getErrorById(req, function(data) {
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(data[0].response);
        console.log(data[0].response);
        res.end();
    });
});

module.exports = router;
