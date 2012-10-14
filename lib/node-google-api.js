/**
 * Module dependencies.
 */
var PlaceAPI = require('./maps/place')
;

/**
 * Constructor.
 */
var Module = function (params) {
    if (!params.key) {
        throw new Error('No key provided.');
    }
    this.key = params.key;
    this.place = this.placeAPI = new PlaceAPI({key: this.key})
};

/**
 * Static members.
 */
Module.version = '0.0.1';

/**
 * Public methods.
 */

module.exports = Module;
