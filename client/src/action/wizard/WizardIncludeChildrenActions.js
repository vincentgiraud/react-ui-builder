'use strict';

var Reflux = require('reflux');

var WizardIncludeChildrenActions = Reflux.createActions([
    'setInitialOptions',
    'cancelWizard',
    'submitStep0'
]);

module.exports = WizardIncludeChildrenActions;

