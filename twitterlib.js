var OAuth= require('oauth').OAuth;
var async = require('async');
var mongoClient = require('mongodb').MongoClient;
var format = require('util').format;

var netlib = require('./netlib.js');
var util = require('./util.js');




var parseTweet = function(streamObj) {

    // check if chunk represents a tweet object
    if(streamObj.hasOwnProperty('id')) {        
        var tweet = new Object();
        var entities;

        tweet.id = streamObj['id'];
        tweet.user_id = streamObj['user']['screen_name'];
        tweet.tweet_text = streamObj['text'];
       
        tweet.hashtags = new Array();
        tweet.urls = new Array();
        tweet.users = new Array();
        
        // check if tweet contains hashtags
        if(streamObj['entities'].hasOwnProperty('hashtags')) {
            entities = streamObj['entities']['hashtags'];
            for (var i in entities) {
              tweet.hashtags.push(entities[i].text);
            }
        }
    
        // check if tweet contains user_mentions
        if(streamObj['entities'].hasOwnProperty('user_mentions')) {
            entities = streamObj['entities']['user_mentions'];
            for (var i in entities) {
                tweet.users.push(entities[i].screen_name);
            }
        }

        // check if tweet contains urls
        if(streamObj['entities'].hasOwnProperty('urls')) {
            entities = streamObj['entities']['urls'];
            for (var i in entities) {
                var url = new Object();
                url.short_url = entities[i].url;
                tweet.urls.push(url);
            }
        }
       
        return tweet;
    }

    // check if chunk represents a friend list object
    else if (streamObj.hasOwnProperty('friends')) {
        var friends = new Object();
        
        friends = streamObj['friends'];
        
        return friends;
    }

    return {};
};

    
var userStream = function() {
    
	var config = {};
    config.port = process.env.PORT || 3000;
    config.streamURL = process.env.TWITTER_STREAM_CALLBACK_URL;
	config.token = process.env.TWITTER_TOKEN;
	config.secret = process.env.TWITTER_SECRET;
	config.consumerKey = process.env.TWITTER_CONSUMER_KEY;
	config.consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
	config.mongoURL = process.env.MONGOHQ_URL;
	config.tweet_collection = process.env.TWEET_COLLECTION_NAME;
	
    var oa = new OAuth("https://api.twitter.com/oauth/request_token",
        "https://api.twitter.com/oauth/access_token", 
        config.consumerKey, config.consumerSecret, "1.0", config.streamURL, "HMAC-SHA1");

    var oaRequest = oa.get("https://userstream.twitter.com/1.1/user.json", config.token, config.secret);
    
    oaRequest.addListener('response', function (response) {
        response.setEncoding('utf8');
        
        response.addListener('data', function (chunk) {
         
            // only processes JSON packages, ignore keep alive pings
            if (chunk[0] == '{') {
                          
                var tweet;
                var streamObj = JSON.parse(chunk);

                if (streamObj.hasOwnProperty('id')) {

                    var tweet = parseTweet(streamObj);

                    async.eachSeries(tweet.urls, function(url, callback) {
                        
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
						mongoClient.connect(config.mongoURL, function(err, db) {
							if(err) throw err;
							
							var collection = db.collection(config.tweet_collection);
							
							collection.insert(tweet, function(err, docs) {
								collection.count(function(err,count) {
									db.close();
								}); // collection.count
							}); // collection.insert
                            
                            util.logger(util.INFO, 'insert tweet id(' + tweet.id + ') to db as id(' + tweet._id + ')');
                            
						}); // mongoClient.connect
                    });
                }
            } 
        }); //addListener 'data'
    
        // listen for end messages from Twitter
        response.addListener('end', function () {
            util.logger(util.WARN, 'Received end message from twitter streaming API');
            return; 
        }); // addListener 'end'
        
    }); // addListener 'response'
     
    oaRequest.end();  
};
        
exports.userStream = userStream;

