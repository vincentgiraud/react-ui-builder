'use strict';

var Reflux = require('reflux');

var ApplicationActions = Reflux.createActions([
    'goToErrors',
    'goToDeskPage',
    'goToStartPage',
    'goToGallery',
    'refreshServerInfo',
    'readBuilderConfig',
    'storeBuilderConfig',
    'openLocalProject',
    'stopAutosaveProjectModel',
    'previewProject',
    'startDownloadProject',
    'downloadProject',
    'loadUserProfile',
    'initUserCredentials',
    'removeUserCredentials',
    'createUserProfile',
    'goToSignInForm',
    'goToSignUpForm'
]);

module.exports = ApplicationActions;
