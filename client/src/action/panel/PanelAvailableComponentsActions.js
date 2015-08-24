'use strict';

var Reflux = require('reflux');

var PanelAvailableComponentsActions = Reflux.createActions([
    'selectComponent',
    'refreshComponentList',
    'selectComponentItem',
    'deselectComponentItem',
    'selectComponentItemDefaultsIndex',
    'deleteDefaultsIndex',
    'quickAppend'
]);

module.exports = PanelAvailableComponentsActions;
