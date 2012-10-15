/**
 * Module dependencies.
 */
var _ = require('underscore')
  , request = require('request')
  , url = require('url')
;

/**
 * Constants
 */
var VALID_OUTPUT = ['json', 'xml'];
var MAX_RADIUS_METER = 50000;
var VALID_LANGUAGES = [{
    code: 'en'
  , name: 'English'
  , v2: 'true'
  , v3: 'true'
}];
var DEFAULT_LANGUAGE_CODE = 'en';
var VALID_TYPES = [{
    code: 'bakery'
}, {
    code: 'bar'
}, {
    code: 'cafe'
}, {
    code: 'food'
}, {
    code: 'grocery_or_supermarket'
}, {
    code: 'liquor_store'
}, {
    code: 'meal_delivery'
}, {
    code: 'meal_takeaway'
}, {
    code: 'movie_theater'
}, {
    code: 'museum'
}, {
    code: 'nightclub'
}, {
    code: 'restaurant'
}, {
    code: 'school'
}, {
    code: 'shopping_mall'
}, {
    code: 'stadium'
}, {
    code: 'store'
}, {
    code: 'university'
}];
var DEFAULT_VALID_TYPES = VALID_TYPES;

var DEFAULT_PROTOCOL = 'https';
var DEFAULT_HOST = 'maps.googleapis.com';

/**
 * Constructor.
 */
var Module = function (params) {
    if (!_(params).has('key')) {
        throw new Error('No API key provided.');
    }
    this._key = params.key;

    if (_(params).has('output') && VALID_OUTPUT.indexOf(params.output) > -1) {
        this._output = params.output;
    } else {
        this._output = 'json';
    }
};

/**
 * Private functions.
 */
// Extracts required and optional parameter fields.
Module.prototype._extractSearchParams = function (params, raw) {
    var _raw = _(raw);
    // Latitude and longitude.
    // Specified as latitude,longitude.
    if (!_raw.has('latitude') || !_raw.has('longitude')) {
        throw new Error('Latitude or Longitude is required.');
    } else {
        params.push({key: 'location', value: raw.latitude + ',' + raw.longitude});
    }

    // Radius.
    // Define distance in meters.
    // Must not be included if optional rankby=distance.
    if (!_raw.has('radius')) {
        throw new Error('Radius is required.');
    } else if (!_.isNumber(raw.radius)) {
        throw new Error('Radius must be a number.');
    } else if (raw.radius > MAX_RADIUS_METER) {
        throw new Error('Radius must be less than 50000.');
    } else {
        params.push({key: 'radius', value: raw.radius});
    }

    // Sensor.
    // Indicates if a location sensor was used to determine location.
    if (!_raw.has('sensor')) {
        throw new Error('Sensor is required.');
    } else if (!_.isBoolean(raw.sensor)) {
        throw new Error('Sensor must be boolean.');
    } else {
        params.push({key: 'sensor', value: raw.sensor});
    }

    // Optional ----------------------------------------------------------------
    // Keyword.
    // Matches against name, type, address, reviews, third party content.
    if (_raw.has('keyword')) {
        params.push({key: 'keyword', value: raw.keyword});
    }

    // Langauge
    // https://spreadsheets.google.com/pub?key=p9pdwsai2hDMsLkXsoM05KQ&gid=1
    if (_.some(VALID_LANGUAGES, function (vl) { vl.code === params.language; })) {
        params.push({key: 'language', value: params.language});
    } else {
        params.push({key: 'language', value: DEFAULT_LANGUAGE_CODE});
    }

    // Name.
    // Matches against names of places.
    if (_raw.has('name')) {
        params.push({key: 'name', value: raw.name});
    }

    // rankby.

    // Types.
    // https://developers.google.com/places/documentation/supported_types
    // Restricts results to matching the specified types.
    if (_raw.has('types') && _.isArray(raw.types)) {
        var collected = [];
        _(raw.types).each(function (o) {
            if (_.some(VALID_TYPES, function (vt) { vt.code === o})) {
                collected.push(o);
            }
        });

        // If no types, use some default types.
        if (collected.length <= 0) {
            _(DEFAULT_VALID_TYPES).each(function (o) {
                collected.push(o.code);
            });
        }
        collected = collected.join('|');
        params.push({key: 'types', value: collected});
    }

    // For next page results.
    if (_raw.has('pagetoken')) {
        params.push({key: 'pagetoken', value: raw.pagetoken});
    }

    return params;
};

Module.prototype._extractDetailsParams = function (params, raw) {

};

Module.prototype._getData = function (pathname, params, cb) {
    pathname += this._output;
    params.push({key: 'key', value: this._key});

    var search = _(params).map(function (v) {
        return v.key + '=' + v.value;
    });
    search = encodeURI(search.join('&'));

    var requestUrl = url.format({
        protocol: DEFAULT_PROTOCOL
      , host: DEFAULT_HOST
      , pathname: pathname
      , search: search
    });

    request(requestUrl, function (error, response, body) {
        return cb(error, body);
    });
};

/**
 * Public methods.
 */
Module.prototype.search = function (raw, cb) {
    var params = [];
    try {
        params = this._extractSearchParams(params, raw);
    } catch (e) {
        return cb(e);
    }

    //https://maps.googleapis.com/maps/api/place/search/json?location=-33.88471,151.218237&radius=100&sensor=true&key=YOUR_KEY
    this._getData('/maps/api/place/search/', params, cb);
};

Module.prototype.details = function (raw, cb) {
    var params = [];
    try {
        params = this._extractDetailsParams(params, raw);
    } catch (e) {
        return cb(e);
    }
    params.push({key: 'key', value: this._key});
};

module.exports = Module;
