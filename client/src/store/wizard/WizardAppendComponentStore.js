'use strict';

var _ = require('lodash');
var validator = require('validator');
var Reflux = require('reflux');

var Server = require('../../api/Server.js');
var Repository = require('../../api/Repository.js');
var Common = require('../../api/Common.js');
var HtmlComponents = require('../../api/HtmlComponents.js');

var ModalQuickActionComponentActions = require('../../action/modal/ModalQuickActionComponentActions.js');
var WizardAppendComponentActions = require('../../action/wizard/WizardAppendComponentActions.js');
var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');

var defaultModel = {
    step: 0
};

var defaultsIndexMap = {};


var WizardAppendComponentStore = Reflux.createStore({
    listenables: WizardAppendComponentActions,

    getInitialModel: function(){
        this.model = _.clone(defaultModel);
        return this.model;
    },

    doAppend: function(options){
        var _options = {
            type: options.type,
            props: options.props || {},
            children: options.children || [],
            text: options.text
        };
        Repository.renewCurrentProjectModel(
            Common.pasteInModelFromClipboard(
                _options,
                this.model.selectedUmyId,
                Repository.getCurrentProjectModel(),
                this.model.command
            )
        );
        DeskPageFrameActions.renderPageFrame();
    },

    loadDefaultsOptions: function(options, callback){
        var componentDefaults = [];
        Server.invoke('loadComponentDefaults', {componentName: options.componentId},
            function(err){
                var htmlDefaults = HtmlComponents[options.componentId];
                if(htmlDefaults){
                    componentDefaults.push({
                        variantName: 'Default',
                        type: options.componentId,
                        props: htmlDefaults.props,
                        children: htmlDefaults.children,
                        text: htmlDefaults.text
                    });
                } else {
                    componentDefaults.push({
                        type: options.componentId
                    });
                }
                Server.invoke('saveComponentDefaults',
                    {
                        componentName: options.componentId,
                        componentOptions: componentDefaults[0]
                    },
                    function(err){
                        //console.error(JSON.stringify(err));
                    },
                    function(response){
                        // do nothing
                    }
                );

                callback(componentDefaults);

            }.bind(this),
            function(response){

                callback(response.model);

            }.bind(this)
        );
    },

    onCancelWizard: function(){

    },

    onSetInitialOptions: function(options){
        this.model.selectedUmyId = options.selectedUmyId;
        this.model.command = options.command;
    },

    onCommitStep0: function(options){
        this.loadDefaultsOptions(
            {
                componentId: options.componentId
            },
            function(defaults){

                var defaultsIndex = defaultsIndexMap[options.componentId];
                if(!_.isNumber(defaultsIndex) || defaultsIndex >= defaults.length){
                    defaultsIndex = 0;
                    defaultsIndexMap[options.componentId] = defaultsIndex;
                }
                // some defaults don't have type value
                defaults[defaultsIndex].type = options.componentId;

                this.doAppend(defaults[defaultsIndex]);
                ModalQuickActionComponentActions.hide();

            }.bind(this)
        );
    },

    onCancelStep0: function(){
        this.model.step = 0;
        this.trigger(this.model);
    },

    onSubmitStep0: function(options){
        this.loadDefaultsOptions(
            {
                componentId: options.componentId
            },
            function(defaults){

                this.model.defaults = defaults;
                this.model.componentId = options.componentId;
                this.model.defaultsIndex = defaultsIndexMap[options.componentId] || 0;
                this.model.step = 1;
                this.trigger(this.model);

            }.bind(this)
        );

    },

    onSubmitStep1: function(options){
        var defaultsIndex = parseInt(options.index);
        if(!_.isNumber(defaultsIndex) || defaultsIndex >= this.model.defaults.length){
            defaultsIndex = 0;
        }
        defaultsIndexMap[this.model.componentId] = defaultsIndex;
        // some defaults don't have type value
        this.model.defaults[defaultsIndex].type = this.model.componentId;
        this.doAppend(this.model.defaults[defaultsIndex]);
        ModalQuickActionComponentActions.hide();
    }

});

module.exports = WizardAppendComponentStore;

