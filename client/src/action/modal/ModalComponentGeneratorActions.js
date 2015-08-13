'use strict';

var Reflux = require('reflux');

var ModalComponentGeneratorActions = Reflux.createActions([
    'showModal',
    'hideModal',
    'toggleModal'
]);

module.exports = ModalComponentGeneratorActions;
