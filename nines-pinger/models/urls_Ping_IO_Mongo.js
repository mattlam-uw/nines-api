/**
 * This module contains all methods required for URL model CRUD operations.
 */

// Node.js Module Dependencies
var Urls = require('../../models/Urls_Mongo');
var UrlGroupIO = require('./urlgroups_Ping_IO_Mongo');


// Retrieve all URL data from MongoDB-based Urls model
exports.getUrls = function(callback) {
    Urls.find(function(err, returnObj) {
        if(err) console.log(err);
        callback(returnObj);
    });
};

// Update the response and error totals on Urls model doc for this URL
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

            Urls.update(
                { '_id': url._id },
                { 'responses': newResponses },
                function(err, numAffected) {
                    if (err) console.log(err);
                }
            );

            // Update the response and error totals on UrlGroups model doc
            // for the URL Group that this URL belongs to
            UrlGroupIO.updateUrlGroupResponses(url.urlgroup_id, statusCode);
        }
    );
};




	
