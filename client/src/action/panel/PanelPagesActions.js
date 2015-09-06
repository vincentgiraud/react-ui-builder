'use strict';

var Reflux = require('reflux');

var PanelPagesActions = Reflux.createActions([
    'setActivePage',
    'refreshPageList'
]);

module.exports = PanelPagesActions;