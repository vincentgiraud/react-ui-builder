'use strict';

var Reflux = require('reflux');

var FormCodeComponentEditorActions = Reflux.createActions([
    'cancelWizard',
    'submitWizardGenerateComponent',
    'startWizardIncludeChildren',
    'submitWizardIncludeChildren'

]);

module.exports = FormCodeComponentEditorActions;

