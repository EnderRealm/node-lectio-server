var OAuth= require('oauth').OAuth;
var keys = require('./twitterkeys.js');
var Q = require('q');
var request = require('request');
var oaRequest = require('request');

function expandUrl(shortUrl) {

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

oa = new OAuth("https://api.twitter.com/oauth/request_token",
                 "https://api.twitter.com/oauth/access_token", 
                 keys.consumerKey, keys.consumerSecret, 
                 "1.0", "http://localhost:3000/oauth/callback", "HMAC-SHA1");


var access_token= keys.token;
var access_token_secret= keys.secret;

//var minID = Infinity;
//var longURLs = new Array();
//
//function expandTweetURLS(tweetURLS) {
//  
//  for (var i in tweetURLS) {
//    
//    var nextURL = tweetURLS[i];
//    
//    expandUrl(nextURL)
//    .then(function (longUrl) {
//        longURLs.push(longUrl);
//    });
//  }
//}
//
//
//
//oa.get("https://api.twitter.com/1.1/statuses/home_timeline.json?screen_name=smacbeth", access_token, access_token_secret, function(error, data) {
//
//  tweets = JSON.parse( data );
//
//  for (var key in tweets) {
//    if (tweets.hasOwnProperty(key)) {
//      
//      tweetID = tweets[key].id;
//      if (tweetID<minID) {
//        minID = tweetID;
//      }
//      console.log('length == '+longURLs.length);
//
//      longURLs.concat(expandTweetURLS(tweets[key].text.match(geturl)));  
//
//      console.log('length == '+longURLs.length);
//
//    }
//  }
//})

oaRequest = oa.get("https://userstream.twitter.com/1.1/user.json", access_token, access_token_secret );

oaRequest.addListener('response', function (response) {
  response.setEncoding('utf8');
  
  response.addListener('data', function (chunk) {
   
    // keep alive ping from twitter, just ignore
    if (chunk[0] != '{') {
      return;
    }
  
    var streamObj = JSON.parse(chunk.toString());
    var tweet = new Object;
  
    // check if chunk represents a tweet object
    if(streamObj.hasOwnProperty('id')) {
      console.log('---- start tweet ----');
      console.log('id == ['+streamObj['id']+']');
      console.log('user == ['+streamObj['user']['screen_name']+']');
      console.log('text == ['+streamObj['text']+']');
      
      tweet 
      
      
      var entities;
      
      // check if tweet contains hashtags
      if(streamObj['entities'].hasOwnProperty('hashtags')) {
        entities = streamObj['entities']['hashtags'];
        for (var i in entities) {
          console.log('hashtag == ['+entities[i].text+']');
        }
      }
      
      // check if tweet contains urls
      if(streamObj['entities'].hasOwnProperty('urls')) {
        entities = streamObj['entities']['urls'];
        for (var i in entities) {
          console.log('short url == ['+entities[i].url+']');
          expandUrl(entities[i].url)
            .then(function (longUrl) {
                console.log('long url == ['+longUrl+']');
          });
        }
      }
  
      // check if tweet contains user_mentions
      if(streamObj['entities'].hasOwnProperty('user_mentions')) {
        entities = streamObj['entities']['user_mentions'];
        for (var i in entities) {
          console.log('user == ['+entities[i].screen_name+']');
        }
      }
  
      console.log('---- end tweet ----')
      return;
    }
    // check if chunk represents a friend list object
    else if (streamObj.hasOwnProperty('friends')) {
      console.log('# of Friends ['+streamObj['friends'].length+']');
      return;
    }
  }); //addListener 'data'

  // listen for end messages from Twitter
  response.addListener('end', function () {
    console.log('--- END ---');
    return;
  });
    
}); // addListener 'response'
 
oaRequest.end();  
  
  


