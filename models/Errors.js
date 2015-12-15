/**
 * Errors Model
 *
 * This model provides data around requests that have generated an error. This
 * data is stored in a JavaScript object that is built by scanning and
 * parsing the error log files in the /logs directory. This is a read-only
 * model as the writing is accomplished by adding or removing log files.
 *
 * In the future, this may be replaced with a database-based model.
 */

// Node.js Module Dependencies
var fs = require('fs'); // Used for reading and writing to local system files


// Function reads the logs directory to retrieve file names. The file names are
// then parsed to create an error object, which contains a property for each
// error status code. Each of these properties in turn has properties 
// representing the incidence count for the status code and an array of error
// file names for the status code. The callback is used to provide this data
// back to the client.
exports.getReqErrStats = function(dirPath, callback) {
    // Object to store request error stats
    var errors = {};

    fs.readdir(dirPath, function(err, fileNames) {
        if (err) return console.log(err);

        // Iterate over the files returned from fs.readdir looking for files 
        // that begin with 'err', then parse the status code out of the file 
        // name and add the file to the stats
        for (var i = 0; i < fileNames.length; i++) {
            if (fileNames[i].substr(0, 3) == 'err') {
                // Parse the status code
                var statusCode = fileNames[i].substr(4, 3);
                // If a subobject for the status code exists, then add stats 
                // to it
                if (errors[statusCode]) {
                    errors[statusCode].count++;
                    errors[statusCode].files.push(fileNames[i]);
                    // Otherwise, create a subobject for the status code and 
                    // add stats
                } else {
                    errors[statusCode] = {};
                    errors[statusCode].count = 1;
                    errors[statusCode].files = [fileNames[i]];
                }
            }
        }

        // Now the client callback can do something with the errors object
        callback(errors);
    });
}


