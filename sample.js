var key = require('./key.json');

var GoogleAPI = require('./lib/node-google-api');

var gapi = new GoogleAPI({key: key.key});

gapi.place.search({lol: 'lol'});
