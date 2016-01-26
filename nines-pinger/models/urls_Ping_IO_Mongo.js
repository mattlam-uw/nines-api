/**
 * This module contains all methods required for URL model CRUD operations.
 */

// Node.js Module Dependencies
var Urls = require('../../models/Urls_Mongo');


// Retrieve all URL data from MongoDB-based Urls model
exports.getUrls = function(callback) {
    Urls.find(function(err, returnObj) {
        if(err) console.log(err);
        callback(returnObj);
    });
};


// Update the status code response totals on Urls model doc for a given URL
exports.updateUrlResponses = function(urlId, statusCode) {
    Urls.findOne(
        { '_id': urlId },
        function(err, url) {
            if (err) console.log(err);

            // Increment the appropriate status code response total for URL
            var newResponses = url.responses;
            if (!newResponses[statusCode]) {
                newResponses[statusCode] = 1;
            } else {
                newResponses[statusCode] += 1;
            }

            // Update the URL with the new response totals per status code
            Urls.update(
                { '_id': url._id },
                { 'responses': newResponses },
                function(err, numAffected) {
                    if (err) console.log(err);
                }
            );
        }
    );
};

// Retrieve response totals for all URLs associated with a given URL Group
exports.getUrlResponses = function(urlGroupId, urlGroupName, callback) {
    // Get all the url records from Urls model having the given URL Group ID
    Urls.find(
        { 'urlgroup_id': urlGroupId },
        function(err, urls) {
            if (err) console.log(err);

            // Create a 'responses' object that will be populated with
            // status-code response totals from all URLs in the URL Group
            var responses = {};
            // Iterate through URLs and populate the 'responses' object
            for (var i = 0; i < urls.length; i++) {
                for (var j in urls[i].responses) {
                    // If a response total for the given status code exists,
                    // then add to it. Use the current response count to initialize
                    // a new status code property on the 'responses' object
                    if (!responses[j]) {
                        responses[j] = urls[i].responses[j];
                    } else {
                        responses[j] += urls[i].responses[j];
                    }
                }
            }
            // Call the callback with the full-populated 'responses' object as
            // well as some other URL Group info
            callback(urlGroupId, urlGroupName, responses);
        }
    );
}




	
