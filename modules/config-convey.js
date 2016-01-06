/**
 * When setting up Nines API, all application configuration should be done in
 * the config.js file in the root directory of the application.
 *
 * This module takes the config.js data and packages it for use by the Nines
 * API application code
 *
 * You should not need to change anything in this file when configuring NINES API
 **/

// Dependencies
var path = require('path');
var config = require('../config.js');


// Host and port used by web client connecting to Nines Api
exports.ninesWebHost = "http://" + config.Nines_Web_Host_Name + ":"
                                 + config.Nines_Web_Port;

// Port used by this server for connections to Nines API
exports.ninesApiPort = config.Nines_API_Port;

// Path to /logs directory used by Nines Api
exports.logFileDir = path.join(__dirname, '..', config.Logs_Dir_Path);

// Path to urls.json file containing URL data
exports.urlsFilePath = path.join(__dirname, '..', config.URLs_File_Path);

// Number of seconds to wait after last URL ping before closing DB connection
exports.dbCloseWait = config.DB_Close_Wait * 1000;

// HTTP Status Code threshold for sending a follow-up full page request
exports.statusCodeThreshold = config.Status_Code_Threshold;





