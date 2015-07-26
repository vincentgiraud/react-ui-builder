'use strict';

var Reflux = require('reflux');

var ModalComponentEditorTriggerActions = Reflux.createActions([
    'showModal',
    'hideModal',
    'toggleModal',
    'saveProperties',
    'generateComponentChildrenCode',
    'cancelWizard',
    'startWizardGenerateComponent',
    'submitWizardGenerateComponent'

]);

module.exports = ModalComponentEditorTriggerActions;
