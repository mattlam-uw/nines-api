/**
 * Created by mattlam on 1/25/16.
 */

var UrlGroups = require('../../models/UrlGroups_Mongo');
var UrlIO = require('./urls_Ping_IO_Mongo');
var db = require('../../modules/database.js'); // Open and close DB connections
var logger = require('../../modules/logger.js'); // Module for logging

// Update all responses for a given URL Group
function updateUrlGroupResponses(urlGroupId, groupCount, groupsCount,
                                 responses, requestDateTime) {
    UrlGroups.update(
        { '_id': urlGroupId },
        {
            'responses': responses,
            'last_ping': requestDateTime
        },
        function(err, numAffected) {
            if (err) logger.error(err);
            // Increment the counter tracking the number of URL Groups for which
            // response totals are being qaueried to see if this is the last one.
            groupCount.count += 1;
            // If this is the last URL Group, then go ahead and close the db
            // connection
            if (groupCount.count === groupsCount) {
                db.closeConnection();
            }
        }
    );
}

// For URL Groups being pinged in this round, query and record response totals
// from all URLs that belong to the group
exports.updateAllUrlGroupResponses = function(pingUrlGroups, requestDateTime) {
    if (pingUrlGroups) {
        // Create a object for tracking the number of URL Groups for which
        // the response totals are being queried and recorded. Once the
        // db query and write operations for the last URL Group have
        // completed, then the db connection can be closed
        var groupCount = { count: 0 };
        // Iterate over the URL Groups to query, retrieve, and record
        // response totals
        for (var i = 0; i < pingUrlGroups.length; i++) {
            // Query Responses for a specific URL Group
            UrlIO.getUrlResponses(pingUrlGroups[i]._id, pingUrlGroups[i].name,
                function(urlGroupId, urlGroupName, responses) {
                    // And in the callback, write the newly tallied responses
                    // to the response totals for this URL Group
                    updateUrlGroupResponses(urlGroupId, groupCount,
                        (pingUrlGroups.length), responses, requestDateTime);
                }
            );
        }
    }
}