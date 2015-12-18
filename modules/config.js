/**
 * Created by mattlam on 12/16/15.
 */
// Dependencies
var path = require('path');

// You should only need to make changes to this 'options' object, and they will
// be replicated appropriately in the export objects below.
var options = {
    "Nines_Web_Host_Name": "localhost",
    "Nines_Web_Port": "3001",
    "Nines_API_Port": "3000",
    // The following assumes the path will be under the Nines API application
    // root directory
    "Logs_Dir_Path": "/nines-pinger/logs/",
    "URLs_File_Path": "/nines-pinger/data/urls.json"
}

// Host and port used by web client connecting to Nines Api
exports.ninesWebHost = "http://" + options.Nines_Web_Host_Name + ":"
                                 + options.Nines_Web_Port;

// Port used by this server for connections to Nines API
exports.ninesApiPort = options.Nines_API_Port;

// Path to /logs directory used by Nines Api
exports.logFileDir = path.join(__dirname, '..', options.Logs_Dir_Path);

// Path to urls.json file containing URL data
exports.urlsFilePath = path.join(__dirname, '..', options.URLs_File_Path);


