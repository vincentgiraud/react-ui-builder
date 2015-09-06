'use strict';

var _ = require('lodash');
var Reflux = require('reflux');
var Server = require('../../api/Server.js');
var Common = require('../../api/Common.js');
var Repository = require('../../api/Repository.js');
var ModalUploadProjectActions = require('../../action/modal/ModalUploadProjectActions.js');

var defaultModel = {
    isModalOpen: false
};

var excludeFiles = ['.DS_Store', 'node_modules'];
var mandatoryFiles = ['.builder'];

var builderConfig = {};

var ModalUploadProjectStore = Reflux.createStore({
    model: defaultModel,
    listenables: ModalUploadProjectActions,

    readProjectConfig: function(callback){
        Server.invoke('readLocalConfiguration', {},
            function(errors){
                callback();
            },
            function(response){
                builderConfig = response;
                callback();
            }.bind(this)
        );
    },

    onShowModal: function(){
        if(!this.model.isModalOpen){
            this.model.errors = null;
            this.model.isModalOpen = true;
            Server.invoke("loadUserProfile", {},
                function(errors){
                    this.model.errors = errors;
                    this.model.stage = 'serverConnectionError';
                    this.trigger(this.model);
                }.bind(this),
                function(response){
                    this.model.stage = 'chooseFiles';
                    this.trigger(this.model);
                }.bind(this)
            );
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

module.exports = ModalUploadProjectStore;
