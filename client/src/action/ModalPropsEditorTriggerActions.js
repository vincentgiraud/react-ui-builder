'use strict';

var Reflux = require('reflux');

var ModalPropsEditorTriggerActions = Reflux.createActions([
    'showModal',
    'hideModal',
    'toggleModal',
    'saveProperties',
    'saveOptionsVariant',
    'generateComponentChildrenCode',
    'cancelWizard',
    'startWizardGenerateComponent',
    'submitWizardGenerateComponent'

]);

module.exports = ModalPropsEditorTriggerActions;
