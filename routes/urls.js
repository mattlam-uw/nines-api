// Node.js Module Dependencies
var express = require('express');
var router = express.Router();
var path = require('path');

// Model Dependency
var Urls = require('../models/Urls.js');
// Config data dependency
var config = require('../modules/config-convey');


/* GET (retrieve all urls data -- provided in one object) */
// NOTE: Keeping it simple for now. I may decide in the future to provide
//       separate GET requests for URL name, host, and path. But for now, just
//       returning the whole object
router.get('/', function(req, res, next) {
    Urls.getUrlData(config.urlsFilePath, function(urls) {
        res.json(urls);
    });
});

module.exports = router;
