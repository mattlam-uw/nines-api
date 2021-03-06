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
var logger = require('../modules/logger.js');

// Local Module Dependencies
var Urls = require('../models/urls_API_IO_Mongo.js'); // Urls model IO

// GET (retrieve all) url data
router.get('/', function(req, res, next) {
    Urls.getUrls(function(data) {
        res.json(data);
    });
});

// GET url documents for urls having given urlgroup_id
router.get('/urlgroup/:id', function(req, res, next) {
   Urls.getUrlsByUrlGroup(req, function(data) {
       res.json(data);
   })
});

// POST (create one) url entry
router.post('/', function(req, res, next) {
   Urls.postUrl(req, function(data) {
       res.json(data);
   });
});

// PUT (update one) url
router.put('/:id', function(req, res, next) {
    Urls.updateUrl(req, function(data) {
        res.json(data);
    })
});

// DELETE (remove one) url by id
router.delete('/:id', function(req, res, next) {
    Urls.deleteUrl(req, function(data) {
        res.json(data);
        logger.info('Removing url:', data);
    });
});

module.exports = router;
