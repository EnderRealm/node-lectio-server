var mongoClient = require('mongodb').MongoClient;
var format = require('util').format;

var twitlib = require('./twitterlib.js');
var fblib = require('./facebooklib.js');
var util = require('./util.js');
var config = require('./config.js').config;


util.logger(util.INFO, 'Starting update stream processing server...');



mongoClient.connect(config.mongoURL, function(err, db) {
    if(err) {
        util.logger(util.ERROR, 'Unable to connect to mongo DB: '+err);
        throw err;
    }

    var user_collection = db.collection(config.user_collection);
    var service_collection = db.collection(config.service_collection);
  

    // fetch all active users
    user_collection.find().toArray(function(err, users) {
        if(err) {
            util.logger(util.ERROR, 'Unable to find users');
            //throw err;
        }

    
        for(i in users) {
            var user = users[i];

            for(n in user.services) {
                var user_service = user.services[n];
                service_collection.find({_id: user_service.service_id}).toArray(function(err, service) {
                
                    switch(service.name) {
                    case 'Twitter': 
                        console.log('starting twitter stream processor');
                        util.debug(service, 1);
                        
                        twitlib.userStream(user._id, service);
                        break;
                        
                    case 'Facebook':
                        console.log('starting facebook stream processor');
                        util.debug(service,1);


                        fblib.userStream(user._id, service);

                    }
                
                
                });
                
            }
            
        }
    
        // Let's close the db
        //db.close();

    
    });      

 
    util.logger(util.INFO, 'Initial startup sequence complete');


    
});



//twitlib.userStream();





