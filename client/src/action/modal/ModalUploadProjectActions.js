'use strict';

var Reflux = require('reflux');

var ModalUploadProjectActions = Reflux.createActions([
    'showModal',
    'hideModal',
    'toggleModal'
]);

module.exports = ModalUploadProjectActions;
