'use strict';

var React = require('react');
var OverlayButtons = require('./OverlayButtons.js');
var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var Repository = require('../../api/Repository.js');
var Common = require('../../api/Common.js');
var ModalComponentEditorActions = require('../../action/modal/ModalComponentEditorActions.js');
//var ModalQuickActionComponent = require('../../action/modal/ModalQuickActionComponentActions.js');
var ModalComponentGeneratorActions = require('../../action/modal/ModalComponentGeneratorActions.js');
var PanelAvailableComponentsActions = require('../../action/panel/PanelAvailableComponentsActions.js');

var SelectComponentName = require('../element/SelectComponentName.js');

var OverlayTreeviewItem = React.createClass({

    getInitialState: function(){
        return {
            quickAppend: false
        }
    },

    componentDidMount: function(){

    },

    componentDidUpdate: function(){

    },

    handleCloseQuickAppend: function(){
        this.setState({
            quickAppend: false,
            command: null,
            umyid: null
        });
    },

    handleSubmitQuickAppend: function(value){
        PanelAvailableComponentsActions.quickAppend(
            { componentId: value }, this.state.command, this.state.umyid
        );
    },

    render: function(){

        if(this.state.quickAppend){

            var containerStyle = {
                position: 'absolute',
                left: '4em',
                right: '4em',
                top: '2px',
                zIndex: 1030
            };

            return (
                <div style={containerStyle}>
                    <div style={{display: 'table', width: '100%'}}>
                        <div style={{display: 'table-row', width: '100%', whiteSpace: 'nowrap'}}>
                            <div style={{display: 'table-cell', textAlign: 'center', width: '100%'}}>
                                <SelectComponentName
                                    style={{display: 'inline-block', textAlign: 'left', width: '300px'}}
                                    onClose={ this.handleCloseQuickAppend }
                                    onChangeValue={ this.handleSubmitQuickAppend }/>
                            </div>
                        </div>
                    </div>
                </div>
            );

        } else {

            var domNodeId = this.props.domNodeId;
            var searchResult = Repository.findInCurrentPageModelByUmyId(domNodeId);

            var overlayModel = {
                onClose: DeskPageFrameActions.deselectComponent,
                buttons: []
            };

            //overlayModel.buttons.push(
            //    {
            //        label: searchResult.found.type,
            //        btnClass: 'btn-success',
            //        menu: [
            //            {label: 'Add before component', onClick: function(){
            //                ModalQuickActionComponent.show(
            //                    {selectedUmyId: domNodeId, command: 'addBefore', commandLabel: 'Add before component'}
            //                );
            //            }},
            //            {label: 'Insert as first child', onClick: function(){
            //                ModalQuickActionComponent.show(
            //                    {selectedUmyId: domNodeId, command: 'insertFirst', commandLabel: 'Insert as first child'}
            //                );
            //            }},
            //            {label: 'Wrap component', onClick: function(){
            //                ModalQuickActionComponent.show(
            //                    {selectedUmyId: domNodeId, command: 'wrap', commandLabel: 'Wrap component'}
            //                );
            //            }},
            //            {label: 'Replace component', onClick: function(){
            //                ModalQuickActionComponent.show(
            //                    {selectedUmyId: domNodeId, command: 'replace', commandLabel: 'Replace component'}
            //                );
            //            }},
            //            {label: 'Insert as last child', onClick: function(){
            //                ModalQuickActionComponent.show(
            //                    {selectedUmyId: domNodeId, command: 'insertLast', commandLabel: 'Insert as last child'}
            //                );
            //            }},
            //            {label: 'Add after component', onClick: function(){
            //                ModalQuickActionComponent.show(
            //                    {selectedUmyId: domNodeId, command: 'addAfter', commandLabel: 'Add after component'}
            //                );
            //            }},
            //            {label: '_divider'},
            //            {label: 'Generate source code', onClick: function(){
            //                ModalComponentGeneratorActions.showModal({ selectedUmyId: domNodeId });
            //            }}
            //        ]
            //    });

            //overlayModel.buttons.push(
            //    {
            //        icon: "fa-code",
            //        btnClass: 'btn-primary',
            //        onClick: (function (_nodeId) {
            //            return function (e) {
            //                e.preventDefault();
            //                e.stopPropagation();
            //                DeskPageFrameActions.selectParentComponent(_nodeId);
            //            }
            //        })(domNodeId)
            //    });
            if(searchResult.foundProp === '/!#child') {

                overlayModel.buttons.push(
                    {
                        label: 'Before',
                        btnClass: 'btn-primary',
                        onClick: (function (_nodeId, _this) {
                            return function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                _this.setState({
                                    quickAppend: true,
                                    umyid: _nodeId,
                                    command: 'addBefore'
                                });
                            }
                        })(domNodeId, this)
                    });
                overlayModel.buttons.push(
                    {
                        label: 'First',
                        btnClass: 'btn-primary',
                        onClick: (function (_nodeId, _this) {
                            return function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                _this.setState({
                                    quickAppend: true,
                                    umyid: _nodeId,
                                    command: 'insertFirst'
                                });
                            }
                        })(domNodeId, this)
                    });
                overlayModel.buttons.push(
                    {
                        label: 'Replace',
                        btnClass: 'btn-primary',
                        onClick: (function (_nodeId, _this) {
                            return function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                _this.setState({
                                    quickAppend: true,
                                    umyid: _nodeId,
                                    command: 'replace'
                                });
                            }
                        })(domNodeId, this)
                    });
                overlayModel.buttons.push(
                    {
                        label: 'Wrap',
                        btnClass: 'btn-primary',
                        onClick: (function (_nodeId, _this) {
                            return function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                _this.setState({
                                    quickAppend: true,
                                    umyid: _nodeId,
                                    command: 'wrap'
                                });
                            }
                        })(domNodeId, this)
                    });
                overlayModel.buttons.push(
                    {
                        label: 'Last',
                        btnClass: 'btn-primary',
                        onClick: (function (_nodeId, _this) {
                            return function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                _this.setState({
                                    quickAppend: true,
                                    umyid: _nodeId,
                                    command: 'insertLast'
                                });
                            }
                        })(domNodeId, this)
                    });
                overlayModel.buttons.push(
                    {
                        label: 'After',
                        btnClass: 'btn-primary',
                        onClick: (function (_nodeId, _this) {
                            return function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                _this.setState({
                                    quickAppend: true,
                                    umyid: _nodeId,
                                    command: 'addAfter'
                                });
                            }
                        })(domNodeId, this)
                    });
                overlayModel.buttons.push(
                    {
                        icon: 'fa-arrow-up',
                        btnClass: 'btn-primary',
                        onClick: (function (_nodeId) {
                            return function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                DeskPageFrameActions.moveUpComponent(_nodeId);
                            }
                        })(domNodeId)
                    });
                overlayModel.buttons.push(
                    {
                        icon: 'fa-arrow-down',
                        btnClass: 'btn-primary',
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
                    icon: 'fa-cut',
                    btnClass: 'btn-primary',
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
                    icon: 'fa-clipboard',
                    btnClass: 'btn-primary',
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
                    icon: 'fa-copy',
                    btnClass: 'btn-primary',
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
                    icon: 'fa-trash-o',
                    btnClass: 'btn-primary',
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
                    icon: 'fa-gears',
                    btnClass: 'btn-primary',
                    onClick: (function (_nodeId) {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            DeskPageFrameActions.showPropertyEditor();
                        }
                    })(domNodeId)
                });
            return (
                <OverlayButtons {...overlayModel} />
            );
        }

    }


});

module.exports = OverlayTreeviewItem;
