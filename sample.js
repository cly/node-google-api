var key = require('./key.json');

var GoogleAPI = require('./lib/node-google-api');

var gapi = new GoogleAPI({key: key.key});


var searchParams = {
    longitude: '0'
  , latitude: '0'
  , radius: 5000
  , sensor: false
};

var detailsParams = {
    reference: 'CnRsAAAA98C4wD-VFvzGq-KHVEFhlHuy1TD1W6UYZw7KjuvfVsKMRZkbCVBVDxXFOOCM108n9PuJMJxeAxix3WB6B16c1p2bY1ZQyOrcu1d9247xQhUmPgYjN37JMo5QBsWipTsnoIZA9yAzA-0pnxFM6yAcDhIQbU0z05f3xD3m9NQnhEDjvBoUw-BdcocVpXzKFcnMXUpf-nkyF1w'
  , sensor: false
  , language: 'en'
};

gapi.place.details(detailsParams, function (e, d) {
    console.log(arguments);
});
