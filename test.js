var twitter = require('twitter-text');
var util = require('./util.js');

// node.js core libraries
var https = require('https');
var async = require('async');
var url = require('url');

var request = require('request');


var config = require('./config.js').config;



var test = "This is a test string #hashit @smacbeth #otherhash @otheruser";


var output = twitter.autoLink(test); 

// console.log('users = '+twitter.extractMentions(test));
// console.log('hashtags = '+twitter.extractHashtags(test));
//console.log('urls = '+twitter.extractUrls(test));



var users = twitter.extractMentions(test);
var hashtags = twitter.extractHashtags(test);
var urls = twitter.extractUrls(test);

// util.debug(users,10);
// util.debug(hashtags, 10);
//util.debug(urls, 10);



var fb = require('fb');

   
var fb_access_token = 'CAAGydn2NB1UBAGi0qfTOxa1nHslIk5uOXG26ye2Y20ZBrk7UuxJoudvR6QYtwdb8f51351bOuuvmuEa2y791hOsnZAx4W1eKBB7P81YCHsRWwmLpdZBns4UwZB5Ye6ICFsi4RJBlEgnatdhrQ7M1TDvERFPtFZAQZD';




function fbExtendAccessToken(fb, options, callback) {
    
    fb.api('oauth/access_token', options, function(res) {
    
        if(!res || res.error) {
        
            console.log(!res ? 'error occured' : res.error);
            callback(res.error);
        }
    
        callback(null, res);
        
    });
    
}    

    

console.log(fb_access_token);

fb.setAccessToken(fb_access_token);

fb.api('fql', {q:"SELECT post_id, actor_id, target_id, message, attachment FROM stream"}, function lambda(res) {

    if(!res || res.error) {
    
        if(res.error.type = 'OAuthException') {
        
            fbExtendAccessToken(fb, { client_id: '', client_secret: '', redirect_uri: 'http://www.enderrealm.com', grant_type: 'fb_exchange_token', fb_exchange_token:'CAAGydn2NB1UBAMopsEVebMV626ZCiHYMcwS03JMGMMHO3fxG7Dik0OlT5tKiwZCwNySjAl0WDcprS3TVTsNyZAufIUZASHq3I32Wzev9pkgNmXZBoc311O5ZCM0dyHL9b7EcAIYMgKnG8ikiz5jWfL'}, function(err,res){

                var accessToken = res.access_token;
                var expiry = res.expires;
    
                fb.setAccessToken(accessToken);
    
                console.log('expiry = '+expiry);
    
                // check if access token expires in less then three days (60*60*24*3)
                if(expiry < (259200)) {
                    console.log('token expires in less then three days : '+expiry);
                }

                fb.api('me/home', lambda);
                
            });
        }
    
        console.log(!res ? 'error occured' : res.error);
        return;
    
    }

    util.debug(res, 1); 

});


    
    
 
    
    
