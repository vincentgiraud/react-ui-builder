'use strict';

var Reflux = require('reflux');

var ModalStaticSiteGeneratorActions = Reflux.createActions([
    'showModal',
    'hideModal',
    'toggleModal'
]);

module.exports = ModalStaticSiteGeneratorActions;
