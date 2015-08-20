'use strict';

var Reflux = require('reflux');
var esprima = require('esprima-fb');
var validator = require('validator');

var Server = require('../../api/Server.js');
var Repository = require('../../api/Repository.js');
var Common = require('../../api/Common.js');
var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var ModalStaticSiteGeneratorActions = require('../../action/modal/ModalStaticSiteGeneratorActions.js');

var defaultModel = {
    isModalOpen: false
};

var ModalStaticSiteGeneratorStore = Reflux.createStore({
    model: defaultModel,
    listenables: ModalStaticSiteGeneratorActions,

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

module.exports = ModalStaticSiteGeneratorStore;
