'use strict';

var _ = require('underscore');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var Panel = ReactBootstrap.Panel;
var Alert = ReactBootstrap.Alert;
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var InputValue = require('../element/InputValue.js');
var ProjectNameInput = require('../element/ProjectNameInput.js');
var ProjectDescriptionInput = require('../element/ProjectDescriptionInput.js');
var CollapsibleHorizontalDivider = require('../element/CollapsibleHorizontalDivider.js');

var ModalFileListUploadTriggerActions = require('../../action/modal/ModalFileListUploadTriggerActions.js');
var ApplicationActions = require('../../action/application/ApplicationActions.js');

var ModalFileListUpload = React.createClass({

    getInitialState: function(){
        return {
        }
    },

    getDefaultProps: function () {
        return {
            onRequestHide: null
        };
    },

    componentDidMount: function(){
        var $domNode = $(React.findDOMNode(this));
        $domNode.css({
            'z-index': 1060
        });
        $domNode.find('.modal-dialog').addClass('modal-lg');
    },

    componentWillUnmount: function(){
    },

    _handleClose: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalFileListUploadTriggerActions.hideModal();
    },

    render: function(){

        return (
            <Modal {...this.props} title='Uploading project files to gallery' animation={true} backdrop={false}>
                <div className="modal-body">
                    <h3>This is demo version. For full version install react-ui-builder locally.</h3>
                </div>
                <div className="modal-footer">
                    <Button onClick={this._handleClose}>Close</Button>
                </div>
            </Modal>
        );
    }

});

module.exports = ModalFileListUpload;
