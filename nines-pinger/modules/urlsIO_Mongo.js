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


	
