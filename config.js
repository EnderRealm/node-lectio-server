
var config = {};
config.port = process.env.PORT || 3000;
config.streamURL = process.env.TWITTER_STREAM_CALLBACK_URL;
config.mongoURL = process.env.MONGOHQ_URL;
config.tweet_collection = process.env.TWEET_COLLECTION_NAME;
config.user_collection = process.env.USER_COLLECTION_NAME;

exports.config = config;