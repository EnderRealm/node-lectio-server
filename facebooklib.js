var https = require('https');

var netlib = require('./netlib.js');
var util = require('./util.js');
var config = require('./config.js').config;




function getFbData(accessToken, apiPath, callback) {
    var options = {
        host: 'graph.facebook.com',
        port: 443,
        path: apiPath + '?access_token=' + accessToken, //apiPath example: '/me/friends'
        method: 'GET'
    };

    var buffer = ''; //this buffer will be populated with the chunks of the data received from facebook
    var request = https.get(options, function(result){
        result.setEncoding('utf8');
        result.on('data', function(chunk){
            buffer += chunk;
        });

        result.on('end', function(){
            callback(buffer);
        });
    });

    request.on('error', function(e){
        util.logger(util.ERROR, 'error from facebook.getFbData: ' + e.message);
    });

    request.end();
}



util.logger(util.INFO, 'test');

getFbData('CAACEdEose0cBALSCOA952Sy86IUFFqQRXTyTRBspSDfkfj3zmKvUlkC7uTSZBiN5t6pc1HsZCoQD2CiNQgSLsjdP1jY7vbhkYeO7v2vSGBCHurC2phrqh0P1QtF9RWFy0lUHKpOBfaX3cxMKjyIMnAxRDjV6EZD', '/me/friends', function(data){
	
	var obj = JSON.parse(data);
	
	for(i in obj.data) {
		util.logger(util.INFO, obj.data[i].name);
	}


});



