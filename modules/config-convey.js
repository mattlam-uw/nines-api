/**
 * Created by mattlam on 12/16/15.
 */
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





