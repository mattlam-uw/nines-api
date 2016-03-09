/**
 * Errors Log Model
 *
 * This model provides data around HTTP requests that have generated an error
 * (status code >= 400). It does this by building a JavaScript object from
 * documents (data) retrieved from the Errors MongoDB collection. For the
 * purposes of Nines API, this is a read-only model. Nines Pinger writes
 * HTTP request result data to the MongoDB Errors collection.
 **/

// Dependencies
var mongoose = require('mongoose');

// Define Mongoose Schema
var ErrorsSchema = new mongoose.Schema({
    user_id: String,
    status_code: Number,
    resource_name: String,
    resource_url: String,
    resource_url_id: Number,
    resource_urlgroup_id: Number,
    response: String,
    request_datetime: Date
});

// Export mongoose 'Errors' model
module.exports = mongoose.model('Errors', ErrorsSchema);