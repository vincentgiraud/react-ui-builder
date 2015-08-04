'use strict';

var _ = require('underscore');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var ProxyInput = require('../element/ProxyInput.js');
var ModalProjectSettingsStore = require('../../store/modal/ModalProjectSettingsStore.js');
var ModalProjectSettingsActions = require('../../action/modal/ModalProjectSettingsActions.js');

var ModalProjectSettings = React.createClass({

    getInitialState: function () {
        return ModalProjectSettingsStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },
    componentDidMount: function() {
        this.unsubscribe = ModalProjectSettingsStore.listen(this.onModelChange);
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },

    getDefaultProps: function () {
        return {
            onHide: ModalProjectSettingsActions.hideModal
        };
    },

    render: function(){
        return (
            <Modal show={this.state.isModalOpen}
                   onHide={this.props.onHide}
                   dialogClassName='umy-modal-overlay'
                   backdrop={true}
                   bsSize='medium'
                   animation={true}>
                <Modal.Header closeButton={true} aria-labelledby='contained-modal-title'>
                    <Modal.Title id='contained-modal-title'>Project Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProxyInput ref='urlInputElement' label='Setup proxy:' urlValue={this.state.urlValue}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this._handleClose}>Cancel</Button>
                    <Button onClick={this._handleSave} bsStyle="primary">Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    },

    _handleClose: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalProjectSettingsActions.hideModal();
    },

    _handleSave: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalProjectSettingsActions.saveSettings({
            urlValue: this.refs.urlInputElement.getUrlValue()
        });
    }

});

module.exports = ModalProjectSettings;
