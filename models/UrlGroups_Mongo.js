/**
 * UrlGroups Model
 *
 * This model provides data for URL groups
 **/

// Dependencies
var mongoose = require('mongoose');

// Define Mongoose Schema
var UrlGroupSchema = new mongoose.Schema({
    name: String
});

// Export mongoose 'UrlGroups' model, which will create/use a collection called
// 'urlgroups' in MongoDB
module.exports = mongoose.model('UrlGroup', UrlGroupSchema);
