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
// Create new MongoDB doc in Heads collection for a response to HEAD request
exports.writeHeadsEntry = function(reqDateTime, urlID, statusCode) {
    // Create a new general log entry from data passed to this function
    var newHeadsEntry = Heads({
        datetime: reqDateTime,
        url_id: urlID,
        status_code: statusCode
    });

    // Save the new Heads entry to MongoDB
    newHeadsEntry.save(function(err, heads) {
        if (err) console.log(err);
        console.log('HEAD request logged');
        Urls.find({ '_id': heads.url_id }, 'response_total error_total', function(err, urls) {
            if (err) console.log(err);
            console.log('response total:', urls.response_total);
            console.log('error total:', urls.error_total);
        });
        /*
        Heads.find(function(err, heads) {
            if (err) console.log(err);
            if (heads) {
                var results = [];
                var errTotal = 0;
                var resTotal = 0;
                for (var i = 0; i < heads.length; i++) {
                    if (heads[i].url_id == urlID) {
                        if (heads[i].status_code >= errorThreshold) {
                            errTotal += 1;
                        }
                        resTotal += 1;
                    }
                }
            }
        });
        */
    });
};