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



geturl = new RegExp(
          "(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))"
         ,"g"
       );

var fb_access_token = 'CAAGydn2NB1UBAEfNGXgxVsbcPFZCSrQesBKB1yBaDPq8fJzl9nD7S7sKgrr1RcMrp3vHUFViB3ZAdNZApwATqb9oudT6yUoPZB0fMp5gSd5xNCFWNiJLlilqKz7ztvCd4P6ZCXjhkUBZAwFPAHZBL5BIYZASL48nxKAZD&&&'
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
		var urls = '';
		
		post.type = type;
		post.source = 'facebook'
		
		post.id = item.id;
		post.screen_name = '';

		post.from = {};
		post.from.id = item.from.id;
		post.from.name = item.from.name;
		post.time = item.created_time;

		post.text = item.message;
		post.hastags = new Array();
		post.urls = new Array();
		post.users = new Array();

		util.logger(util.INFO, type);
		
		if(item.message != undefined) urls = item.message.match(geturl);

		for(i in urls) {
			var url = {};
			
			url.short_url = urls[i];
			post.urls.push(url);
		}
				
		if(type == 'link') {
			var url = {};
			url.short_url = item.link;
			post.urls.push(url);
		}
		
		posts.push(post);
		callback();
		
	}, function(err) {
		for(i in posts) {

			if(posts[i].urls.length>0) {

				async.eachSeries(posts[i].urls, function(url, callback) {
					
					netlib.expandUrl(url.short_url, function(err, data) {
						if(err) {
							util.logger(util.ERROR, err);
						} 
						else {
							url.long_url = data;
							callback();
						}
					});
				}, function(err) {

					util.logger(util.INFO, 'insert FB:'+posts[i].type+' id(' + posts[i].id + ') to db as id(' + 0 + ') for user id(' + posts[i].from.id + ')');
					
				
				});

			} else {

				util.logger(util.INFO, 'not insert FB:'+posts[i].type+' id(' + posts[i].id + ') to db as id(' + 0 + ') for user id(' + posts[i].from.id + ')');


			}
		}
		
	});

});



