'use strict';

var _ = require('underscore');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var ProxyInput = require('../element/ProxyInput.js');
var ModalProjectSettingsTriggerActions = require('../../action/modal/ModalProjectSettingsTriggerActions.js');

var ModalProjectSettings = React.createClass({

    getDefaultProps: function () {
        return {
            onRequestHide: null,
            text: 'Loading...'
        };
    },

    render: function(){
        return (
            <Modal {...this.props} title='Project Settings' animation={true} backdrop={false}>
                <div className="modal-body">
                    <h3>This is demo version. For full version install react-ui-builder locally.</h3>
                </div>
                <div className="modal-footer">
                    <Button onClick={this._handleClose}>Close</Button>
                </div>
            </Modal>
        );
    },

    _handleClose: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalProjectSettingsTriggerActions.hideModal();
    },

    _handleSave: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalProjectSettingsTriggerActions.saveSettings({
            urlValue: this.refs.urlInputElement.getUrlValue()
        });
    }

});

module.exports = ModalProjectSettings;
