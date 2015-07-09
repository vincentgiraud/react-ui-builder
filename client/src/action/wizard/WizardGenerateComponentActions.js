'use strict';

var Reflux = require('reflux');

var WizardGenerateComponentActions = Reflux.createActions([
    'setInitialOptions',
    'cancelWizard',
    'startStep0',
    'submitStep0',
    'startStep1',
    'submitStep1'

]);

module.exports = WizardGenerateComponentActions;

