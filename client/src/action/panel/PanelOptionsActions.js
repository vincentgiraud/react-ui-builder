'use strict';

var Reflux = require('reflux');

var PanelOptionsActions = Reflux.createActions([
    'selectItem',
    'deselectItem',
    'changeOptions',
    'setFocusTo',
    'deleteOptions'
]);

module.exports = PanelOptionsActions;