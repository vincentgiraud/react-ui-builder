'use strict';

var _ = require('lodash');
var Repository = require('./Repository.js');
var Common = require('./Common.js');
var DeskAction = require('../action/desk/DeskActions.js');
var DeskPageFrameActions = require('../action/desk/DeskPageFrameActions.js');
var ModalQuickActionComponent = require('../action/modal/ModalQuickActionComponentActions.js');
var ModalComponentGeneratorActions = require('../action/modal/ModalComponentGeneratorActions.js');

var Overlays = {

    createComponentOverlay: function(frameWindow, domNodeId, modelNode){

        var shortLabel = modelNode.found.type || 'Unknown';

        var overlayModel = {
            pageFrameWindow: frameWindow,
            onClose: DeskPageFrameActions.deselectComponent,
            buttons: []
        };
        overlayModel.buttons.push(
            {
                label: '&lt;' + shortLabel + '&gt;&nbsp;&nbsp;',
                icon: 'umyproto-icon-caret-down',
                btnClass: 'umyproto-button-success',
                menu: [
                    {label: 'Add before component', onClick: function(){
                        ModalQuickActionComponent.show(
                            {selectedUmyId: domNodeId, command: 'addBefore', commandLabel: 'Add before component'}
                        );
                    }},
                    {label: 'Insert as first child', onClick: function(){
                        ModalQuickActionComponent.show(
                            {selectedUmyId: domNodeId, command: 'insertFirst', commandLabel: 'Insert as first child'}
                        );
                    }},
                    {label: 'Wrap component', onClick: function(){
                        ModalQuickActionComponent.show(
                            {selectedUmyId: domNodeId, command: 'wrap', commandLabel: 'Wrap component'}
                        );
                    }},
                    {label: 'Replace component', onClick: function(){
                        ModalQuickActionComponent.show(
                            {selectedUmyId: domNodeId, command: 'replace', commandLabel: 'Replace component'}
                        );
                    }},
                    {label: 'Insert as last child', onClick: function(){
                        ModalQuickActionComponent.show(
                            {selectedUmyId: domNodeId, command: 'insertLast', commandLabel: 'Insert as last child'}
                        );
                    }},
                    {label: 'Add after component', onClick: function(){
                        ModalQuickActionComponent.show(
                            {selectedUmyId: domNodeId, command: 'addAfter', commandLabel: 'Add after component'}
                        );
                    }},
                    {label: '_divider'},
                    {label: 'Generate source code', onClick: function(){
                        ModalComponentGeneratorActions.showModal({ selectedUmyId: domNodeId });
                    }}
                ]
            });
        overlayModel.buttons.push(
            {
                icon: "umyproto-icon-code",
                tooltip: 'Show component in page treeview',
                btnClass: 'umyproto-button-primary',
                onClick: (function (_nodeId) {
                    return function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        DeskAction.toggleComponentsHierarchy();
                        //DeskPageFrameActions.selectParentComponent(_nodeId);
                    }
                })(domNodeId)
            });
        if(modelNode.foundProp === '/!#child'){
            overlayModel.buttons.push(
                {
                    icon: 'umyproto-icon-arrow-up',
                    tooltip: 'Move component up',
                    btnClass: 'umyproto-button-primary',
                    onClick: (function (_nodeId) {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();

                            //DeskPageFrameActions.moveUpComponent(_nodeId);
                        }
                    })(domNodeId)
                });
            overlayModel.buttons.push(
                {
                    icon: 'umyproto-icon-arrow-down',
                    tooltip: 'Move component down',
                    btnClass: 'umyproto-button-primary',
                    onClick: (function (_nodeId) {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            DeskPageFrameActions.moveDownComponent(_nodeId);
                        }
                    })(domNodeId)
                });
        }
        overlayModel.buttons.push(
            {
                icon: 'umyproto-icon-cut',
                tooltip: 'Cut component into clipboard',
                btnClass: 'umyproto-button-primary',
                onClick: (function (_nodeId) {
                    return function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        DeskPageFrameActions.startCutPasteComponent(_nodeId);
                    }
                })(domNodeId)
            });
        overlayModel.buttons.push(
            {
                icon: 'umyproto-icon-clipboard',
                tooltip: 'Copy component into clipboard',
                btnClass: 'umyproto-button-primary',
                onClick: (function (_nodeId) {
                    return function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        DeskPageFrameActions.startCopyComponent(_nodeId);
                    }
                })(domNodeId)
            });
        overlayModel.buttons.push(
            {
                icon: 'umyproto-icon-copy',
                tooltip: 'Duplicate component',
                btnClass: 'umyproto-button-primary',
                onClick: (function (_nodeId) {
                    return function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        DeskPageFrameActions.duplicateComponent(_nodeId);
                    }
                })(domNodeId)
            });
        overlayModel.buttons.push(
            {
                icon: 'umyproto-icon-trash-o',
                tooltip: 'Remove component from page',
                btnClass: 'umyproto-button-primary',
                onClick: (function (_nodeId) {
                    return function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        DeskPageFrameActions.deleteComponent(_nodeId);
                    }
                })(domNodeId)
            });
        overlayModel.buttons.push(
            {
                icon: 'umyproto-icon-gears',
                tooltip: 'Show component options',
                btnClass: 'umyproto-button-primary',
                onClick: (function (_nodeId) {
                    return function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        DeskPageFrameActions.showPropertyEditor();
                    }
                })(domNodeId)
            });
        return $("<div></div>").umyComponentOverlay(overlayModel);
    },

    createCopyPasteOverlay: function(frameWindow, domNodeId, modelNode){

        var shortLabel = modelNode.found.type || 'Unknown';

        var overlayModel = {
            pageFrameWindow: frameWindow,
            onClose: DeskPageFrameActions.deselectComponent,
            buttons: [
                {
                    label: '&lt;' + shortLabel + '&gt;',
                    btnClass: 'umyproto-button-success',
                    onClick: (function (_nodeId) {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    })(domNodeId)
                },
                {
                    icon: "umyproto-icon-level-up",
                    tooltip: 'Select parent component',
                    btnClass: 'umyproto-button-primary',
                    onClick: (function (_nodeId) {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            DeskPageFrameActions.selectParentComponent(_nodeId);
                        }
                    })(domNodeId)
                },
                {
                    label: 'Before',
                    tooltip: 'Add component from clipboard before selected one',
                    btnClass: 'umyproto-button-primary',
                    onClick: (function (_nodeId) {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            DeskPageFrameActions.addBefore();
                        }
                    })(domNodeId)
                },
                {
                    label: 'First',
                    tooltip: 'Insert component from clipboard into selected one as the first child component',
                    btnClass: 'umyproto-button-primary',
                    onClick: (function (_nodeId) {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            DeskPageFrameActions.insertFirst();
                        }
                    })(domNodeId)
                },
                {
                    label: 'Wrap',
                    tooltip: 'Wrap selected component with component from clipboard',
                    btnClass: 'umyproto-button-primary',
                    onClick: (function (_nodeId) {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            DeskPageFrameActions.wrap();
                        }
                    })(domNodeId)
                },
                {
                    label: 'Replace',
                    tooltip: 'Replace selected component with component from clipboard',
                    btnClass: 'umyproto-button-primary',
                    onClick: (function (_nodeId) {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            DeskPageFrameActions.replace();
                        }
                    })(domNodeId)
                },
                {
                    label: 'Last',
                    tooltip: 'Insert component from clipboard into selected one as the last child component',
                    btnClass: 'umyproto-button-primary',
                    onClick: (function (_nodeId) {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            DeskPageFrameActions.insertLast();
                        }
                    })(domNodeId)
                },
                {
                    label: 'After',
                    tooltip: 'Add component from clipboard after selected one',
                    btnClass: 'umyproto-button-primary',
                    onClick: (function (_nodeId) {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            DeskPageFrameActions.addAfter();
                        }
                    })(domNodeId)
                },
                {
                    label: 'Cancel',
                    tooltip: 'Clear clipboard',
                    btnClass: 'umyproto-button-danger',
                    onClick: (function (_nodeId) {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            DeskPageFrameActions.stopClipboardForOptions();
                        }
                    })(domNodeId)
                }
            ]
        };
        return $("<div></div>").umyComponentOverlay(overlayModel);
    }

};

module.exports = Overlays;
