'use strict';

var Reflux = require('reflux');

var PopoverComponentVariantActions = Reflux.createActions([
    'show',
    'hide',
    'setupScrollTop',
    'scroll'
]);

module.exports = PopoverComponentVariantActions;