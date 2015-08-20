'use strict';

var Reflux = require('reflux');

var ModalPageInfoEditorActions = Reflux.createActions([
    'showModal',
    'hideModal',
    'toggleModal',
    'saveProperties'

]);

module.exports = ModalPageInfoEditorActions;
