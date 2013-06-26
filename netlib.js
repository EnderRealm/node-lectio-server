var Q = require('q');
var request = require('request');

module.exports = {
    expandUrl : function(shortUrl) {
        var deferred = Q.defer();
        request( { method: "HEAD", url: shortUrl, followAllRedirects: true },
            function (error, response) {
                if (error) {
                    deferred.reject(new Error(error));
                } else {
                    deferred.resolve(response.request.href);
                }
            });
        return deferred.promise;
    }    
}

