// node.js core libraries
var https = require('https');
var async = require('async');
var url = require('url');

// npm libraries
var twitter = require('twitter-text');


// user libraries
var netlib = require('./netlib.js');
var util = require('./util.js');
var config = require('./config.js').config;


// function getFbData(accessToken, apiPath, params, callback) {
    // var options = {
        // host: 'graph.facebook.com',
        // port: 443,
        // path: apiPath + '?access_token=' + accessToken + (params||''), //apiPath example: '/me/friends'
        // method: 'GET'
    // };
    
    // var buffer = ''; //this buffer will be populated with the chunks of the data received from facebook
    // var request = https.get(options, function(result){
        // result.setEncoding('utf8');
        // result.on('data', function(chunk){
            // buffer += chunk;
        // });

        // result.on('end', function(){
            // callback(buffer);
        // });
    // });

    // request.on('error', function(e){
        // util.logger(util.ERROR, 'error from facebook.getFbData: ' + e.message);
    // });

    // request.end();
// }


// var fb_access_token = 'CAAGydn2NB1UBAGAyZA2Stm6zf6RDxYw1JybNZC54evVma30Nh1GnA29uVWEiOIybAlls2wrsxZB5d8nCqDpgkoa2LO8CbLXbXK9KWh0RK2icmq4CmRmGld8GTsPT0gqHmhpSIMrvzkIo5HdFL2X9hrOrKQirIEZD'
// var fb_newsfeed_url = '/me/home';


// util.logger(util.INFO, 'New facebook news stream processor for user id('+0+')');


// var fb_newsfeed_url = '/me/home';


// var type_counts = {};



// function userStream(access_token, newsfeed_url, url_params, callback) {
    // getFbData(access_token, newsfeed_url, url_params, function(data) {

        // var obj = JSON.parse(data);
        // var next_url = null;

        // if(obj.hasOwnProperty('error')) throw obj.error.message;
    
        // for(i in obj.data) {
            // var item = obj.data[i];
            
            // var created = new Date(item.created_time)
            
            // console.log(item.type + ' -- ' + created.getMonth()+'/'+created.getDate()+' '+created.getHours()+':'+created.getMinutes());
            
            // if(type_counts.hasOwnProperty(item.type)) {
                // type_counts[item.type] = type_counts[item.type] + 1;
            // } else {
                // type_counts[item.type] = 1;
            // }
        // }
        
        // if(obj.hasOwnProperty('paging')) {
            // next_url = obj.paging.next;
        // }
        
        // callback(next_url);
        
    // });
// }



// userStream(fb_access_token, fb_newsfeed_url, null, function lambda(data) {
    
    // if(data) {
        // var url_obj = url.parse(data, true);

        // var url_params = '&limit='+url_obj.query.limit+'&until='+url_obj.query.until;
        
        // userStream(fb_access_token, fb_newsfeed_url, url_params, lambda);

    // } else {
        // console.log('done...');
    
    // }
        
// });

















// getFbData(fb_access_token, fb_newsfeed_url, function(data){
	
	// var obj = JSON.parse(data);

	// if(obj.hasOwnProperty('error')) throw obj.error.message;
	
	// var posts = [];
	
    // util.debug(obj, 1);
    
	// for(i in obj.data) {
        // var item = obj.data[i];
        
		// var post = {};

		// post.from = {};
		// post.short_urls = new Array();
        // post.long_urls = new Array();

		// post.type = item.type;
		// post.source = 'facebook'
		// post.id = item.id;
		// post.from.id = item.from.id;
		// post.from.name = item.from.name;
		// post.time = item.created_time;
		// post.text = item.message;

        
		// if(item.message != undefined) {
            // post.hashtags = twitter.extractHashtags(item.message);
            // post.users = twitter.extractMentions(item.message);
            // post.short_urls = twitter.extractUrls(item.message);
            // }	
		
        // if(item.type == 'link') {
            
            //hacks to fix messages that don't conform
            // if(item.hasOwnProperty('application')) {
                // if(item.application.name != 'Instagram') {
                    // post.short_urls.push(item.link);
                // }
            // } else {
                // post.short_urls.push(item.link);
            // }            
		// }
        
		// if(post.short_urls.length>0) {
            // post.short_urls = util.dedup(post.short_urls);
            // posts.push(post);
        // }
    // }

    // async.eachSeries(posts, function(post, callback) {
        // async.eachSeries(post.short_urls, function(url, callback) {
                
        // netlib.expandUrl(url, function(err, data) {
                    // if(err) {
                        // util.logger(util.ERROR, err);
                    // } 
                    // else {
                        // post.long_urls.push(data);
                        // callback();
                    // }
            // });
        // }, function(err) {
            // post.long_urls = util.dedup(post.long_urls);
            // callback();
        // });
    
    // }, function(err) {
        // for(i in posts) {
            // var post = posts[i];

            // util.logger(util.INFO, 'insert FB:'+post.type+' id(' + post.id + ') to db as id(' + 0 + ') for user id(' + post.from.id + ')');

        // }

    // });
    
// });





