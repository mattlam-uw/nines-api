/**
 * Users Model
 *
 * This model provides user data, mostly for purposes of authentication and
 * maintaining user accounts
 **/

// Dependencies
var mongoose = require('mongoose');

// Define Mongoose Schema
var UsersSchema = new mongoose.Schema({
    username: String,
    usergroup_id: String,
    password: String,
    date_added: Date
});

// Export mongoose 'Errors' model
module.exports = mongoose.model('Users', UsersSchema);
