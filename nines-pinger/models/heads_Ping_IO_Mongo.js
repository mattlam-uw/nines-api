/**
 * IO Interface for MongoDB collection defined and supported by Mongoose Schema
 * outlined in Heads_Mongo.js model
 **/

// Dependencies:
var mongoose = require('mongoose');
var Heads = require('../../models/Heads_Mongo');
var Urls = require('../../models/Urls_Mongo');
var UrlGroups = require('../../models/UrlGroups_Mongo');

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

    // Save the new Heads entry to MongoDB and update the Urls and UrlGroups
    // models to increment the response and error totals accordingly for this
    // URL's response
    newHeadsEntry.save(function(err, head) {
        if (err) console.log(err);
        console.log('HEAD request logged');

        // Update the response and error totals on Urls model doc for this URL
        Urls.findOne(
            { '_id': head.url_id },
            function(err, url) {
                if (err) console.log(err);

                // Increment the appropriate status code response total for URL
                var newResponses = url.responses;
                if (!newResponses[head.status_code]) {
                    newResponses[head.status_code] = 1;
                } else {
                    newResponses[head.status_code] += 1;
                }

                Urls.update(
                    { '_id': url._id },
                    { 'responses': newResponses },
                    function(err, numAffected) {
                        if (err) console.log(err);
                    }
                );

                // Update the response and error totals on UrlGroups model doc
                // for the URL Group that this URL belongs to
                UrlGroups.findOne(
                    { '_id': url.urlgroup_id },
                    function(err, urlgroup) {
                        if (err) console.log(err);

                        // Increment the appropriate status code response total for URL
                        var newResponses = urlgroup.responses;
                        if (!newResponses[head.status_code]) {
                            newResponses[head.status_code] = 1;
                        } else {
                            newResponses[head.status_code] += 1;
                        }

                        UrlGroups.update(
                            { '_id': urlgroup._id },
                            { 'responses': newResponses },
                            function(err, numAffected) {
                                if (err) console.log(err);
                            }
                        );
                    }
                );
            }
        );
    });
};