'use strict';

var Reflux = require('reflux');

var DeskPageDocumentActions = Reflux.createActions([
    'markdownChange',
    'changeSection',
    'saveChanges'
]);

module.exports = DeskPageDocumentActions;
