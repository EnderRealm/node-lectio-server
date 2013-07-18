var twitter = require('twitter-text');
var util = require('./util.js');

// node.js core libraries
var https = require('https');
var async = require('async');
var url = require('url');

var request = require('request');



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





// var fb_get_token_url = 'https://graph.facebook.com/oauth/authorize?type=user_agent&client_id=477696958990165&redirect_uri=http%3A%2F%2Fenderrealm.com&scope=read_stream,offline_access';




// function getFbData(callback) {
    // var options = {
        // host: 'graph.facebook.com',
        // port: 443,
        // path: 'http://graph.facebook.com/oauth/authorize?type=user_agent&client_id=477696958990165&redirect_uri=http%3A%2F%2Fwww.enderrealm.com&scope=read_stream,offline_access', //apiPath example: '/me/friends'
        // method: 'GET',
        // followRedirect: true
    // };




    // request('http://graph.facebook.com/oauth/authorize?type=user_agent&client_id=477696958990165&redirect_uri=http%3A%2F%2Fwww.enderrealm.com&scope=read_stream,offline_access', function(error, response, body) {
    
        // console.log(response);
        // console.log(body);
    
    // });


    var fb = require('fb');
    var step = require('step');
    
    
    //https://github.com/Thuzi/facebook-node-sdk#get-facebook-application-access-token
    
    
    fb.api('oauth/access_token', { client_id: '477696958990165', client_secret: '67a0826bb847ff02c14fa6db6276aa61', redirect_uri: 'http://www.enderrealm.com', grant_type: 'fb_exchange_token', fb_exchange_token:'CAAGydn2NB1UBAMopsEVebMV626ZCiHYMcwS03JMGMMHO3fxG7Dik0OlT5tKiwZCwNySjAl0WDcprS3TVTsNyZAufIUZASHq3I32Wzev9pkgNmXZBoc311O5ZCM0dyHL9b7EcAIYMgKnG8ikiz5jWfL'}, function(res) {
    
        if(!res || res.error) {
        
            console.log(!res ? 'error occured' : res.error);        
            return;
        }
    
        var accessToken = res.access_token;
        
        fb.setAccessToken(accessToken);

        util.debug(res, 1); 

        

        fb.api('me/home', {fields: ['type']}, function(res) {

            if(!res || res.error) {
            
                console.log(!res ? 'error occured' : res.error);
                return;
            
            }

            util.debug(res, 1); 

            console.log(res.data);

        });



    
    });
    
    
    
  
    
    
    
    
    
    // var buffer = ''; //this buffer will be populated with the chunks of the data received from facebook
    // var req = request.get(options, function(result){
        
        // util.debug(request,20);
        
        // result.setEncoding('utf8');
        // result.on('data', function(chunk){
            // buffer += chunk;
        // });

        // result.on('end', function(){
            // callback(buffer);
        // });
    // });

    // req.on('error', function(e){
        // util.logger(util.ERROR, 'error from facebook.getFbData: ' + e.message);
    // });

    // req.end();
// }



// getFbData(function(data) {
    // console.log(data);

// });



// var test = 'test';


// console.log(test || '');




            // var created = new Date();
            
            // console.log('link -- ' + created.getMonth()+'/'+created.getDate()+' '+created.getHours()+':'+created.getMinutes());
            
            
            
            // created = new Date();
            
            // console.log(created.getTime());