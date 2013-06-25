var OAuth= require('oauth').OAuth;
var keys = require('./twitterkeys.js');
var oaRequest = require('request');
var netlib = require('./netlib.js');

module.exports = {
    
    testStream : function() {
        return 'test';
    },
    
    userStream : function() {
        
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
                if (chunk[0] != '{') {
                  return 'keep alive';
                }
              
                var streamObj = JSON.parse(chunk.toString());
                var tweet = new Object();
              
                // check if chunk represents a tweet object
                if(streamObj.hasOwnProperty('id')) {        
                    tweet.id = streamObj['id'];
                    tweet.user_id = streamObj['user']['screen_name'];
                    tweet.tweet_text = streamObj['text'];
                  
                    var entities;
                    
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
                    
                    // check if tweet contains urls
                    if(streamObj['entities'].hasOwnProperty('urls')) {
                        entities = streamObj['entities']['urls'];
                        for (var i in entities) {
                            netlib.expandUrl(entities[i].url)
                                .then(function (longUrl) {
                                    var url = new Object();
                                                            
                                    url.short_url = entities[i].url;
                                    url.long_url = longUrl;
                                    tweet.urls.push(url);
                                });
                        }
                    }
                
                    // check if tweet contains user_mentions
                    if(streamObj['entities'].hasOwnProperty('user_mentions')) {
                        entities = streamObj['entities']['user_mentions'];
                        for (var i in entities) {
                            tweet.users.push(entities[i].screen_name);
                        }
                    }
                    
                    console.log(tweet);
                    return 'tweet';
                    //return tweet;
                }
                // check if chunk represents a friend list object
                else if (streamObj.hasOwnProperty('friends')) {
                    var friends = new Object();
                    
                    friends = streamObj['friends'];
                    
                    //return streamObj['friends'];
                    return 'friends';
                }
            }); //addListener 'data'
        
            // listen for end messages from Twitter
            response.addListener('end', function () {
                console.log('--- END ---');
                return 'end'; 
            }); // addListener 'end'
            
        }); // addListener 'response'
         
        oaRequest.end();  
    }
}