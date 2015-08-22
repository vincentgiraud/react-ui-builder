'use strict';

var Reflux = require('reflux');
var esprima = require('esprima-fb');
var validator = require('validator');

var Server = require('../../api/Server.js');
var Repository = require('../../api/Repository.js');
var Common = require('../../api/Common.js');
var ToolbarTopActions = require('../../action/toolbar/ToolbarTopActions.js');
var ModalPageInfoEditorActions = require('../../action/modal/ModalPageInfoEditorActions.js');

var defaultModel = {
    isModalOpen: false
};

var ModalPageInfoEditorStore = Reflux.createStore({
    model: defaultModel,
    listenables: ModalPageInfoEditorActions,

    onShowModal: function(){
        if(!this.model.isModalOpen){

            this.model.isModalOpen = true;
            this.model.pageName = Repository.getCurrentPageName();
            this.model.pageTitle = Repository.getCurrentPageTitle();
            this.model.propsScript = JSON.stringify(Repository.getCurrentPageMetaInfo(), null, '\t');

            this.model.documentMarkdown = '#### Meta info\n\nMeta info is an array of values.\n\n ' +
                '**Example:**\n\n ```\n[\n\t{ name: \'some name\', property: \'some property value\'},\n\t' +
                '{ name: \'some name\', property: \'some property value\'}\n]\n```\n';

            this.trigger(this.model);

        }
    },

    onHideModal: function(){
        if(this.model.isModalOpen){
            this.model.isModalOpen = false;
            this.trigger(this.model);
        }
    },

    onToggleModal: function(){
        this.model.isModalOpen = !this.model.isModalOpen;
        this.trigger(this.model);
    },

    onSaveProperties: function(options){

        this.model.errors = [];
        var pageName = null;
        if(!options.pageName || !validator.isAlphanumeric(options.pageName)){
            this.model.errors.push('Enter valid alphanumeric page name value');
        } else {
            var firstChar = options.pageName.charAt(0).toUpperCase();
            pageName = firstChar + options.pageName.substr(1);

            var testComponent = Repository.getComponentFromTree(pageName);
            if(testComponent.value){
                this.model.errors.push('Entered name is equal to the name of the existing component.');
            }
        }

        var pageNames = Repository.getCurrentProjectPageNames();
        var currentPageIndex = Repository.getCurrentPageIndex();
        pageNames.map(function(page, index){
            if(page === pageName && index !== currentPageIndex){
                this.model.errors.push('Entered name is equal to the name of the existing page.');
            }
        }.bind(this));

        var metaInfo = [];
        if(options.propsScript){
            try{
                metaInfo = JSON.parse(options.propsScript);
                if(!_.isArray(metaInfo)){
                    this.model.errors.push('Meta info should be an array of values.');
                }
            } catch(e){
                this.model.errors.push(e.message);
            }
        }


        if(this.model.errors.length === 0){
            Repository.setCurrentPageName(pageName);
            Repository.setCurrentPageTitle(options.pageTitle);
            Repository.setCurrentPageMetaInfo(metaInfo);

            var projectModel = Repository.getCurrentProjectModel();
            Repository.renewCurrentProjectModel(projectModel);
            this.model.isModalOpen = false;
            ToolbarTopActions.refreshPageList();
            this.trigger(this.model);
        } else {
            this.trigger(this.model);
        }

    }

});

module.exports = ModalPageInfoEditorStore;
