'use strict';

var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var ModalQuickActionComponentStore = require('../../store/modal/ModalQuickActionComponentStore.js');
var ModalQuickActionComponentActions = require('../../action/modal/ModalQuickActionComponentActions.js');
var SidePanel = require('../element/SidePanel.js');
var WizardAppendComponent = require('../wizard/WizardAppendComponent.js');

var ModalQuickActionComponent = React.createClass({

    _handleClose: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalQuickActionComponentActions.hide();
    },

    getInitialState: function () {
        return ModalQuickActionComponentStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentDidMount: function() {
        this.unsubscribe = ModalQuickActionComponentStore.listen(this.onModelChange);
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },


    getDefaultProps: function () {
        return {
            onHide: ModalQuickActionComponentActions.hide
        };
    },

    render: function(){
        var panelStyle = {
            position: 'relative',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            height: '20em',
            overflow: 'auto'
        };

        var content = (
            <SidePanel style={panelStyle}>
                <div style={{height: '700px'}}></div>
            </SidePanel>
        );

        return (
            <Modal show={this.state.isModalOpen}
                   onHide={this.props.onHide}
                   dialogClassName='umy-modal-overlay'
                   backdrop={true}
                   bsSize='small'
                   animation={true}>
                <Modal.Header closeButton={true} aria-labelledby='contained-modal-title'>
                    <Modal.Title id='contained-modal-title'>{this.state.commandLabel}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <WizardAppendComponent itemsTree={this.state.itemsTree}
                                           selectedUmyId={this.state.selectedUmyId}
                                           command={this.state.command} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this._handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

});

module.exports = ModalQuickActionComponent;
