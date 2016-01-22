/**
 * UrlGroups Model
 *
 * This model provides data for URL groups
 **/

// Dependencies
var mongoose = require('mongoose');

// Define Mongoose Schema
var UrlGroupSchema = new mongoose.Schema({
    name: String,
    response_total: Number,
    error_total: Number
});

// Export mongoose 'UrlGroups' model, which will create/use a collection called
// 'urlgroups' in MongoDB
module.exports = mongoose.model('Urlgroup', UrlGroupSchema);
