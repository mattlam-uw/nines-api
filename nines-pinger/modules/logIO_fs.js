/**
 * This module contains all methods required for log file CRUD operations.
 */

// Node.js Module Dependencies
var fs = require('fs'); // Used for reading and writing to local system files


// Write new general log file entry to log file
exports.writeReqLogEntry = function(filePath, fileName, readableTime, urlName,
                                    urlHost, urlPath, statusCode) {

    // Create the entry and define the full file path
    var logEntry = createReqLogEntry(readableTime, urlName, urlHost, urlPath,
        statusCode);
    var fullLogFilePath = filePath + fileName;

    // Write entry to the general request file
    fs.appendFile(fullLogFilePath, logEntry, function(err) {
        if (err) return console.log(err);
        return null;
    });
};

// Create new file for full page error log file entry
exports.writeErrLogEntry = function(filePath, compactTime, noSpaceName, pageData,
                                   statusCode) {

    var fullLogFilePath = filePath + '/err-' + statusCode + '-' + compactTime
        + '-' + noSpaceName + '.html';
    fs.appendFile(fullLogFilePath, pageData, function(err) {
        if (err) return console.log(err);
        return null;
    });
}

// Format new general log file entry
function createReqLogEntry(readableTime, urlName, urlHost, urlPath, statusCode) {
    return readableTime + '\n'
        + 'Page Name: ' + urlName + '\n'
        + 'URL: ' + urlHost + urlPath + '\n'
        + 'HTTP status code: ' + statusCode + '\n'
        + '================================\n';
};

