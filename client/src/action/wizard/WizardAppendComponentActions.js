'use strict';

var Reflux = require('reflux');

var WizardVariantNameActions = Reflux.createActions([
    'setInitialOptions',
    'cancelWizard',
    'filterAvailableComponents',
    'commitStep0',
    'submitStep0',
    'cancelStep0',
    'submitStep1'
]);

module.exports = WizardVariantNameActions;

