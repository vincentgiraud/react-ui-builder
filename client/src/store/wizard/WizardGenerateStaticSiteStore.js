'use strict';

var _ = require('lodash');
var validator = require('validator');
var Reflux = require('reflux');

var Server = require('../../api/Server.js');
var Repository = require('../../api/Repository.js');
var Common = require('../../api/Common.js');
var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var WizardGenerateStaticSiteActions = require('../../action/wizard/WizardGenerateStaticSiteActions.js');
var ModalStaticSiteGeneratorActions = require('../../action/modal/ModalStaticSiteGeneratorActions.js');

var defaultModel = {
    step: 0,
    errors: [],
    pageContents: {}
};

var WizardGenerateStaticSiteStore = Reflux.createStore({
    listenables: WizardGenerateStaticSiteActions,

    getInitialModel: function(){
        this.model = _.clone(defaultModel);
        var pages = Repository.getCurrentProjectPageNames();
        if(pages && pages.length > 0){
            pages.map(function(pageName, index){
                this.model.pageContents[pageName] = {
                    isIndexPage: index === 0,
                    checked: true
                };
            }.bind(this));
        }
        return this.model;
    },

    onSetInitialOptions: function(options){
    },

    onStartStep0: function(){
        this.model.errors = [];
        this.model.step = 0;
        this.trigger(this.model);
    },

    onSubmitStep0: function(options){
        this.model.errors = [];
        this.model.pageContents = options;
        this.onStartStep1();
    },

    onStartStep1: function(){
        this.model.errors = [];
        this.model.step = 1;
        this.trigger(this.model);
    },

    onSubmitStep1: function(options) {
        this.model.errors = [];
        if(!options.dirName){
            this.model.errors = ['Enter valid alphanumeric folder name value'];
            this.trigger(this.model);
        } else {
            this.model.dirName = options.dirName;


            var pageContents = {};
            _.forOwn(this.model.pageContents, function(value, prop){
                if(value.checked){
                    pageContents[prop] = value;
                }
            });

            var endpoint = Repository.getCurrentPageWindow() ? Repository.getCurrentPageWindow().endpoint : null;

            var projectModel = Repository.getCurrentProjectModel();
            if(projectModel.pages && projectModel.pages.length > 0){
                projectModel.pages.map(function(page){
                    Common.cleanPropsUmyId(page);
                    if(pageContents[page.pageName]){
                        if(endpoint && endpoint.renderPageToString){
                            pageContents[page.pageName].htmlContent = endpoint.renderPageToString(page);
                        }
                    }
                });
            }

            Server.invoke('generateStaticSite',
                {
                    destDirName: this.model.dirName,
                    pageContents: pageContents,
                    projectModel: projectModel
                },
                function(errors){
                    this.model.errors = errors;
                    this.trigger(this.model);
                }.bind(this),
                function(response){
                    this.onStartStep2();
                }.bind(this)
            );
        }
    },

    onStartStep2: function(){
        this.model.errors = [];
        this.model.messages = [
            "Static content was successfully created.",
            "Please find compiled files in \"" + this.model.dirName + "/public\" folder.",
            "The path is relative to the project root."
        ];
        this.model.step = 2;
        this.trigger(this.model);
    },

    onSubmitStep2: function(options){
        ModalStaticSiteGeneratorActions.hideModal();
    }
});

module.exports = WizardGenerateStaticSiteStore;

