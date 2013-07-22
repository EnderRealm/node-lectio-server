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


    
 
    
    
