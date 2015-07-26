'use strict';

var Reflux = require('reflux');

var WizardVariantNameActions = Reflux.createActions([
    'setInitialOptions',
    'cancelWizard',
    'submitStep0'
]);

module.exports = WizardVariantNameActions;

