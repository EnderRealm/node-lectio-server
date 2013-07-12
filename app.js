
var twitlib = require('./twitterlib.js');
var util = require('./util.js');



//twitlib.testStream( function(data) {
//  console.log(data);
//});




util.logger(util.INFO, 'Starting update stream processing server...');



twitlib.userStream();





