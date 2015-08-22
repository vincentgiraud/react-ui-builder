'use strict';

var Reflux = require('reflux');

var PanelOptionsActions = Reflux.createActions([
    'selectItem',
    'deselectItem',
    'changeOptions'
]);

module.exports = PanelOptionsActions;