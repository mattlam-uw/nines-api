/**
 * This module contains all methods required for URL model CRUD operations.
 */

// Node.js Module Dependencies
var Urls = require('../../models/Urls_Mongo');
var UrlGroups = require('../../models/UrlGroups_Mongo');


// Retrieve all URL data from MongoDB-based Urls model
exports.getUrls = function(callback) {
    var pingFreqs = getValidFrequencies();

    // Determine URL Groups to ping
    UrlGroups.find(
        { ping_frequency: { $in: pingFreqs }},
        function(err, urlGroups) {
            if(err) console.log(err);
            var urlGroupIds = [];
            for (var i = 0; i < urlGroups.length; i++) {
                urlGroupIds.push(urlGroups[i]._id);
            }

            // Ping URLs associated with URL Groups found
            Urls.find(
                { urlgroup_id: { $in: urlGroupIds }},
                function(err, returnObj) {
                    if (err) console.log(err);
                    callback(returnObj, urlGroupIds);
                }
            );
        }
    );
};


// Update the status code response totals on Urls model doc for a given URL
exports.updateUrlResponses = function(urlId, statusCode) {
    Urls.findOne(
        { '_id': urlId },
        function(err, url) {
            if (err) console.log(err);

            // Create 'newResponses' object to store updated response totals.
            // If a 'responses' property (object) already exists for the url
            // then copy this to 'newResponses'
            var newResponses = {};
            if (url.responses) {
                newResponses = url.responses;
            }

            // Increment the appropriate status code response total for URL
            if (!newResponses[statusCode]) {
                newResponses[statusCode] = 1;
            } else {
                newResponses[statusCode] += 1;
            }

            // Update the URL with the new response totals per status code
            Urls.update(
                { '_id': url._id },
                { 'responses': newResponses },
                function(err, numAffected) {
                    if (err) console.log(err);
                }
            );
        }
    );
};

// Retrieve response totals for all URLs associated with a given URL Group
exports.getUrlResponses = function(urlGroupId, urlGroupName, callback) {
    // Get all the url records from Urls model having the given URL Group ID
    Urls.find(
        { 'urlgroup_id': urlGroupId },
        function(err, urls) {
            if (err) console.log(err);

            // Create a 'responses' object that will be populated with
            // status-code response totals from all URLs in the URL Group
            var responses = {};
            // Iterate through URLs and populate the 'responses' object
            for (var i = 0; i < urls.length; i++) {
                for (var j in urls[i].responses) {
                    // If a response total for the given status code exists,
                    // then add to it. Use the current response count to initialize
                    // a new status code property on the 'responses' object
                    if (!responses[j]) {
                        responses[j] = urls[i].responses[j];
                    } else {
                        responses[j] += urls[i].responses[j];
                    }
                }
            }
            // Call the callback with the full-populated 'responses' object as
            // well as some other URL Group info
            callback(urlGroupId, urlGroupName, responses);
        }
    );
}

/**
 * Returns an array of ping frequency values that have been determined to be
 * valid given the current time retrieved from this server.
 *
 * This assumes valid frequency values be confined to the following integers,
 * which represent the number of minutes that should elapse between pings:
 *
 * 5, 10, 15, 30, 60, 120 (2 hours), 360 (6 hours), 720 (1/2 day), 1440 (1 day)
 *
 * @returns {number[]}
 */
function getValidFrequencies() {

    // Get current server time for determining appropriate frequency values
    var date = new Date();
    var min = date.getMinutes();
    var hour = date.getHours();

    console.log('Current Date:', date);
    console.log('Current Mins:', min);
    console.log('Current Hour:', hour);

    // The value of 5 is valid in all cases, so include in return variable
    var frequencies = [5];
    console.log('Assigning freqs for :5, :25, :35, :55', frequencies);

    /*
    For the following target minute values, check the current server time
    against a range and assign the appropriate frequency values
    */

    // :05 -- no frequency values to add
    // :10
    if (min > 7  && min < 14) {
        frequencies.push(10);
        console.log('Assigning freqs for :10', frequencies);
    // :15
    } else if (min > 13 && min < 18) {
        frequencies.push(15);
        console.log('Assigning freqs for :15', frequencies);

    // :20
    } else if (min > 17 && min < 24) {
        frequencies.push(10);
        console.log('Assigning freqs for :20', frequencies);

    // :25 -- no frequency values to add
    // :30
    } else if (min > 27 && min < 34) {
        frequencies.push.apply(frequencies, [10, 15, 30]);
        console.log('Assigning freqs for :30', frequencies);

    // :35 -- no frequency values to add
    // :40
    } else if (min > 37 && min < 44) {
        frequencies.push(10);
        console.log('Assigning freqs for :40', frequencies);

    // :45
    } else if (min > 43 && min < 48) {
        frequencies.push(15);
        console.log('Assigning freqs for :45', frequencies);

    // :50
    } else if (min > 47 && min < 54) {
        frequencies.push(10);
        console.log('Assigning freqs for :50', frequencies);

    // :55 -- no frequency values to add
    // :00 -- check additionally for hour frequencies
    } else if (min > 57 && min < 4 ) {
        frequencies.push.apply(frequencies, [10, 15, 30, 60]);
        console.log('Assigning freqs for :00', frequencies);

        /*
         For the following target hour values, test the current server time to
         assign appropriate frequency values
         */
        if (hour % 2 === 0) {
            frequencies.push(120);
            console.log('Assigning freqs for 2 hours', frequencies);
        }
        if (hour % 6 === 0) {
            frequencies.push(360);
            console.log('Assigning freqs for 6 hours', frequencies);
        }
        if (hour % 12 === 0) {
            frequencies.push(720);
            console.log('Assigning freqs for 12 hours', frequencies);
        }
        if (hour === 0) {
            frequencies.push(1440);
            console.log('Assigning freqs for 1 day', frequencies);
        }
    }
    return frequencies;
}