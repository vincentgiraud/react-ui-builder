'use strict';

var _ = require('underscore');
var Reflux = require('reflux');
var ApplicationActions = require('../../action/application/ApplicationActions.js');
var ModalProgressTriggerActions = require('../../action/modal/ModalProgressTriggerActions.js');
var PanelAvailableComponentsActions = require('../../action/panel/PanelAvailableComponentsActions.js');
var Server = require('../../api/Server.js');
var docCookie = require('../../api/cookies.js');
var Repository = require('../../api/Repository.js');

var defaultModel = {
    stage: 'start',
    errors: null,
    packageVersion: 'unversioned',
    builderConfig: {}
};


var ApplicationStore = Reflux.createStore({
    model: defaultModel,
    listenables: ApplicationActions,

    onGoToErrors: function(errors){
        this.model.stage = 'errors';
        this.model.errors = errors;
        this.trigger(this.model);
    },

    onGoToStartPage: function(){
        this.model.errors = null;
        this.model.stage = 'start';
        this.trigger(this.model);
    },

    onGoToDeskPage: function(){
        this.model.errors = null;
        this.model.stage = 'deskPage';
        this.trigger(this.model);
    },

    onStoreBuilderConfig: function(config){
        var self = this;
        Server.invoke('storeConfiguration', config,
            function(errors){
                self.onGoToErrors(errors);
            },
            function(response){
                ;
            }
        );
    },

    onOpenLocalProject: function(options){
        if(options.dirPathIndex >= 0) {
            //
            ModalProgressTriggerActions.showModalProgress('Project is being loaded. Please wait...', 400);
            //
            Server.invoke('prepareLocalProject', {dirPathIndex: options.dirPathIndex},
                function(errors){
                    this.model.errors = errors;
                    this.trigger(this.model);
                }.bind(this),
                function(response){

                    //console.log(response);

                    Repository.setCurrentProjectModel(response.model);
                    Repository.setHtmlForDesk(response.htmlURLPrefix + '/' + response.htmlForDesk);
                    Repository.setCurrentPageModelByIndex(0);
                    Repository.setComponentsTree(response.componentsTree);

                    this.model.errors = null;
                    //
                    //
                    this.onGoToDeskPage();
                    //

                }.bind(this)
            );
        } else {
            this.model.errors = ['Please specify local project directory path'];
            this.trigger(this.model);
        }
    }



});

module.exports = ApplicationStore;
