/**
 * Created by mattlam on 3/21/2016.
 */

// Require node libraries
var fs = require('fs');

// Require local modules
var config = require('./config-convey'); // Config data from config.js
var logger = require('./logger.js'); // Logging powered by Bunyan

// Check for directory for log files and create if it does not exist
exports.checkLogDir = function() {
    if (!fs.existsSync(config.logFileDir)) {
        fs.mkdirSync(config.logFileDir);
        logger.info("Created directory for logs at:", config.logFileDir);
    }
};

// Function for daily archival of existing info.log and error.log files
exports.archiveLogs = function() {

    // Get current date-time info
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;
    var currentDay = currentDate.getDate();
    var currentYear = currentDate.getYear() + 1900;
    var currentHour = currentDate.getHours();
    var currentMin = currentDate.getMinutes();

    // If beginning of a new calendar day (00:00), then save archive copies
    // of the info.log and error.log files and truncate the existing copies
    if (currentHour === 0 && currentMin === 0) {
        // Create full paths for accessing existing log files
        var fullPathToInfoLog = config.logFileDir + config.infoLogFilename;
        var fullPathToErrorLog = config.logFileDir + config.errorLogFilename;

        // Get stats on existing info and error log files
        var infoLogStat = fs.statSync(fullPathToInfoLog);
        var errorLogStat = fs.statSync(fullPathToErrorLog);

        // Archive the error and info logs if they contain any data
        if (infoLogStat.size) {
            archiveLog(config.infoLogFilename, fullPathToInfoLog, currentMonth,
                currentDay, currentYear);
        }
        if (errorLogStat.size) {
            archiveLog(config.errorLogFilename, fullPathToErrorLog, currentMonth,
                currentDay, currentYear);
        }
    }
};

// Copy current file log data to an archive copy. Name the archive copy with
// current month-day-year stamp. And truncate the current file.
function archiveLog(currentFilename, currentFilePath, month, day, year) {

    // Create full path to new filename that includes a timestamp
    var newFilename = 'archive' + '_' +  month + '-' + day + '-' + year +
        '_' + currentFilename;
    var fullPathToNewFile = config.logFileDir + newFilename;

    // Copy all data from the current log file to the new archive file
    var source = fs.createReadStream(currentFilePath);
    var dest = fs.createWriteStream(fullPathToNewFile);
    source.pipe(dest);

    // When the copy is complete, then truncate (remove all data from) the
    // current log file
    source.on('end', function() {
        logger.info("Archived log file " + currentFilename + " - to - " +
            newFilename);
        // Log file was archived to truncate the original
        fs.closeSync(fs.openSync(currentFilePath, 'w'));

    });

    // If there is an error, then . . . log it!
    source.on('error', function(err) {
        logger.error("Error occurred on attempt to archive log: " +
            currentFilename + ". Error text: " + err);
    });
}
