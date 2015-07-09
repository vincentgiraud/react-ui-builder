'use strict';

var _ = require('underscore');
var validator = require('validator');
var Reflux = require('reflux');

var Server = require('../../api/Server.js');
var Repository = require('../../api/Repository.js');
var Common = require('../../api/Common.js');

var WizardIncludeChildrenActions = require('../../action/wizard/WizardIncludeChildrenActions.js');
var FormCodeComponentEditorActions = require('../../action/form/FormCodeComponentEditorActions.js');

var defaultModel = {
    step: 0,
    isCommittable: false,
    commitmentMessage: 'Change me'
};

var WizardIncludeChildrenStore = Reflux.createStore({
    listenables: WizardIncludeChildrenActions,

    getInitialModel: function(){
        this.model = _.clone(defaultModel);
        return this.model;
    },

    onCancelWizard: function(){
        FormCodeComponentEditorActions.cancelWizard();
    },

    onSetInitialOptions: function(options){
        this.model.componentName = options.componentName;
        this.model.selectedUmyId = options.selectedUmyId;
        this.model.sourceCode = options.sourceCode;
        Server.invoke('isChildrenAcceptable',
            {sourceCode: this.model.sourceCode},
            function(err){
                this.model.errors = [JSON.stringify(err)];
                this.model.commitmentMessage = 'Error is occurred';
                this.model.isCommittable = false;
                this.trigger(this.model);
            }.bind(this),
            function(response){

                if(response.isChildrenAcceptable){
                    this.model.commitmentMessage = 'Please note: text {this.props.children} in source code will be overwritten.';
                    this.model.isCommittable = true;
                } else {
                    this.model.commitmentMessage = 'The component\'s source code does not contain text: {this.props.children}';
                    this.model.isCommittable = false;
                }

                this.trigger(this.model);
            }.bind(this)
        );
    },

    onSubmitStep0: function(){
        var testComponent = Repository.getComponentFromTree(this.model.componentName);
        if(testComponent.value){
            //
            var projectModel = Repository.getCurrentProjectModel();
            var searchResult = null;
            for(var i = 0; i < projectModel.pages.length; i++){
                if(!searchResult){
                    searchResult = Common.findByUmyId(projectModel.pages[i], this.model.selectedUmyId);
                }
            }
            //
            Server.invoke('generateComponentChildrenCode',
                {
                    componentGroup: testComponent.group,
                    componentName: this.model.componentName,
                    componentModel: searchResult.found,
                    sourceCode: this.model.sourceCode
                },
                function(errors){
                    this.model.errors = [JSON.stringify(errors)];
                    this.model.commitmentMessage = 'Error is occurred';
                    this.model.isCommittable = false;
                    this.trigger(this.model);
                }.bind(this),
                function(data){
                    this.model.sourceCode = null;
                    FormCodeComponentEditorActions.submitWizardIncludeChildren(data);
                }.bind(this)
            );
        }

    }
});

module.exports = WizardIncludeChildrenStore;

