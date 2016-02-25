/**
 * Main application file
 *
 * Node.js Module Dependencies
 *   mongoose
 *
 * Internal Module Dependencies
 *   ./modules/httping.js
 *   ./modules/urlsIO_Mongo.js
 *
 */

// Require local modules for interacting with models
var db = require('../modules/database.js');

// Require local modules
var httping = require('./modules/httping.js');
var urlsIO = require('./models/urls_Ping_IO_Mongo.js');

// Open a database connection
db.openConnection();

/**
 * Callback function to be passed with call to getUrls(). This function will
 * send off a batch of requests to the URLs retrieved from the model. We need
 * to kick off the requests from within the callback in order to ensure that
 * the async calls to retrieve URL data from the model have completed.
 **/
var cbGetUrlData = function(urlData, pingUrlGroups) {
    // Kick off a set of HTTP requests
    httping.pingUrls(urlData, pingUrlGroups);
};

// Call getUrls() with the above callback in order to get the URLs and kick
// off the requests
urlsIO.getUrls(cbGetUrlData);
