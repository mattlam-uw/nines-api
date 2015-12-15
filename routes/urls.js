// Node.js Module Dependencies
var express = require('express');
var router = express.Router();
var path = require('path');

// Model Dependency
var Urls = require('../models/Urls.js');

// Define constants. These may later be placed in a config file.
const URLS_FILE_PATH = path.join(__dirname, '..', 'httpinger', 'data', 'urls.json');

/* GET (retrieve all urls data -- provided in one object) */
// NOTE: Keeping it simple for now. I may decide in the future to provide
//       separate GET requests for URL name, host, and path. But for now, just
//       returning the whole object
router.get('/', function(req, res, next) {
    Urls.getUrlData(URLS_FILE_PATH, function(urls) {
        res.json(urls);
    });
});

module.exports = router;