'use strict';

var Reflux = require('reflux');

var ModalProgressActions = Reflux.createActions([
    'showModalProgress',
    'showModalMessageArray',
    'updateMessage',
    'hideModalProgress',
    'toggleModalProgress',
    'secondsIncrement'
]);

module.exports = ModalProgressActions;
