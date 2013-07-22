var mongoClient = require('mongodb').MongoClient;

var util = require('./util.js');
var config = require('./config.js').config;
var twitlib = require('./twitterlib.js');
var fblib = require('./facebooklib.js');


util.logger(util.INFO, 'Starting update stream processing server...');




function getService(collection, user_id, user_service) {
    collection.findOne({_id: user_service.service_id}, function(err,service) {
        switch(service.name) {
        case 'Twitter': 
            //twitlib.userStream(user_id, user_service, service);
            break;
            
        case 'Facebook':
			console.log('facebook processor');
			fblib.userStream(user_id, user_service, service);
            break;
        }
    });
}




mongoClient.connect(config.mongoURL, {db:{doDebug: true}}, function(err, db) {

    if(err) console.log('error: '+err);
    
    util.logger(util.INFO, 'Connected to DB('+db.databaseName+')');
    
    var user_collection = db.collection(config.user_collection);
    var service_collection = db.collection(config.service_collection);
    
    user_collection.find().toArray(function(err,users) {
    
        for(i in users) {
            var user = users[i];

            for(i in user.services) {
                var user_service = user.services[i];
                
                getService(service_collection, user._id, user_service); 
            
            }
            
        }
    
    });

});



