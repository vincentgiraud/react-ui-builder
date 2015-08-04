'use strict';

var Reflux = require('reflux');
var ModalQuickActionComponentActions = require('../../action/modal/ModalQuickActionComponentActions.js');
var Repository = require('../../api/Repository.js');

var defaultModel = {
    isModalOpen: false
};

var ModalQuickActionComponentStore = Reflux.createStore({
    model: defaultModel,
    listenables: ModalQuickActionComponentActions,

    onShow: function(options){
        if(!this.model.isModalOpen){
            this.model.itemsTree = Repository.getComponentsTree();
            this.model.selectedUmyId = options.selectedUmyId;
            this.model.appendCommand = options.appendCommand;
            this.model.isModalOpen = true;
            this.trigger(this.model);
        }
    },

    onHide: function(){
        if(this.model.isModalOpen){
            this.model.isModalOpen = false;
            this.trigger(this.model);
        }
    }

});

module.exports = ModalQuickActionComponentStore;
