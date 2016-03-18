/**
 * Created by mattlam on 3/17/2016.
 *
 * Module provides logging capabilities for Nines API using Bunyan
 */

// Module dependencies
var config = require('./config-convey'); // Config data from config.js
var bunyan = require('bunyan');

// Configure Bunyan logger object and export it for use in other modules
var log = bunyan.createLogger({
    name: "nines-api",
    streams: [
        {
            level: 'info',
            path: config.logFileDir + config.infoLogFilename
        },
        {
            level: 'error',
            path: config.logFileDir + config.errorLogFilename
        }
    ]
});

module.exports = log;
