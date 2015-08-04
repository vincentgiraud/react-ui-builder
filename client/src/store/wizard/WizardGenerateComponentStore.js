'use strict';

var _ = require('underscore');
var validator = require('validator');
var Reflux = require('reflux');

var Server = require('../../api/Server.js');
var Repository = require('../../api/Repository.js');
var Common = require('../../api/Common.js');

var WizardGenerateComponentActions = require('../../action/wizard/WizardGenerateComponentActions.js');
var ModalComponentEditorActions = require('../../action/modal/ModalComponentEditorActions.js');

var defaultModel = {
    step: 0,
    includeChildren: true,
    includeFlux: false,
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

    onCancelWizard: function(){
        ModalComponentEditorActions.cancelWizard();
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
            this.model.componentGroup = componentGroup;
            this.model.componentName = componentName;
            this.onStartStep1();
        } else {
            this.trigger(this.model);
        }
    },

    onStartStep1: function(){
        this.model.step = 1;
        this.trigger(this.model);
    },

    onSubmitStep1: function(options) {

        this.model.includeChildren = options.includeChildren;
        this.model.includeFlux = options.includeFlux;

        var _componentName = this.model.componentName;
        if (_componentName && _componentName.length > 0) {
            var firstChar = _componentName.charAt(0).toUpperCase();
            _componentName = firstChar + _componentName.substr(1);
        }
        this.model.componentName = _componentName;

        var projectModel = Repository.getCurrentProjectModel();
        var searchResult = null;
        for (var i = 0; i < projectModel.pages.length; i++) {
            if (!searchResult) {
                searchResult = Common.findByUmyId(projectModel.pages[i], this.model.selectedUmyId);
            }
        }

        var sourceCode = null;
        var actionsSourceCode = null;
        var storeSourceCode = null;

        Server.invoke('generateComponentCode',
            {
                componentGroup: this.model.componentGroup,
                componentName: this.model.componentName,
                componentModel: searchResult.found,
                includeChildren: this.model.includeChildren,
                includeFlux: this.model.includeFlux
            },

            function (errors) {
                this.model.errors = errors;
                this.trigger(this.model);
            }.bind(this),

            function (data) {

                sourceCode = data;

                if (options.includeFlux) {
                    Server.invoke('generateFluxCode',
                        {
                            componentGroup: this.model.componentGroup,
                            componentName: this.model.componentName
                        },
                        function (errors) {
                            this.model.errors = errors;
                            this.trigger(this.model);
                        }.bind(this),
                        function (response) {

                            actionsSourceCode = response.actionsSourceCode;
                            storeSourceCode = response.storeSourceCode;

                            ModalComponentEditorActions.submitWizardGenerateComponent(
                                {
                                    componentGroup: this.model.componentGroup,
                                    componentName: this.model.componentName,
                                    sourceCode: sourceCode,
                                    actionsSourceCode: actionsSourceCode,
                                    storeSourceCode: storeSourceCode
                                }
                            );


                        }.bind(this)
                    );
                } else {

                    ModalComponentEditorActions.submitWizardGenerateComponent(
                        {
                            componentGroup: this.model.componentGroup,
                            componentName: this.model.componentName,
                            sourceCode: sourceCode
                        }
                    );

                }

            }.bind(this)
        );
    }
});

module.exports = WizardGenerateComponentStore;

