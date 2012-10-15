var key = require('./key.json');

var GoogleAPI = require('./lib/node-google-api');

var gapi = new GoogleAPI({key: key.key});


var params = {
    longitude: '0'
  , latitude: '0'
  , radius: 1000
  , sensor: false
};

gapi.place.search(params, function (e, d) {
    console.log(arguments);
});
