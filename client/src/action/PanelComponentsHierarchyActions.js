'use strict';

var Reflux = require('reflux');

var PanelComponentsHierarchyActions = Reflux.createActions([
    'refreshTreeview',
    'selectTreeviewItem',
    'deselectTreeviewItem',
    'setFrameWindow',
    'setCopyMark',
    'removeCopyMark',
    'setCutMark',
    'removeCutMark',
    'inlineTextSubmit'
]);

module.exports = PanelComponentsHierarchyActions;
