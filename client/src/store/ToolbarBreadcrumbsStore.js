'use strict';

var Reflux = require('reflux');
var ToolbarBreadcrumbsActions = require('../action/ToolbarBreadcrumbsActions.js');
var Repository = require('../api/Repository.js');

var defaultModel = {
    crumbs: [],
    active: 'Nothing is selected',
    activeChildren: []
};

var ToolbarBreadcrumbsStore = Reflux.createStore({
    listenables: ToolbarBreadcrumbsActions,
    model: defaultModel,

    getModel: function(){
        return this.model;
    },

    onSelectItem: function(modelNode){
        var crumbs = [];
        if(modelNode.parentList && modelNode.parentList.length > 0){
            modelNode.parentList.map(function(parent){
                if(parent && parent.type){
                    crumbs.push({
                        type: parent.type,
                        umyId: parent.props['data-umyid']
                    });
                }
            });
        }
        var activeChildren = [];
        if(modelNode.found.children && modelNode.found.children.length > 0){
            modelNode.found.children.map(function(child, index){
                activeChildren.push({
                    type: child.type,
                    umyId: child.props['data-umyid']
                })
            });
        }
        this.model.crumbs = crumbs;
        this.model.active = modelNode.found.type;
        this.model.activeChildren = activeChildren;
        this.trigger(this.model);
    },

    onDeselectItem: function(){
        this.model.crumbs = [];
        this.model.active = 'Nothing is selected';
        this.model.activeChildren = [];
        this.trigger(this.model);
    }


});

module.exports = ToolbarBreadcrumbsStore;
