'use strict';

var Reflux = require('reflux');
var PopoverComponentVariantActions = require('../../action/element/PopoverComponentVariantActions.js');

var defaultModel = {
    isShown: false,
    scrollTop: 0
};

var PopoverComponentVariantStore = Reflux.createStore({
    model: defaultModel,
    listenables: PopoverComponentVariantActions,

    onShow: function(options) {
        this.model.top = options.top;
        this.model.left = options.left;
        this.model.outerWidth = options.outerWidth;
        this.model.isShown = true;
        this.trigger(this.model);
    },

    onHide: function(){
        this.model.isShown = false;
        this.trigger(this.model);
    },

    onSetupScrollTop: function(options){
        this.model.scrollTop = parseInt(options.scrollTop);
    },

    onScroll: function(options){
        this.model.top = this.model.top || 0;
        this.model.top = this.model.top + (this.model.scrollTop - parseInt(options.scrollTop));
        this.model.scrollTop = options.scrollTop;
        this.trigger(this.model);
    }

});

module.exports = PopoverComponentVariantStore;