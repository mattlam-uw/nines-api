/**
 * IO Interface for MongoDB collection defined and supported by Mongoose Schema
 * outlined in Heads_Mongo.js model
 **/

// Dependencies:
var mongoose = require('mongoose');
var Heads = require('../../models/Heads_Mongo');

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
        Heads.find(function(err, heads) {
            if (err) console.log(err);
            if (heads) {
                var results = [];
                var errTotal = 0;
                var resTotal = 0;
                var availabilityRating = 0;
                for (var i = 0; i < heads.length; i++) {
                    if (heads[i].url_id == urlID) {
                        if (heads[i].status_code >= 400) {
                            errTotal += 1;
                        }
                        resTotal += 1;
                    }
                }
                availabilityRating = (1 - errTotal / resTotal) * 100;
                console.log('Availability Rating for'
                    + urlID + ": ");
                console.log(availabilityRating);
            }
        });
    });
};