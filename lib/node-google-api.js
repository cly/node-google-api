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
};

/**
 * Static members.
 */
Module.version = '0.0.1';

/**
 * Public methods.
 */
Module.prototype.placeAPI = function () {
    if (this.placeAPI) {
        return this.placeAPI;
    } else {
        this.placeAPI = PlaceAPI({key: this.key})
    }
};



module.exports = Module;
