import './module';
import './scss/TW.scss';
(function(root, factory) {
    'use strict';
    window.twCom = factory();
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    }
}(this, function() {
    var components = Object.assign(
        require('./js/global'),
        require('./js/animate'),
        require('./js/input-field'),
        require('./js/sidenav'),
        require('./js/modal'),
        require('./js/waves')
    );
    return components;
}));
