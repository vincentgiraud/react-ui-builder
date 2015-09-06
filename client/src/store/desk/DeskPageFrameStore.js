'use strict';

var _ = require('lodash');

var Common = require('../../api/Common.js');
var Server = require('../../api/Server.js');
var Overlays = require('../../api/Overlays.js');
var Reflux = require('reflux');
var ApplicationActions = require('../../action/application/ApplicationActions.js');
var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var DeskActions = require('../../action/desk/DeskActions.js');
var PanelComponentsHierarchyActions = require('../../action/panel/PanelComponentsHierarchyActions.js');
var Repository = require('../../api/Repository.js');
var DeskStore = require('./DeskStore.js');
var PanelAvailableComponentsStore = require('../panel/PanelAvailableComponentsStore.js');
var PanelAvailableComponentsActions = require('../../action/panel/PanelAvailableComponentsActions.js');
var ModalComponentEditorActions = require('../../action/modal/ModalComponentEditorActions.js');
var ToolbarTopActions = require('../../action/toolbar/ToolbarTopActions.js');
var ToolbarBreadcrumbsActions = require('../../action/toolbar/ToolbarBreadcrumbsActions.js');
var PanelOptionsActions = require('../../action/panel/PanelOptionsActions.js');
//var PanelQuickOptionsActions = require('../../action/panel/PanelQuickOptionsActions.js');

var componentOverlay = null;
var umyIdToCutPaste = null;
var umyIdToCopy = null;
var optionsToPaste = null;

var DeskPageFrameStore = Reflux.createStore({
    listenables: DeskPageFrameActions,
    model: {},

    onRenderPageFrame: function(selectedUmyId){
        //this.onStopClipboardForOptions();
        if(selectedUmyId){
            this.model.selectedUmyId = selectedUmyId;
        }
        this.trigger();
    },

    onReloadPageFrame: function(){
        //this.onStopClipboardForOptions();
        this.trigger({
            src: Repository.getHtmlForDesk()
        });
    },

    onDidRenderPageFrame: function(){
        // Load all components defaults

        // workaround for not proper iframe page rerendering
        var window = Repository.getCurrentPageDocument();
        $(window).find('.umy-grid-basic-border-copy').removeClass('umy-grid-basic-border-copy');
        $(window).find('.umy-grid-basic-border-cut').removeClass('umy-grid-basic-border-cut');
        window = null;
        //
        if(umyIdToCopy){
            var domNodeInCopyClipboard = Repository.getCurrentPageDomNode(umyIdToCopy);
            if(domNodeInCopyClipboard && domNodeInCopyClipboard.domElement){
                $(domNodeInCopyClipboard.domElement).addClass('umy-grid-basic-border-copy');
                domNodeInCopyClipboard = null;
            }
        }
        if(umyIdToCutPaste){
            var domNodeInCutClipboard = Repository.getCurrentPageDomNode(umyIdToCutPaste);
            if(domNodeInCutClipboard && domNodeInCutClipboard.domElement){
                $(domNodeInCutClipboard.domElement).addClass('umy-grid-basic-border-cut');
                domNodeInCutClipboard = null;
            }
        }
        PanelComponentsHierarchyActions.refreshTreeview();
        this.onSelectComponentById();
    },

    onSelectComponentById: function(domNodeId){

        // try to select previously selected domNode
        this.model.selectedUmyId = domNodeId || this.model.selectedUmyId;

        if(this.model.selectedUmyId){
            var searchResult = Repository.findInCurrentPageModelByUmyId(this.model.selectedUmyId);
            var frameWindow = Repository.getCurrentPageWindow();
            var domNode = Repository.getCurrentPageDomNode(this.model.selectedUmyId);
            if(frameWindow && domNode && searchResult){
                if(domNode.domElement){
                    if(this.model.clipboardActiveMode){
                        componentOverlay = Overlays.createCopyPasteOverlay(frameWindow, this.model.selectedUmyId, searchResult);
                    } else {
                        componentOverlay = Overlays.createComponentOverlay(frameWindow, this.model.selectedUmyId, searchResult);
                    }
                    componentOverlay.append(domNode.domElement);
                }
                ToolbarBreadcrumbsActions.selectItem(searchResult);
                PanelOptionsActions.selectItem(searchResult, this.model.selectedUmyId);
                PanelComponentsHierarchyActions.selectTreeviewItem(this.model.selectedUmyId, this.model.clipboardActiveMode);
            }
        }
    },

    onSelectParentComponent: function(domNodeId){
        var searchResult = Repository.findInCurrentPageModelByUmyId(domNodeId);
        if(searchResult && searchResult.parent && searchResult.parent.props){
            this.onDeselectComponent();
            this.onSelectComponentById(searchResult.parent.props['data-umyid']);
        }
    },

    onDeselectComponent: function(){
        //this.model.selectedUmyId = null;
        if(componentOverlay){
            componentOverlay.destroy();
            componentOverlay = null;
        }
        PanelComponentsHierarchyActions.deselectTreeviewItem();
        ToolbarBreadcrumbsActions.deselectItem();
        PanelOptionsActions.deselectItem();
    },

    onStartClipboardForOptions: function(options){
        //
        this.onDeselectComponent();
        PanelComponentsHierarchyActions.removeCopyMark();
        PanelComponentsHierarchyActions.removeCutMark();
        //
        if(umyIdToCopy){
            var domNodeInCopyClipboard = Repository.getCurrentPageDomNode(umyIdToCopy);
            if(domNodeInCopyClipboard && domNodeInCopyClipboard.domElement){
                $(domNodeInCopyClipboard.domElement).removeClass('umy-grid-basic-border-copy');
                domNodeInCopyClipboard = null;
            }
        }
        if(umyIdToCutPaste){
            var domNodeInCutClipboard = Repository.getCurrentPageDomNode(umyIdToCutPaste);
            if(domNodeInCutClipboard && domNodeInCutClipboard.domElement){
                $(domNodeInCutClipboard.domElement).removeClass('umy-grid-basic-border-cut');
                domNodeInCutClipboard = null;
            }
        }
        //
        this.model.clipboardActiveMode = true;
        var shortLabel = 'Unknown';

        umyIdToCopy = options.umyIdToCopy;
        umyIdToCutPaste = options.umyIdToCutPaste;
        optionsToPaste = options.options;

        if(optionsToPaste){
            if(optionsToPaste.type){
                shortLabel = optionsToPaste.type;
            }
        } else {
            if(umyIdToCopy || umyIdToCutPaste){
                var umyId = umyIdToCopy ? umyIdToCopy : umyIdToCutPaste;
                var searchResult = Repository.findInCurrentPageModelByUmyId(umyId);
                if(searchResult){
                    if(searchResult){
                        shortLabel = searchResult.found.type;
                    }
                }
            }
        }
        ToolbarTopActions.startAddNewComponentMode(shortLabel);
    },

    onStopClipboardForOptions: function(){
        this.model.clipboardActiveMode = false;
        this.onDeselectComponent();
        PanelAvailableComponentsActions.deselectComponentItem();
        PanelComponentsHierarchyActions.removeCopyMark();
        PanelComponentsHierarchyActions.removeCutMark();
        ToolbarTopActions.stopAddNewComponentMode();
        //
        if(umyIdToCopy){
            var domNodeInCopyClipboard = Repository.getCurrentPageDomNode(umyIdToCopy);
            if(domNodeInCopyClipboard && domNodeInCopyClipboard.domElement){
                $(domNodeInCopyClipboard.domElement).removeClass('umy-grid-basic-border-copy');
                domNodeInCopyClipboard = null;
            }
        }
        umyIdToCopy = null;
        if(umyIdToCutPaste){
            var domNodeInCutClipboard = Repository.getCurrentPageDomNode(umyIdToCutPaste);
            if(domNodeInCutClipboard && domNodeInCutClipboard.domElement){
                $(domNodeInCutClipboard.domElement).removeClass('umy-grid-basic-border-cut');
                domNodeInCutClipboard = null;
            }
        }
        umyIdToCutPaste = null;
        optionsToPaste = null;
    },

    onDeleteComponent: function(domNodeId){

        Repository.renewCurrentProjectModel(
            Common.deleteFromModel(Repository.getCurrentProjectModel(), domNodeId)
        );
        PanelComponentsHierarchyActions.refreshTreeview();
        this.model.selectedUmyId = null;
        this.trigger();

    },

    onDuplicateComponent: function(domNodeId){
        var transformationResult = Common.pasteInModelFromUmyId(
            domNodeId,
            domNodeId,
            Repository.getCurrentProjectModel(),
            'addAfter'
        );
        Repository.renewCurrentProjectModel(transformationResult.projectModel);
        this.model.selectedUmyId = transformationResult.selectedUmyId;
        this.trigger();
    },

    onMoveUpComponent: function(domNodeId){
        Repository.renewCurrentProjectModel(
            Common.moveUpInModel(Repository.getCurrentProjectModel(), domNodeId)
        );
        PanelComponentsHierarchyActions.refreshTreeview();
        this.trigger();
    },

    onMoveDownComponent: function(domNodeId){
        Repository.renewCurrentProjectModel(
            Common.moveDownInModel(Repository.getCurrentProjectModel(), domNodeId)
        );
        PanelComponentsHierarchyActions.refreshTreeview();
        this.trigger();
    },

    onStartCopyComponent: function(domNodeId){
        var domNode = Repository.getCurrentPageDomNode(domNodeId);
        if(domNode && domNode.domElement){
            $(domNode.domElement).addClass('umy-grid-basic-border-copy');
        }
        this.onStartClipboardForOptions({
            umyIdToCopy: domNodeId
        });
        PanelComponentsHierarchyActions.setCopyMark(domNodeId);
    },

    onStartCutPasteComponent: function(domNodeId){
        var domNode = Repository.getCurrentPageDomNode(domNodeId);
        if(domNode && domNode.domElement){
            $(domNode.domElement).addClass('umy-grid-basic-border-cut');
        }
        this.onStartClipboardForOptions({
            umyIdToCutPaste: domNodeId
        });
        PanelComponentsHierarchyActions.setCutMark(domNodeId);
    },

    onAddBefore: function(){
        var transformationResult = null;
        if(umyIdToCutPaste){
            Repository.renewCurrentProjectModel(
                Common.moveInModel(
                    umyIdToCutPaste,
                    this.model.selectedUmyId,
                    Repository.getCurrentProjectModel(),
                    'addBefore'
                )
            );
            this.model.selectedUmyId = umyIdToCutPaste;
        } else if(optionsToPaste) {
            transformationResult = Common.pasteInModelFromClipboard(
                optionsToPaste,
                this.model.selectedUmyId,
                Repository.getCurrentProjectModel(),
                'addBefore'
            );
            Repository.renewCurrentProjectModel(transformationResult.projectModel);
            this.model.selectedUmyId = transformationResult.selectedUmyId;
        } else {
            transformationResult = Common.pasteInModelFromUmyId(
                umyIdToCopy,
                this.model.selectedUmyId,
                Repository.getCurrentProjectModel(),
                'addBefore'
            );
            Repository.renewCurrentProjectModel(transformationResult.projectModel);
            this.model.selectedUmyId = transformationResult.selectedUmyId;
        }
        this.onStopClipboardForOptions();
        this.trigger();
    },

    onInsertFirst: function(){
        var transformationResult = null;
        if (umyIdToCutPaste) {
            Repository.renewCurrentProjectModel(
                Common.moveInModel(
                    umyIdToCutPaste,
                    this.model.selectedUmyId,
                    Repository.getCurrentProjectModel(),
                    'insertFirst'
                )
            );
            this.model.selectedUmyId = umyIdToCutPaste;
        } else if(optionsToPaste) {
            transformationResult = Common.pasteInModelFromClipboard(
                optionsToPaste,
                this.model.selectedUmyId,
                Repository.getCurrentProjectModel(),
                'insertFirst'
            );
            Repository.renewCurrentProjectModel(transformationResult.projectModel);
            this.model.selectedUmyId = transformationResult.selectedUmyId;
        } else {
            transformationResult = Common.pasteInModelFromUmyId(
                umyIdToCopy,
                this.model.selectedUmyId,
                Repository.getCurrentProjectModel(),
                'insertFirst'
            );
            Repository.renewCurrentProjectModel(transformationResult.projectModel);
            this.model.selectedUmyId = transformationResult.selectedUmyId;
        }
        this.onStopClipboardForOptions();
        this.trigger();
    },

    onInsertLast: function(){
        var transformationResult = null;
        if (umyIdToCutPaste) {
            Repository.renewCurrentProjectModel(
                Common.moveInModel(
                    umyIdToCutPaste,
                    this.model.selectedUmyId,
                    Repository.getCurrentProjectModel(),
                    'insertLast'
                )
            );
            this.model.selectedUmyId = umyIdToCutPaste;
        } else if(optionsToPaste) {
            transformationResult = Common.pasteInModelFromClipboard(
                optionsToPaste,
                this.model.selectedUmyId,
                Repository.getCurrentProjectModel(),
                'insertLast'
            );
            Repository.renewCurrentProjectModel(transformationResult.projectModel);
            this.model.selectedUmyId = transformationResult.selectedUmyId;
        } else {
            transformationResult = Common.pasteInModelFromUmyId(
                umyIdToCopy,
                this.model.selectedUmyId,
                Repository.getCurrentProjectModel(),
                'insertLast'
            );
            Repository.renewCurrentProjectModel(transformationResult.projectModel);
            this.model.selectedUmyId = transformationResult.selectedUmyId;
        }
        this.onStopClipboardForOptions();
        this.trigger();
    },

    onAddAfter: function(){
        var transformationResult = null;
        if (umyIdToCutPaste) {
            Repository.renewCurrentProjectModel(
                Common.moveInModel(
                    umyIdToCutPaste,
                    this.model.selectedUmyId,
                    Repository.getCurrentProjectModel(),
                    'addAfter'
                )
            );
            this.model.selectedUmyId = umyIdToCutPaste;
        } else if(optionsToPaste) {
            transformationResult = Common.pasteInModelFromClipboard(
                optionsToPaste,
                this.model.selectedUmyId,
                Repository.getCurrentProjectModel(),
                'addAfter'
            );
            Repository.renewCurrentProjectModel(transformationResult.projectModel);
            this.model.selectedUmyId = transformationResult.selectedUmyId;
        } else {
            transformationResult = Common.pasteInModelFromUmyId(
                umyIdToCopy,
                this.model.selectedUmyId,
                Repository.getCurrentProjectModel(),
                'addAfter'
            );
            Repository.renewCurrentProjectModel(transformationResult.projectModel);
            this.model.selectedUmyId = transformationResult.selectedUmyId;
        }
        this.onStopClipboardForOptions();
        this.trigger();
    },

    onWrap: function(){
        var transformationResult = null;
        if (umyIdToCutPaste) {
            Repository.renewCurrentProjectModel(
                Common.moveInModel(
                    umyIdToCutPaste,
                    this.model.selectedUmyId,
                    Repository.getCurrentProjectModel(),
                    'wrap'
                )
            );
            this.model.selectedUmyId = umyIdToCutPaste;
        } else if(optionsToPaste) {
            transformationResult = Common.pasteInModelFromClipboard(
                optionsToPaste,
                this.model.selectedUmyId,
                Repository.getCurrentProjectModel(),
                'wrap'
            );
            Repository.renewCurrentProjectModel(transformationResult.projectModel);
            this.model.selectedUmyId = transformationResult.selectedUmyId;
        } else {
            transformationResult = Common.pasteInModelFromUmyId(
                umyIdToCopy,
                this.model.selectedUmyId,
                Repository.getCurrentProjectModel(),
                'wrap'
            );
            Repository.renewCurrentProjectModel(transformationResult.projectModel);
            this.model.selectedUmyId = transformationResult.selectedUmyId;
        }
        this.onStopClipboardForOptions();
        this.trigger();
    },

    onReplace: function(){
        var transformationResult = null;
        if (umyIdToCutPaste) {
            Repository.renewCurrentProjectModel(
                Common.moveInModel(
                    umyIdToCutPaste,
                    this.model.selectedUmyId,
                    Repository.getCurrentProjectModel(),
                    'replace'
                )
            );
            this.model.selectedUmyId = umyIdToCutPaste;
        } else if(optionsToPaste) {
            transformationResult = Common.pasteInModelFromClipboard(
                optionsToPaste,
                this.model.selectedUmyId,
                Repository.getCurrentProjectModel(),
                'replace'
            );
            Repository.renewCurrentProjectModel(transformationResult.projectModel);
            this.model.selectedUmyId = transformationResult.selectedUmyId;
        } else {
            transformationResult = Common.pasteInModelFromUmyId(
                umyIdToCopy,
                this.model.selectedUmyId,
                Repository.getCurrentProjectModel(),
                'replace'
            );
            Repository.renewCurrentProjectModel(transformationResult.projectModel);
            this.model.selectedUmyId = transformationResult.selectedUmyId;
        }
        this.onStopClipboardForOptions();
        this.trigger();
    },

    onShowPropertyEditor: function(){
        ModalComponentEditorActions.showModal({
            selectedUmyId: this.model.selectedUmyId
        });
    }

});

module.exports = DeskPageFrameStore;
