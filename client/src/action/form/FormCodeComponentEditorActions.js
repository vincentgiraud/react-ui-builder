'use strict';

var Reflux = require('reflux');

var FormCodeComponentEditorActions = Reflux.createActions([
    'cancelWizard',
    'startWizardIncludeChildren',
    'submitWizardIncludeChildren'

]);

module.exports = FormCodeComponentEditorActions;

