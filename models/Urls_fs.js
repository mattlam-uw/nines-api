/**
 * URLs Model
 *
 * This model provides data around URLs that are time-interval pinged. The
 * data is stored in a JSON file. Methods will be provided for read and
 * write operations on this model.
 *
 * In the future, this may be replaced with a database-based model.
 */

// Node.js Module Dependencies
var fs = require('fs'); // Used for reading and writing to local system files

// Reads the urls.json file and retrieves the json into an object
exports.getUrlData = function(filePath, callback) {
    // Object to store URL data
    var urlData = {};

    fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) return console.log(err);
        urlData = JSON.parse(data);
        callback(urlData);
    });
};

// Writes object to urls.json file
exports.writeUrlData = function(filePath, urlData) {
    fs.writeFile(filePath, urlData, function(err) {
        if (err) return console.log(err);
    });
};
