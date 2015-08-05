'use strict';

var Reflux = require('reflux');
var PopoverComponentVariantActions = require('../../action/element/PopoverComponentVariantActions.js');

var defaultModel = {
    isShown: false,
    scrollTop: 0
};

var getPageModelForDefaults = function(componentId, defaults){
    var templatePageModel = {
        pageName: 'TemplatePage',
        children:[
            {
                type: 'div',
                props: {
                    style: {
                        padding: '0.5em'
                    }
                },
                children:[]
            }
        ]
    };
    if(defaults){
        templatePageModel.children[0].children.push({
            type: componentId,
            props: defaults.props,
            children: defaults.children,
            text: defaults.text
        });
    }
    return templatePageModel;
};

var PopoverComponentVariantStore = Reflux.createStore({
    model: defaultModel,
    listenables: PopoverComponentVariantActions,

    onShow: function(options) {
        this.model.top = options.top;
        this.model.left = options.left;
        this.model.outerWidth = options.outerWidth;
        this.model.defaults = options.defaults;
        this.model.componentId = options.componentId;
        this.model.defaultsIndex = options.defaultsIndex;
        this.model.canDelete = options.canDelete;
        this.model.templatePageModel = getPageModelForDefaults(options.componentId, options.defaults);
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