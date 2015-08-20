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
        if(options.pageName && validator.isAlphanumeric(options.pageName)){
            var firstChar = options.pageName.charAt(0).toUpperCase();
            var pageName = firstChar + options.pageName.substr(1);

            Repository.setCurrentPageName(pageName);

        } else {
            this.model.errors = ['Enter valid alphanumeric page name value'];
        }

        Repository.setCurrentPageTitle(options.pageTitle);

        if(options.propsScript){
            try{
                var metaInfo = JSON.parse(options.propsScript);
                if(_.isArray(metaInfo)){
                    Repository.setCurrentPageMetaInfo(metaInfo);
                } else {
                    this.model.errors.push('Meta info should be array of values.');
                }
            } catch(e){
                this.model.errors.push(e.message);
            }
        } else {
            Repository.setCurrentPageMetaInfo([]);
        }


        if(this.model.errors.length === 0){
            var projectModel = Repository.getCurrentProjectModel();
            Repository.renewCurrentProjectModel(projectModel);
            this.model.isModalOpen = false;
            ToolbarTopActions.refreshPageList();
        }
        this.trigger(this.model);

    }

});

module.exports = ModalPageInfoEditorStore;
