'use strict';

var Reflux = require('reflux');
var DeskActions = require('../../action/desk/DeskActions.js');

var defaultModel = {
    isToolbarLeftShown: true,
    isToolbarTopShown: true,

    isAvailableComponentsButtonActive: false,
    isComponentOptionsButtonActive: false,
    isStyleOptionsButtonActive: false,
    isComponentsHierarchyButtonActive: false,

    isEditMode: true,
    isLivePreviewMode: false,
    isDocumentMode: false,

    iframeWidth: '100%'
    //iframeWidth: '340'

};

var DeskStore = Reflux.createStore({
    model: defaultModel,
    listenables: DeskActions,

    onStartEditMode: function(){
        if(!this.model.isEditMode){
            this.model.isEditMode = true;
            this.model.isLivePreviewMode = false;
            this.model.isDocumentMode = false;
            this.trigger(this.model);
        }
    },
    onStartDocumentMode: function(){
        if(!this.model.isDocumentMode){
            this.model.isEditMode = false;
            this.model.isLivePreviewMode = false;
            this.model.isDocumentMode = true;
            //
            this.model.isAvailableComponentsButtonActive = false;
            this.model.isComponentOptionsButtonActive = false;
            this.model.isStyleOptionsButtonActive = false;
            this.model.isComponentsHierarchyButtonActive = false;
            //
            this.trigger(this.model);
        }
    },
    onStartLivePreviewMode: function(){
        if(!this.model.isLivePreviewMode){
            this.model.isEditMode = false;
            this.model.isLivePreviewMode = true;
            this.model.isDocumentMode = false;
            //
            this.model.isAvailableComponentsButtonActive = false;
            this.model.isComponentOptionsButtonActive = false;
            this.model.isStyleOptionsButtonActive = false;
            this.model.isComponentsHierarchyButtonActive = false;
            //
            this.trigger(this.model);
        }
    },
    onToggleAvailableComponents: function(){
        this.model.isAvailableComponentsButtonActive = !this.model.isAvailableComponentsButtonActive;
        this.trigger(this.model);
    },
    onToggleStyleOptions: function(){
        this.model.isStyleOptionsButtonActive = !this.model.isStyleOptionsButtonActive;
        this.trigger(this.model);
    },
    onToggleComponentsHierarchy: function(){
        this.model.isComponentsHierarchyButtonActive = !this.model.isComponentsHierarchyButtonActive;
        this.trigger(this.model);
    },
    onChangeIframeWidth: function(options){
        this.model.iframeWidth = options.iframeWidth;
        this.trigger(this.model);
    }


});


module.exports = DeskStore;
