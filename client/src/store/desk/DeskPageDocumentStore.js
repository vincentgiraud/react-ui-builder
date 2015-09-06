'use strict';

var Reflux = require('reflux');
var Repository = require('../../api/Repository.js');
var Server = require('../../api/Server.js');
var DeskPageDocumentActions = require('../../action/desk/DeskPageDocumentActions.js');

var defaultModel = {
    counter: 0
};

var DeskPageDocumentStore = Reflux.createStore({
    model: defaultModel,
    listenables: DeskPageDocumentActions,

    getInitialModel: function(){
        this.model.scrollToTop = false;
        this.model.document = Repository.getCurrentProjectDocument();
        this.model.errors = [];
        this.model.isModified = false;
        this.model.currentDocumentSectionName = 'overview';
        this.model.currentMarkdownSource = this.model.document.overview.markdown;
        return this.model;
    },

    onMarkdownChange: function(markdownSource){
        this.model.counter++;
        this.model.currentMarkdownSource = markdownSource;
        this.model.isModified = true;
        if(this.model.currentDocumentSectionName === 'overview'){
            this.model.document.overview.markdown = markdownSource;
        } else {
            this.model.document.components[this.model.currentDocumentSectionName].markdown
                = markdownSource;
        }
        this.model.scrollToTop = false;
        this.trigger(this.model);
    },

    onChangeSection: function(sectionName){
        this.model.currentDocumentSectionName = sectionName;
        if(this.model.currentDocumentSectionName === 'overview'){
            this.model.currentMarkdownSource = this.model.document.overview.markdown;
        } else {
            this.model.currentMarkdownSource =
                this.model.document.components[this.model.currentDocumentSectionName].markdown;
        }
        this.model.scrollToTop = true;
        this.trigger(this.model);
    },

    onSaveChanges: function(){
        this.model.scrollToTop = false;
        Server.invoke('writeProjectDocument', {projectDocument : this.model.document},
            function(err){
                this.model.errors.push(err);
                this.trigger(this.model);
            }.bind(this),
            function(response){
                this.model.isModified = false;
                this.trigger(this.model);
            }.bind(this)
        );
    }

});


module.exports = DeskPageDocumentStore;
