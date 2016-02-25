/**
 * Created by mattlam on 1/25/16.
 */

var UrlGroups = require('../../models/UrlGroups_Mongo');
var UrlIO = require('./urls_Ping_IO_Mongo');
var db = require('../../modules/database.js'); // Open and close DB connections

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
            if (err) console.log(err);
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

// Retrieve all URL data from MongoDB-based Urls model
function getUrlGroups(callback) {
    UrlGroups.find(function(err, returnObj) {
        if(err) console.log(err);
        callback(returnObj);
    });
}

// For all URL Groups, query and record response totals from all URLs that
// belong to the group
exports.updateAllUrlGroupResponses = function(urlGroupIds, requestDateTime) {
    // Get all groups
    getUrlGroups(function(urlGroups) {
        // Only do anything if there is at least one URL Group
        if (urlGroups) {
            // Create a object for tracking the number of URL Groups for which
            // the response totals are being queried and recorded. Once the
            // db query and write operations for the last URL Group have
            // completed, then the db connection can be closed
            var groupCount = { count: 0 };
            // Iterate over the URL Groups to query, retrieve, and record
            // response totals
            for (var i = 0; i < urlGroups.length; i++) {
                // Query Responses for a specific URL Group
                if (urlGroupIds.indexOf(urlGroups[i]._id) > -1) {
                    UrlIO.getUrlResponses(urlGroups[i]._id, urlGroups[i].name,
                        function(urlGroupId, urlGroupName, responses) {
                            // And in the callback, write the newly tallied responses
                            // to the response totals for this URL Group
                            updateUrlGroupResponses(urlGroupId, groupCount,
                                (urlGroupIds.length - 1), responses, requestDateTime);
                        }
                    );
                }
            }
        }
    });
}