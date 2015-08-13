'use strict';

var _ = require('lodash');
var validator = require('validator');
var Reflux = require('reflux');

var Server = require('../../api/Server.js');
var Repository = require('../../api/Repository.js');
var Common = require('../../api/Common.js');
var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var WizardGenerateComponentActions = require('../../action/wizard/WizardGenerateComponentActions.js');
var ModalComponentGeneratorActions = require('../../action/modal/ModalComponentGeneratorActions.js');

var defaultModel = {
    step: 0,
    errors: []
};

var WizardGenerateComponentStore = Reflux.createStore({
    listenables: WizardGenerateComponentActions,

    getInitialModel: function(){
        this.model = _.clone(defaultModel);
        return this.model;
    },

    onSetInitialOptions: function(options){
        this.model.selectedUmyId = options.selectedUmyId;
    },

    onStartStep0: function(){
        this.model.step = 0;
        this.trigger(this.model);
    },

    onSubmitStep0: function(options){
        this.model.errors = [];
        var componentGroup = options.componentGroup;
        if(!componentGroup || componentGroup.length <= 0 || !validator.isAlphanumeric(componentGroup)){
            this.model.errors.push('Please enter alphanumeric value for group name');
        }
        var componentName = options.componentName;
        if(!componentName || componentName.length <= 0 || !validator.isAlphanumeric(componentName)){
            this.model.errors.push('Please enter alphanumeric value for component name');
        }
        var testComponent = Repository.getComponentFromTree(componentName);
        if(testComponent.value){
            this.model.errors.push(
                'There is already a component with name: ' + componentName + '. Please specify another component name.'
            );
        }

        if(this.model.errors.length === 0){
            var _componentName = options.componentName;
            if (_componentName && _componentName.length > 0) {
                var firstChar = _componentName.charAt(0).toUpperCase();
                _componentName = firstChar + _componentName.substr(1);
            }
            this.model.componentGroup = componentGroup;
            this.model.componentName = _componentName;

            this.onStartStep1();
        } else {
            this.trigger(this.model);
        }
    },

    onStartStep1: function(){

        Server.invoke('getGeneratorList', {},

            function(errors){
                this.model.errors = errors;
                this.trigger(this.model);
            }.bind(this),

            function(data){

                this.model.generatorList = data;

                this.model.step = 1;
                this.trigger(this.model);
            }.bind(this)

        );

    },

    onSubmitStep1: function(options) {

        var searchResult = Repository.findInCurrentPageModelByUmyId(this.model.selectedUmyId);
        var copy = searchResult.found;
        Common.cleanPropsUmyId(copy);
        copy.props = copy.props || {};


        Server.invoke('generateComponentCode',
            {
                componentGroup: this.model.componentGroup,
                componentName: this.model.componentName,
                componentModel: copy,
                generatorName: options.generatorName
            },

            function (errors) {
                this.model.errors = errors;
                this.trigger(this.model);
            }.bind(this),

            function (data) {

                this.model.componentSourceDataObject = data;
                this.model.componentModel = copy;
                this.onStartStep2();

            }.bind(this)
        );
    },

    onStartStep2: function(){
        this.model.step = 2;
        this.trigger(this.model);
    },

    onSubmitStep2: function(options){
        //if(options.sourceCode){
        //    this.model.componentSourceDataObject.component.sourceCode = options.sourceCode;
        //}

        Server.invoke('commitComponentCode', this.model.componentSourceDataObject,
            function(errors){
                this.model.errors = errors;
                this.trigger(this.model);
            }.bind(this),
            function(response){

                var isChildrenAcceptable = options.sourceCode.indexOf('this.props.children') >= 0;

                var projectModel = Repository.getCurrentProjectModel();
                var searchResult = null;
                for(var i = 0; i < projectModel.pages.length; i++){
                    if(!searchResult){
                        searchResult = Common.findByUmyId(projectModel.pages[i], this.model.selectedUmyId);
                    }
                }
                if(searchResult){
                    searchResult.found.type = this.model.componentName;
                    if(!isChildrenAcceptable){
                        searchResult.found.children = [];
                    }
                    searchResult.found.text = null;
                    Repository.renewCurrentProjectModel(projectModel);
                    DeskPageFrameActions.renderPageFrame();
                }

                ModalComponentGeneratorActions.hideModal();
            }.bind(this)
        );
    }
});

module.exports = WizardGenerateComponentStore;

