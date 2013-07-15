var util = require('util');


var ERROR = 'error';
var WARN = 'warning';
var INFO = 'info';
var DEBUG = 'debug';

var LOG_TYPE_SET = {};
LOG_TYPE_SET[ERROR] = 'error';
LOG_TYPE_SET[WARN] = 'warn';
LOG_TYPE_SET[INFO] = 'info';
LOG_TYPE_SET[DEBUG] = 'debug';


function getObjectClass(obj) {
    if(obj && obj.constructor && obj.constructor.toString) {
        var arr = obj.constructor.toString().match(
            /function\s*(\w+)/);
            
        if(arr & arr.length == 2) {
            return arr[1];
        }
    }
    return undefined;
}



function debug(arg, depth) {
    var type = typeof(arg);
    
    if(type == 'object') {
        var obj = eval(arg);
        
        arg = util.inspect(arg, {showHidden: true, depth: depth, colors: true});
        type = getObjectClass(obj);
     }

    console.log('['+typeof(arg)+']'+arg.toString());
}



var logger = function (type, msg) {
    
    if(!LOG_TYPE_SET.hasOwnProperty(type)) {
        
        console.error('[error] invalid logging type: ' + type);
        throw 'invalid logging type';
    }

    var now = new Date();
    var timestamp = now.getUTCMonth()+'-'+now.getUTCDate()+'-'+now.getUTCFullYear()+' '+now.getUTCHours()+':'+now.getUTCMinutes()+':'+now.getUTCSeconds()+'.'+now.getUTCMilliseconds()
    
    console.log('['+type+']'+'('+timestamp+') '+ msg);

    return;
}


exports.logger = logger;
exports.debug = debug;

exports.ERROR = ERROR;
exports.WARN = WARN;
exports.INFO = INFO;
exports.DEBUG = DEBUG;