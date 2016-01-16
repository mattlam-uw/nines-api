/**
 * API Router for /urlgroups-urls
 * Translates API URL Group Urls (resource) calls to calls against IO methods for
 * UrlGroupsUrls Model. Current UrlGroupsUrls model is MongoDB-based. If a
 * different database is to be used, then a new IO methods file for the model
 * will need to be provided and required here in place of
 * urlgroupurls_API_IO_Mongo.js
 */

// Node.js Module Dependencies
var express = require('express');
var router = express.Router();

// Local Module Dependencies
// UrlGroups-Urls model IO
var UrlGroupUrls = require('../models/urlgroupurls_API_IO_Mongo.js');

// GET (retrieve all) url group - url relationship data
router.get('/', function(req, res, next) {
    UrlGroupUrls.getUrlGroupUrls(function(data) {
        res.json(data);
    });
});

// POST (create one) url group url entry
router.post('/', function(req, res, next) {
    UrlGroupUrls.postUrlGroupUrl(req, function(data) {
        res.json(data);
    });
});

module.exports = router;
