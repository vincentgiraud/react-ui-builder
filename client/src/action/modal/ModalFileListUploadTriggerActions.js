'use strict';

var Reflux = require('reflux');

var ModalFileListUploadTriggerActions = Reflux.createActions([
    'showModal',
    'uploadFiles',
    'hideModal',
    'toggleModal'
]);

module.exports = ModalFileListUploadTriggerActions;
