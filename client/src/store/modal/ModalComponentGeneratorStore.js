'use strict';

var Reflux = require('reflux');
var esprima = require('esprima-fb');
var validator = require('validator');

var Server = require('../../api/Server.js');
var Repository = require('../../api/Repository.js');
var Common = require('../../api/Common.js');
var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var ModalComponentGeneratorActions = require('../../action/modal/ModalComponentGeneratorActions.js');

var defaultModel = {
    isModalOpen: false
};

var ModalComponentGeneratorStore = Reflux.createStore({
    model: defaultModel,
    listenables: ModalComponentGeneratorActions,

    onShowModal: function(options){
        if(!this.model.isModalOpen){

            this.model.selectedUmyId = options.selectedUmyId;
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

module.exports = ModalComponentGeneratorStore;
