/**
 * UrlGroups-Urls Model
 *
 * This model provides data for linking Urls to UrlGroups
 **/

// Dependencies
var mongoose = require('mongoose');

// Define Mongoose Schema
var UrlGroups-UrlsSchema = new mongoose.Schema({
    urlgroup_id: String,
    url_id: String
});

// Export mongoose 'UrlGroups-Urls' model, which will create/use a collection called
// 'urlgroups-urls' in MongoDB
module.exports = mongoose.model('UrlGroups-url', UrlGroup-UrlSchema);