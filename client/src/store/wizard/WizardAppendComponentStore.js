'use strict';

var _ = require('underscore');
var validator = require('validator');
var Reflux = require('reflux');

var Server = require('../../api/Server.js');
var Repository = require('../../api/Repository.js');
var Common = require('../../api/Common.js');

var WizardAppendComponentActions = require('../../action/wizard/WizardVariantNameActions.js');

var defaultModel = {
    step: 0
};

var WizardAppendComponentStore = Reflux.createStore({
    listenables: WizardAppendComponentActions,

    getInitialModel: function(){
        this.model = _.clone(defaultModel);
        return this.model;
    },

    onCancelWizard: function(){

    },

    onSetInitialOptions: function(options){
        this.model.selectedUmyId = options.selectedUmyId;
    },

    onSubmitStep0: function(options){
        if(options.variantName){
            try{

                //var changedProps = JSON.parse(this.model.propsScript);
                //var projectModel = Repository.getCurrentProjectModel();
                //var searchResult = null;
                //for(var i = 0; i < projectModel.pages.length; i++){
                //    if(!searchResult){
                //        searchResult = Common.findByUmyId(projectModel.pages[i], this.model.selectedUmyId);
                //    }
                //}
                ////
                //var defaults = {
                //    variantName: options.variantName,
                //    type: searchResult.found.type,
                //    props: changedProps,
                //    children: searchResult.found.children,
                //    text: searchResult.found.text
                //};
                ////
                //Server.invoke('saveComponentDefaults',
                //    {
                //        componentName: searchResult.found.type,
                //        componentOptions: defaults
                //    },
                //    function(err){
                //        this.model.errors = [JSON.stringify(err)];
                //        this.trigger(this.model);
                //    }.bind(this),
                //    function(response){
                //        this.trigger(this.model);
                //    }.bind(this)
                //);
                //
            } catch(e) {
                this.model.errors = [e.message];
                this.trigger(this.model);
            }
        }

    }

});

module.exports = WizardAppendComponentStore;

