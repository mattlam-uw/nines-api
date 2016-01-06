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

// Node.js Module Dependencies
var path = require('path'); // Used for creating urls to file resources

// Define constants. These may later be placed in a config file.
const ROOT_DIR = path.join(__dirname, '..');

// Require local modules for interacting with Errors and Events models
var db = require(ROOT_DIR + '/modules/database.js');

// Require local modules
var httping = require(__dirname + '/modules/httping.js');
var urlsIO = require(__dirname + '/modules/urlsIO_Mongo.js');

// Open a database connection
db.openConnection();

/**
 * Callback function to be passed with call to getUrls(). This function will
 * send off a batch of requests to the URLs retrieved from the model. We need
 * to kick off the requests from within the callback in order to ensure that
 * the async calls to retrieve URL data from the model have completed.
 **/
var cbGetUrlData = function(urlData) {
    // Kick off a set of HTTP requests
    httping.pingUrls(urlData);
};

// Call getUrls() with the above callback in order to get the URLs and kick
// off the requests
urlsIO.getUrls(cbGetUrlData);
