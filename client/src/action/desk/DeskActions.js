'use strict';

var Reflux = require('reflux');

var DeskActions = Reflux.createActions([
    'startEditMode',
    'startDocumentMode',
    'startLivePreviewMode',
    'toggleAvailableComponents',
    'toggleStyleOptions',
    'toggleComponentsHierarchy',
    'changeIframeWidth'
]);

module.exports = DeskActions;
