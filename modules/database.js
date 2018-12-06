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
var logger = require('./logger.js'); // Logging module

// Database Methods (Currently using MongoDB and Mongoose)

// Open a new database connection
exports.openConnection = function() {
    mongoose.connect('mongodb://localhost/nines', { useNewUrlParser: true }, function(err) {
        if (err) {
            logger.info('MongoDB connection error', err);
    	} else {
            logger.info('MongoDB connection opened');
    	}
    })
};

// Close the database connection
exports.closeConnection = function() {
    logger.info('MongoDB connection closed');
    mongoose.connection.close();
};


