/**
 * This module contains all methods required for URL model CRUD operations
 * using a MongoDB-based model.
 */

// Node.js Module Dependencies
var Urls = require('../../models/Urls_Mongo');


// Retrieve all URL data from MongoDB-based Urls model
exports.getUrlsMongo = function(callback) {
    Urls.find(function(err, returnObj) {
        if(err) console.log(err);
        // console.log(returnObj);
        callback(returnObj);
    });
};


	
