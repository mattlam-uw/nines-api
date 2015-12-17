/**
 * Created by mattlam on 12/16/15.
 */
// Dependencies
var path = require('path');

// Host and port used by web client connecting to Nines Api
exports.ninesWebHost = "http://localhost:3001";

// Path to /logs directory used by Nines Api
exports.logFileDir = path.join(__dirname, '..', 'nines-pinger', 'logs');

