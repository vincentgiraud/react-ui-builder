'use strict';

var Reflux = require('reflux');
var Server = require('../../api/Server.js');
var ModalProjectSettingsTriggerActions = require('../../action/modal/ModalProjectSettingsTriggerActions.js');

var defaultModel = {
    isModalOpen: false
};

var ModalProjectSettingsTriggerStore = Reflux.createStore({
    model: defaultModel,
    listenables: ModalProjectSettingsTriggerActions,

    onShowModal: function(){
        if(!this.model.isModalOpen){
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

module.exports = ModalProjectSettingsTriggerStore;
