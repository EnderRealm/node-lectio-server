var OAuth= require('oauth').OAuth;
var keys = require('./twitterkeys.js');
var Q = require('q');
var request = require('request');
var oaRequest = require('request');


//function expandUrl(shortUrl) {
//  return Q.ncall(request, null, {
//      method: "HEAD",
//      url: shortUrl,
//      followAllRedirects: true
//  // If a callback receives more than one (non-error) argument
//  // then the promised value is an array. We want element 0.
//  }).get('0').get('request').get('href');
//}


    //function expandUrl(shortUrl) {
    //    return Q.ncall(request, null, {
    //        method: "HEAD",
    //        url: shortUrl,
    //        followAllRedirects: true
    //    }).get('0').get('request').get('href');
    //}


//function expandUrl(shortUrl) {
//  var deferred = Q.defer();
//  
//  request({method: "HEAD", url: shortUrl, followAllRedirects: true}, deferred.nbind());
//  
//  return deferred.promise.get('request').get('href');
//}


    //function expandUrl(shortUrl) {
    //    var deferred = Q.defer();
    //    request(
    //        {
    //            method: "HEAD",
    //            url: shortUrl,
    //            followAllRedirects: true
    //        },
    //        deferred.node()
    //    );
    //    return deferred.promise
    //        .get('request')
    //        .get('href');
    //}



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

    // check if chunk is small and don't process it if it is.  need to figure out why???
    console.log(chunk);
    
    if (chunk[0] != '{') {
      console.log('keep alive!');
      //code
    }

    if (Buffer.byteLength(chunk)>2) {
      streamObj = JSON.parse(chunk.toString());

      // check if chunk represents a tweet object
      if(streamObj.hasOwnProperty('id')) {
        console.log('---- start tweet ----');
        console.log('id == ['+streamObj['id']+']');
        console.log('user == ['+streamObj['user']['screen_name']+']');
        console.log('text == ['+streamObj['text']+']');
        
        var entities;
        
        if (streamObj['entities'].hasOwnProperty('hashtags')) {
          entities = streamObj['entities']['hashtags'];
          for (var i in entities) {
            console.log('hastag == ['+entities.text+']');
          }
        }
        
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

        if(streamObj['entities'].hasOwnProperty('user_mentions')) {
          entities = streamObj['entities']['user_mentions'];
          for (var i in entities) {
            console.log('user == ['+entities[i].screen_name+']');
          }
        }

        console.log('---- end tweet ----')
      }
      else if (streamObj.hasOwnProperty('friends')) {
        console.log('# of Friends ['+streamObj['friends'].length+']');
      }
    }
    else {
      console.log('['+chunk+']');
    }
  }); // addListener
 
  response.addListener('end', function () {
    console.log('--- END ---');
  });
});
oaRequest.end();  
  
  


