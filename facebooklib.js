var https = require('https');
var async = require('async');

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


var fb_access_token = 'CAAGydn2NB1UBAEZASuJGjgTpuntnUJ45TchE1pzDxzZAMvnk73UFt3mtRwIDRedbHmCaoKvBuTI54D2OryURJl3QWT290XUWHr4VEudXuE3sIaN6NIfTKvOqTFy82AVwiJOzSp3IZCYlOIIvs3DzwoyQc9V12oZD&'
var fb_friends_url = '/me/friends';
var fb_newsfeed_url = '/me/home';


util.logger(util.INFO, 'New facebook news stream processor for user id('+')');

getFbData(fb_access_token, fb_newsfeed_url, function(data){
	
	var obj = JSON.parse(data);

	if(obj.hasOwnProperty('error')) throw obj.error.message;
	
	var posts = [];
	
	async.eachSeries(obj.data, function(item, callback) {
		var type = item.type;
		var post = {};
		
		post.type = type;
		post.id = item.id;
		
		switch(type) {
			case 'photo': 
				posts.push(post);
				callback();
				break;
			case 'link': 
				util.debug(item, 10);
				
				netlib.expandUrl(item.link, function(err, data) {
					if(err) {
						util.logger(util.ERROR, err);
					} 
					else {
						post.short_link = item.link;
						post.long_link = data;
						posts.push(post);
						callback();
					}
				});
				break;
			case 'status': 
				posts.push(post);
				callback();
				break;
			case 'video': 
				posts.push(post);
				callback();
				break;
			default:
				util.logg(util.WARN, 'unhandled neewsfeed type');
				callback();
				break;
		}
		
	}, function(err) {


		for(i in posts) {
			util.logger(util.INFO, 'insert FB:'+posts[i].type+' id(' + posts[i].id + ') to db as id(' + 0 + ') for user id(' + 0 + ')');
		
		
		}

	});

});



