'use strict';

var Reflux = require('reflux');

var DeskActions = Reflux.createActions([
    'startEditMode',
    'startDocumentMode',
    'startLivePreviewMode',
    'toggleAvailableComponents',
    'toggleStyleOptions',
    'toggleComponentsHierarchy'
]);

module.exports = DeskActions;
