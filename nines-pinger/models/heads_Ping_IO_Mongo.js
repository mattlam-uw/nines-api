/**
 * IO Interface for MongoDB collection defined and supported by Mongoose Schema
 * outlined in Heads_Mongo.js model
 **/

// Dependencies:
var mongoose = require('mongoose');
var Heads = require('../../models/Heads_Mongo');
var Urls = require('../../models/Urls_Mongo');

// Global variables that should be converted to constants set by config
var errorThreshold = 400;

/**
 * Heads model methods
 */

// Create new MongoDB doc in Heads collection for a response to HEAD request
// for this URL. Also update the Urls collection to appropriately increment the
// response and error totals for this URL.
exports.writeHeadsEntry = function(reqDateTime, urlID, statusCode) {
    // Create a new Heads entry from data passed to this function
    var newHeadsEntry = Heads({
        datetime: reqDateTime,
        url_id: urlID,
        status_code: statusCode
    });

    // Save the new Heads entry to MongoDB and update the Urls model to
    // appropriately increment the response and error totals for this URL
    newHeadsEntry.save(function(err, head) {
        if (err) console.log(err);
        console.log('HEAD request logged');

        // Get the Urls model doc for this URL
        Urls.findOne(
            { '_id': head.url_id },
            function(err, url) {
                if (err) console.log(err);

                // If the status code for the HEAD request response was equal
                // to or greater than the error threshold, then the error
                // total for this URL will need to be incremented by 1
                var errIncrement = 0;
                if (head.status_code >= errorThreshold) {
                    errIncrement = 1;
                }

                // Increment the response and error totals for URL
                Urls.update(
                    { '_id': head.url_id },
                    {
                        'response_total': url.response_total + 1,
                        'error_total': url.error_total + errIncrement
                    },
                    function(err, numAffected) {
                        if (err) console.log(err);
                    }
                );
            }
        );
    });
};