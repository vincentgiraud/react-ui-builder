'use strict';

var Reflux = require('reflux');

var PanelOptionsActions = Reflux.createActions([
    'selectItem',
    'deselectItem',
    'changeOptions',
    'setFocusTo'
]);

module.exports = PanelOptionsActions;