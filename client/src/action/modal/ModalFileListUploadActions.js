'use strict';

var Reflux = require('reflux');

var ModalFileListUploadActions = Reflux.createActions([
    'showModal',
    'uploadFiles',
    'hideModal',
    'toggleModal'
]);

module.exports = ModalFileListUploadActions;
