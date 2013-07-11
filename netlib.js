var Q = require('q');
var request = require('request');

module.exports = {
    expandUrl : function(shortUrl) {

	var deferred = Q.defer();
        request( { method: "HEAD", url: shortUrl, followAllRedirects: true },
            function (error, response) {
                if (error) {
					console.log('error');
					console.log(error);
                    deferred.reject(new Error(error));
                } else {
					console.log('success = ' + response.request.href);
					
                    deferred.resolve(response.request.href);
                }
            });
        return deferred.promise;
    }    
}

