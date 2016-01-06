/**
 * This file provides high-level control (open and close connections, etc.)
 * to the database platform chosen to support the model.
 *
 * Currently, Nines is being developed to use MongoDB for its model. This
 * is part of an attempt to abstract out the DB early in the development
 * of Nines.
 *
 * With the current design, many code changes will need to be made throughout
 * Nines in order to use a database other than Mongo. I am trying to clearly
 * label the files that will require a change.
 *
 * The ideal future design will allow for more of this configuration to
 * happen within /config.js
 */

// Dependencies
var mongoose = require('mongoose'); // Used for interaction with MongoDB-based model

// Database Methods (Currently using MongoDB and Mongoose)

// Open a new database connection
exports.openConnection = function() {
    mongoose.connect('mongodb://localhost/nines', function(err) {
        if (err) {
    		console.log('MongoDB connection error', err);
    	} else {
    		console.log('MongoDB connection opened');
    	}
    })
};

// Close the database connection
exports.closeConnection = function() {
    console.log('MongoDB connection closed');
    mongoose.connection.close();
};


