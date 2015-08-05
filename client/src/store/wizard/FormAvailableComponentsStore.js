'use strict';

var _ = require('underscore');
var Reflux = require('reflux');
var FormAvailableComponentsActions = require('../../action/wizard/FormAvailableComponentsActions.js');

var defaultModel = {
    filter: ''
};

var FormAvailableComponentsStore = Reflux.createStore({

    listenables: FormAvailableComponentsActions,
    model: defaultModel,
    initialModel: _.clone(defaultModel),

    onSetFilter: function(filter){
        this.model.filter = filter;
        this.trigger(this.model);
    }


});

module.exports = FormAvailableComponentsStore;

