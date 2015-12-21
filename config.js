/**
 * Config file for Nines API. Please make all changes to the config object
 * below and touch nothing else.
 */

// Config Object - stuff you can modify:
var config = {
    // Host name of server connecting to Nines API
    "Nines_Web_Host_Name": "localhost",
    // Client connection port used by server connecting to Nines API
    "Nines_Web_Port": "3001",
    // Port used for connections to Nines API
    "Nines_API_Port": "3000",
    // Paths to directories or resources used within Nines API
    // The following assumes the path will be under the Nines API application
    // root directory (typically one directory level up from the location of
    // this file
    "Logs_Dir_Path": "/nines-pinger/logs/",
    "URLs_File_Path": "/nines-pinger/data/urls.json"
};

// Stuff that you shouldn't (need to) touch
var Config = function() { return config };
module.exports = new Config;