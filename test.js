var twitter = require('twitter-text');
var util = require('./util.js');


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


var test = 'test';


console.log(test || '');




            var created = new Date();
            
            console.log('link -- ' + created.getMonth()+'/'+created.getDate()+' '+created.getHours()+':'+created.getMinutes());