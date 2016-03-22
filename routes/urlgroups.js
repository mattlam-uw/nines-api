/**
 * API Router for /urlgroups
 * Translates API URL Groups (resource) calls to calls against IO methods for UrlGroups Model.
 * Current UrlGrouips model is MongoDB-based. If a different database is to be used,
 * then a new IO methods file for the model will need to be provided and
 * required here in place of urlgroups_API_IO_Mongo.js
 */

// Node.js Module Dependencies
var express = require('express');
var router = express.Router();
var logger = require('../modules/logger.js');

// Local Module Dependencies
var UrlGroups = require('../models/urlgroups_API_IO_Mongo.js'); // UrlGroups model IO

// GET (retrieve all) url group data
router.get('/', function(req, res, next) {
    UrlGroups.getUrlGroups(function(data) {
        res.json(data);
    });
});

// POST (create one) url group entry
router.post('/', function(req, res, next) {
    UrlGroups.postUrlGroup(req, function(data) {
        res.json(data);
    });
});

// PUT (update one) url group
router.put('/:id', function(req, res, next) {
    UrlGroups.updateUrlGroup(req, function(data) {
        res.json(data);
    });
});

// PUT (update one) url group to reset response data
router.put('/reset/:id', function(req, res, next) {
    UrlGroups.resetUrlGroup(req, function(data) {
       res.json(data); 
    });
});

// DELETE (remove one) url group by id
router.delete('/:id', function(req, res, next) {
    UrlGroups.deleteUrlGroup(req, function(data) {
        res.json(data);
        logger.info('Removing URL Group:', data);
    });
});

module.exports = router;
