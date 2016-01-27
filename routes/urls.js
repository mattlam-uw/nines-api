/**
 * API Router for /urls
 * Translates API URL (resource) calls to calls against IO methods for Urls Model.
 * Current Urls model is MongoDB-based. If a different database is to be used,
 * then a new IO methods file for the model will need to be provided and
 * required here in place of url_API_IO_Mongo.js
 */

// Node.js Module Dependencies
var express = require('express');
var router = express.Router();

// Local Module Dependencies
var Urls = require('../models/urls_API_IO_Mongo.js'); // Urls model IO
var Heads = require('../models/heads_API_IO_Mongo.js'); // Heads model IO

// GET (retrieve all) url data
router.get('/', function(req, res, next) {
    Urls.getUrls(function(data) {
        res.json(data);
    });
});

// POST (create one) url entry
router.post('/', function(req, res, next) {
   Urls.postUrl(req, function(data) {
       res.json(data);
   });
});

// DELETE (remove one) url by id and remove all Heads documents associated with
// the URL
router.delete('/:id', function(req, res, next) {
    Urls.deleteUrl(req, function(data) {
        res.json(data);
        console.log('data:', data);
    });
});

module.exports = router;
