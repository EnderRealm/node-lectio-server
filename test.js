var test = new Object();


test.test = [];




test.test.push("test");
test.test.push("test2");
test.name = "steve";

console.log(test);


var ASync = require('async');
var netlib = require('./netlib.js');


var arr = [];

arr[0] = {id:0, url:'http://t.co/hHbkauDnjf'};
arr[1] = {id:1, url:'http://t.co/VQAAOgX0uR'};
arr[2] = {id:2, url:'http://t.co/VQAAOgX0uR'};
arr[3] = {id:3, url:'http://t.co/oz91ljzmYm'};



console.log('arr');
console.log(arr);

function getRandomInt(min,max) {
    return Math.floor(Math.random()*(max-min+1))+min;
}


var buf = "howdy";



// arr.forEach(function(item) {
    // setTimeout( function() {
        // buf += item;
        // console.log(buf);
    // }, getRandomInt(100,1000));
// });

buf += "finished";                    


                    
                    
// 

ASync.eachSeries(arr, function(item, callback) {
        
        // setTimeout( function() {
            // buf += item.id;
            // callback();
        // }, getRandomInt(100,10000));
    
    netlib.expandUrl(item.url, function(err, data) {
        if(err) {
            console.error(err);
        } 
        else {
            buf += item.id;
            callback();
        }
    });
}, function(err) {
    console.log(buf); // in the end
});




buf += "finished";                    
                 
console.log('end');                 
console.log(buf);