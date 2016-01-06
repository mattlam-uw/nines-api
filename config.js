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
    "URLs_File_Path": "/nines-pinger/data/urls.json",
    // HTTP Status Code threshold for sending a follow-up request to get
    // full page data. In other words, if the initial HTTP request to a
    // URL returns a number equal to or greater than the number specified
    // below, then a follow-up request will be made to get full page data.
    // (recommend: 400)
    "Status_Code_Threshold": 400,
    // Number of seconds to wait after last URL request (ping) and closing
    // of database connection (recommend: 10)
    "DB_Close_Wait": 5
};

// Stuff that you shouldn't (need to) touch
var Config = function() { return config };
module.exports = new Config;