/**
 * API Router for /urls
 * Translates API URL (resource) calls to calls against IO methods for Urls Model.
 * Current Urls model is MongoDB-based. If a different database is to be used,
 * then a new IO methods file for the model will need to be provided and
 * required here in place of urlIO_API_Mongo.js
 */

// Node.js Module Dependencies
var express = require('express');
var router = express.Router();
var path = require('path');

// Local Module Dependencies
var Urls = require('../modules/urlsIO_API_Mongo.js'); // Urls model IO
var config = require('../modules/config-convey'); // Config data

/* GET (retrieve all error data -- provided in one object) */
// NOTE: Keeping it simple for now. I may decide in the future to provide
//       separate GET requests for status codes, associated counts, and
//       associated file names. But for now, just returning the whole object
router.get('/', function(req, res, next) {
    Urls.getUrls(function(data) {
        res.json(data);
    });
});

module.exports = router;
