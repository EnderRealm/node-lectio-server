var mongoClient = require('mongodb').MongoClient;
var format = require('util').format;

var twitlib = require('./twitterlib.js');
var util = require('./util.js');
var config = require('./config.js').config;


util.logger(util.INFO, 'Starting update stream processing server...');



mongoClient.connect(config.mongoURL, function(err, db) {
	if(err) {
		util.logger(util.ERROR, 'Unable to connect to mongo DB');
		throw err;
	}

	var collection = db.collection(config.user_collection);

	// Locate all the entries using find
	collection.find().toArray(function(err, users) {

		for(i in users) {
			var user = users[i];

			for(n in user.services) {
				var service = user.services[n];
				
				switch(service.name) {
					case 'Twitter': 
						twitlib.userStream(user._id, service);
						break;
				}
			}
			
			//twitlib.userStream
			//util.debugPrint(users[user],2);
		}
		// Let's close the db
		db.close();
	});      

});



//twitlib.userStream();





