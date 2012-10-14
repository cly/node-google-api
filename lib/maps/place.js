/**
 * Module dependencies.
 */
var _ = require('underscore')
  , request = require('request')
;

/**
 * Constants
 */
var VALID_OUTPUT = ['json', 'xml'];

/**
 * Constructor.
 */
var Module = function (params) {
    if (!params.key) {
        throw new Error('No key provided.');
    }
    this._key = params.key;

    if (params.output && VALID_OUTPUT.indexOf(params.output) > -1) {
        this._output = params.output;
    } else {
        this._output = 'json';
    }
};

/**
 * Public methods.
 */
Module.prototype.search = function (required, cb, optional) {
    var params = [];
    // Latitude and longitude.
    if (required.latitude && required.longitude) {
        params.push({key: 'latitude', value: required.latitude});
        params.push({key: 'longitude', value: required.longitude});
    } else {
        throw new Error('Latitude or Longitude is required.');
    }
};

module.exports = Module;
