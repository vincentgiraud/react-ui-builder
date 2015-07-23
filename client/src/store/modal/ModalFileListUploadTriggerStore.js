'use strict';

var _ = require('underscore');
var Reflux = require('reflux');
var Server = require('../../api/Server.js');
var ModalFileListUploadTriggerActions = require('../../action/modal/ModalFileListUploadTriggerActions.js');

var defaultModel = {
    isModalOpen: false
};

var excludeFiles = ['.DS_Store', 'node_modules'];
var mandatoryFiles = ['.builder'];

var builderConfig = {};

var ModalFileListUploadTriggerStore = Reflux.createStore({
    model: defaultModel,
    listenables: ModalFileListUploadTriggerActions,

    onShowModal: function(){
        if(!this.model.isModalOpen){
            this.model.errors = null;
            this.model.isModalOpen = true;
            this.trigger(this.model);
        }
    },

    onHideModal: function(){
        if(this.model.isModalOpen){
            this.model.isModalOpen = false;
            this.trigger(this.model);
        }
    },
    onToggleModal: function(){
        this.model.isModalOpen = !this.model.isModalOpen;
        this.trigger(this.model);
    }
});

module.exports = ModalFileListUploadTriggerStore;
