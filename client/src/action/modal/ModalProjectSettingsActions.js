'use strict';

var Reflux = require('reflux');

var ModalProjectSettingsActions = Reflux.createActions([
    'showModal',
    'saveSettings',
    'hideModal',
    'toggleModal'
]);

module.exports = ModalProjectSettingsActions;
