var OAuth= require('oauth').OAuth;
var keys = require('./twitterkeys.js');
var oaRequest = require('request');
var netlib = require('./netlib.js');
var async = require('async');


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
       
        //console.log(tweet);
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


    
var testStream = function(callback) {
    console.log('start of testStream');
    console.log('next step of testStream');
    callback('data from testStream');
};
    
    
var userStream = function() {
    
    var oa = new OAuth("https://api.twitter.com/oauth/request_token",
        "https://api.twitter.com/oauth/access_token", 
        keys.consumerKey, keys.consumerSecret, 
        "1.0", "http://localhost:3000/oauth/callback", "HMAC-SHA1");

    var access_token= keys.token;
    var access_token_secret= keys.secret;
    
    oaRequest = oa.get("https://userstream.twitter.com/1.1/user.json", access_token, access_token_secret );
    
    oaRequest.addListener('response', function (response) {
        response.setEncoding('utf8');
        
        response.addListener('data', function (chunk) {
         
            // keep alive ping from twitter, just ignore
            if (chunk[0] == '{') {
                          
                var tweet;
                var streamObj = JSON.parse(chunk);
                
                if (streamObj.hasOwnProperty('id')) {
                async.series(
                    [
                        function(callback) {
                            tweet = parseTweet(chunk.toString());
                            console.log('in parse callback id = '+tweet.id);
                            callback(null, 'parse finished id = '+tweet.id);
                        },
                        function(callback) {
                            console.log('in expand callback id = '+tweet.id);
                            for (var i in tweet.urls) {
                                netlib.expandUrl(tweet.urls[i].shortUrl)
                                    .then(function(longUrl) {
                                        console.log('long url before assignment = '+longUrl);
                                        tweet.urls[i].longUrl = longUrl;
                                    });
                            }
                            callback(null, 'done expanding URLs id = '+tweet.id);
                        }
                    ],
                    function(err, status) {
                        console.log(status);
                        //console.log(tweet);
                    }
                );
                }
            } 
        }); //addListener 'data'
    
        // listen for end messages from Twitter
        response.addListener('end', function () {
            console.log('--- END ---');
            return; 
        }); // addListener 'end'
        
    }); // addListener 'response'
     
    oaRequest.end();  
};
    
    
    
exports.testStream = testStream;
exports.userStream = userStream;

