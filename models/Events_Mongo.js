/**
 * General Event Log Model
 *
 * This model provides general event logging data for Nines Pinger, which can
 * include:
 *   + A log of all URLs pinged
 *   + Non-fatal errors encountered, such as a bad protocol (not http or https)
 **/

// Dependencies
var mongoose = require('mongoose');

// Define Mongoose Schema
var EventSchema = new mongoose.Schema({
    event_datetime: Date,
    event_type: String,
    event_description: String
});

// Export mongoose 'Event' model, which will create/use a collection called
// 'events' in MongoDB
module.exports = mongoose.model('Event', EventSchema);
