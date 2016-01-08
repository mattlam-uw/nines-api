/**
 * General Heads Log Model
 *
 * This model provides data for all initial HEAD requests. Data for follow-up
 * full requests are available from the Gets Model
 **/

// Dependencies
var mongoose = require('mongoose');

// Define Mongoose Schema
var HeadSchema = new mongoose.Schema({
    datetime: Date,
    url_id: String,
    status_code: Number
});

// Export mongoose 'Head' model, which will create/use a collection called
// 'heads' in MongoDB
module.exports = mongoose.model('Head', HeadSchema);
