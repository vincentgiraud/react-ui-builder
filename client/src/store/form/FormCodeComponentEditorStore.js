'use strict';

var _ = require('underscore');
var Reflux = require('reflux');
var FormCodeComponentEditorActions = require('../../action/form/FormCodeComponentEditorActions.js');

var defaultModel = {
    wizard: 'None'
};

var FormCodeComponentEditorStore = Reflux.createStore({

    listenables: FormCodeComponentEditorActions,
    model: defaultModel,
    initialModel: _.clone(defaultModel),

    onCancelWizard: function(){

        this.model.wizard = 'None';
        this.trigger(this.model);

    },

    onStartWizardIncludeChildren: function(sourceCode){
        this.model.wizard = 'IncludeChildren';
        this.model.sourceCode = sourceCode;
        this.trigger(this.model);
    },

    onSubmitWizardIncludeChildren: function(sourceCode){
        this.model.wizard = 'None';
        this.model.sourceCode = sourceCode;
        this.trigger(this.model);
    }
});

module.exports = FormCodeComponentEditorStore;

