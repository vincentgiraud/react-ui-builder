'use strict';

var Reflux = require('reflux');

var ModalComponentEditorActions = Reflux.createActions([
    'showModal',
    'hideModal',
    'toggleModal',
    'saveProperties',
    'generateComponentChildrenCode',
    'cancelWizard',
    'startWizardGenerateComponent',
    'submitWizardGenerateComponent'

]);

module.exports = ModalComponentEditorActions;
