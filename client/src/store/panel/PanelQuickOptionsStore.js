'use strict';

var _ = require('lodash');
var Reflux = require('reflux');
var PanelQuickOptionsActions = require('../../action/panel/PanelQuickOptionsActions.js');
var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var Common = require('../../api/Common.js');
var Repository = require('../../api/Repository.js');

var defaultModel = {
    activeStylePanel: 0,
    activeStylePane: 1
};

var PanelQuickOptionsStore = Reflux.createStore({
    model: defaultModel,
    listenables: PanelQuickOptionsActions,

    onSetActiveLayout: function(options){
        this.model = _.extend(this.model, options);
    },

    onSelectItem: function(modelNode, selectedUmyId){
        this.model.selectedUmyId = selectedUmyId;
        this.model.props = modelNode.found.props;
        this.model.satinizedProps = _.extend({}, this.model.props);
        delete this.model.satinizedProps['data-umyid'];
        this.trigger(this.model);
    },

    onDeselectItem: function(){
        this.model.selectedUmyId = null;
        this.model.props = null;
        this.model.satinizedProps = null;
        this.trigger(this.model);
    },

    onChangeStyleOptions: function(newStyle){

        var projectModel = Repository.getCurrentProjectModel();
        var searchResult = null;
        for(var i = 0; i < projectModel.pages.length; i++){
            if(!searchResult){
                searchResult = Common.findByUmyId(projectModel.pages[i], this.model.selectedUmyId);
            }
        }
        if(searchResult){
            searchResult.found.props.style = searchResult.found.props.style || {};
            searchResult.found.props.style = _.extend(searchResult.found.props.style, newStyle);
            Repository.renewCurrentProjectModel(projectModel);
            DeskPageFrameActions.renderPageFrame();
        }
        //console.log(JSON.stringify(newStyle, null, 4));
    },

    onRemoveStyleOptions: function(removeStyle){
        var projectModel = Repository.getCurrentProjectModel();
        var searchResult = null;
        for(var i = 0; i < projectModel.pages.length; i++){
            if(!searchResult){
                searchResult = Common.findByUmyId(projectModel.pages[i], this.model.selectedUmyId);
            }
        }
        if(searchResult && searchResult.found.props.style){
            var newStyle = {};
            _.forOwn(searchResult.found.props.style, function(value, prop){
                if(removeStyle !== prop){
                    newStyle[prop] = value;
                }
            });
            searchResult.found.props.style = newStyle;
            Repository.renewCurrentProjectModel(projectModel);
            DeskPageFrameActions.renderPageFrame();
        }

    },

    onProbeAction: function() {
        this.trigger(this.model);
    }

});

module.exports = PanelQuickOptionsStore;