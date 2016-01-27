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
    })
})

module.exports = router;
