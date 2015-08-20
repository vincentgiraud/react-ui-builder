'use strict';

var _ = require('lodash');
var Reflux = require('reflux');
var PanelPagesActions = require('../../action/panel/PanelPagesActions.js');
var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var Common = require('../../api/Common.js');
var Repository = require('../../api/Repository.js');

var defaultModel = {
    activePageIndex: 0
};

var PanelPagesStore = Reflux.createStore({
    model: defaultModel,
    listenables: PanelPagesActions,

    onSetActivePage: function(options){
        //this.model = _.extend(this.model, options);
        Repository.setCurrentPageModelByIndex(parseInt(options.index));
        this.onRefreshPageList();
        DeskPageFrameActions.renderPageFrame();
        //this.trigger(this.model);
    },

    onRefreshPageList: function(){
        var pageNames = Repository.getCurrentProjectPageNames();

        this.model.currentPageName = Repository.getCurrentPageName();
        this.model.activePageIndex = Repository.getCurrentPageIndex();
        this.model.pages = [];
        _.forEach(pageNames, (function(page, pageIndex){
            //if(page !== this.model.currentPageName){
            this.model.pages.push(
                {
                    pageName: page,
                    pageIndex: pageIndex
                });
            //}
        }).bind(this));

        this.trigger(this.model);
    },

});

module.exports = PanelPagesStore;