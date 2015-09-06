'use strict';

var _ = require('lodash');
var Reflux = require('reflux');
var PanelOptionsActions = require('../../action/panel/PanelOptionsActions.js');
var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var Common = require('../../api/Common.js');
var Repository = require('../../api/Repository.js');

var defaultModel = {
};

var PanelOptionsStore = Reflux.createStore({
    model: defaultModel,
    listenables: PanelOptionsActions,

    onSelectItem: function(modelNode, selectedUmyId){
        this.model.selectedUmyId = selectedUmyId;
        this.model.props = modelNode.found.props;
        var temp = {
            props: this.model.props
        };
        Common.cleanPropsUmyId(temp);
        this.model.satinizedProps = temp.props;
        this.trigger(this.model);
    },

    onDeselectItem: function(){
        this.model.selectedUmyId = null;
        this.model.props = null;
        this.model.satinizedProps = null;
        this.trigger(this.model);
    },

    onChangeOptions: function(options){

        var projectModel = Repository.getCurrentProjectModel();
        var searchResult = null;
        for(var i = 0; i < projectModel.pages.length; i++){
            if(!searchResult){
                searchResult = Common.findByUmyId(projectModel.pages[i], this.model.selectedUmyId);
            }
        }
        if(searchResult){
            searchResult.found.props = searchResult.found.props || {};
            searchResult.found.props = _.merge({}, searchResult.found.props, options);
            Repository.renewCurrentProjectModel(projectModel);
            DeskPageFrameActions.renderPageFrame();
        }
        //console.log(JSON.stringify(newStyle, null, 4));
    },

    onDeleteOptions: function(options){
        var projectModel = Repository.getCurrentProjectModel();
        var searchResult = null;
        for(var i = 0; i < projectModel.pages.length; i++){
            if(!searchResult){
                searchResult = Common.findByUmyId(projectModel.pages[i], this.model.selectedUmyId);
            }
        }
        if(searchResult){
            searchResult.found.props = searchResult.found.props || {};
            searchResult.found.props = Common.cleanex(Common.delex(searchResult.found.props, options.path));
            Repository.renewCurrentProjectModel(projectModel);
            DeskPageFrameActions.renderPageFrame();
        }
    },

    onSetFocusTo: function(options){
        this.model.focusedElementId = options.elementId;
    }


});

module.exports = PanelOptionsStore;