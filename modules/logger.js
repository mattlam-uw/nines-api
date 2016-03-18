/**
 * Created by mattlam on 3/17/2016.
 *
 * Module provides logging capabilities for Nines API
 */

var config = require('./config-convey'); // Config data from config.js

var bunyan = require('bunyan');

var log = bunyan.createLogger({
    name: "nines-api",
    streams: [
        {
            level: 'info',
            path: config.logFileDir
        },
        {
            level: 'error',
            path: config.logFileDir
        }
    ]
});

module.exports = log;
