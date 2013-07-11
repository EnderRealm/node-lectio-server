var request = require('request');

var expandUrl = function(shortUrl, callback) {

    request( { method: "HEAD", url: shortUrl, followAllRedirects: true },
        function (error, response) {
            if (error) {
                callback(error);
            } else {
                callback(null, response.request.href);
            }
        });
    return;
}

exports.expandUrl = expandUrl