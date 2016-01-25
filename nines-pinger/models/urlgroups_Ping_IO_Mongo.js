/**
 * Created by mattlam on 1/25/16.
 */

var UrlGroups = require('../../models/UrlGroups_Mongo');

// Update the response and error totals on UrlGroups model doc
// for the URL Group that this URL belongs to
exports.updateUrlGroupResponses = function(urlGroupId, statusCode) {
    UrlGroups.findOne(
        { '_id': urlGroupId },
        function(err, urlgroup) {
            if (err) console.log(err);

            // Increment the appropriate status code response total for URL
            var newResponses = urlgroup.responses;
            if (!newResponses[statusCode]) {
                newResponses[statusCode] = 1;
            } else {
                newResponses[statusCode] += 1;
            }

            UrlGroups.update(
                { '_id': urlgroup._id },
                { 'responses': newResponses },
                function(err, numAffected) {
                    if (err) console.log(err);
                }
            );
        }
    );
};