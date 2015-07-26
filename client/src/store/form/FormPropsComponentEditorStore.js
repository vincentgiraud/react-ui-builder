'use strict';

var _ = require('underscore');
var Reflux = require('reflux');
var FormPropsComponentEditorActions = require('../../action/form/FormPropsComponentEditorActions.js');

var defaultModel = {
    wizard: 'None'
};

var FormPropsComponentEditorStore = Reflux.createStore({

    listenables: FormPropsComponentEditorActions,
    model: defaultModel,
    initialModel: _.clone(defaultModel),

    onCancelWizard: function(){

        this.model.wizard = 'None';
        this.trigger(this.model);

    },

    onStartWizardSaveVariant: function(sourceCode){
        this.model.wizard = 'SaveVariant';
        this.model.sourceCode = sourceCode;
        this.trigger(this.model);
    },

    onSubmitWizardSaveVariant: function(sourceCode){
        this.model.wizard = 'None';
        this.model.sourceCode = sourceCode;
        this.trigger(this.model);
    }
});

module.exports = FormPropsComponentEditorStore;

