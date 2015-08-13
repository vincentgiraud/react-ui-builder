'use strict';

var Reflux = require('reflux');

var ModalComponentEditorActions = Reflux.createActions([
    'showModal',
    'hideModal',
    'toggleModal',
    'saveProperties',
    'startWizardGenerateComponent'

]);

module.exports = ModalComponentEditorActions;
