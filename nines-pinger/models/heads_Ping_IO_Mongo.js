/**
 * IO Interface for MongoDB collection defined and supported by Mongoose Schema
 * outlined in Heads_Mongo.js model
 **/

// Dependencies:
var mongoose = require('mongoose');
var Heads = require('../../models/Heads_Mongo');
var UrlIO = require('./urls_Ping_IO_Mongo');
var logger = require('../../modules/logger.js'); // Logging module

/**
 * Heads model methods
 */

// Create new MongoDB doc in Heads collection for a response to HEAD request
// for this URL. Also update the Urls collection to appropriately increment the
// response and error totals for this URL.
exports.writeHeadsEntry = function(reqDateTime, urlName, fullUrl, urlID, statusCode) {
    // Create a new Heads entry from data passed to this function
    var newHeadsEntry = Heads({
        datetime: reqDateTime,
        url_id: urlID,
        status_code: statusCode
    });

    // Save the new Heads entry to MongoDB and update the Urls and UrlGroups
    // models to increment the response and error totals accordingly for this
    // URL's response
    newHeadsEntry.save(function(err, head) {
        if (err) logger.error(err);
        logger.info('HEAD response | status code: ' + statusCode +
            ' | URL Name: ' + urlName + ' | URL: ' + fullUrl);

        // Update the response and error totals on Urls model doc for this URL
        // UrlIO.updateUrlResponses(head.url_id, head.status_code);
    });
};