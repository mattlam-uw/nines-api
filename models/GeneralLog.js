/**
 * General Log Model
 *
 * This model provides general logging data for Nines Pinger, which can
 * include:
 *   + A log of all URLs pinged
 *   + Non-fatal errors encountered, such as a bad protocol (not http or https)
 **/

// Dependencies
var mongoose = require('mongoose');

// Define Mongoose Schema
var GeneralSchema = new mongoose.Schema({
    event_datetime: Date,
    event_type: String,
    event_description: String
});

// Export mongoose 'General' model
module.exports = mongoose.model('General', GeneralSchema);
