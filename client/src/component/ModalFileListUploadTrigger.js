'use strict';

var React = require('react');
var OverlayMixin = require('react-bootstrap').OverlayMixin;
var ModalFileListUpload = require('./ModalFileListUpload.js');
var ModalFileListUploadTriggerStore = require('../store/ModalFileListUploadTriggerStore.js');
var ModalFileListUploadTriggerActions = require('../action/ModalFileListUploadTriggerActions.js');

var ModalFileListUploadTrigger = React.createClass({
    mixins:[OverlayMixin],

    getInitialState: function () {
        return ModalFileListUploadTriggerStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },
    componentDidMount: function() {
        this.unsubscribe = ModalFileListUploadTriggerStore.listen(this.onModelChange);
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },

    render: function () {
        return (
            <span/>
        );
    },

    // This is called by the `OverlayMixin` when this component
    // is mounted or updated and the return value is appended to the body.
    renderOverlay: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        }

        return (
            <ModalFileListUpload {...this.state} onRequestHide={this._handleClose}/>
        );
    },

    _handleClose: function(){
        ModalFileListUploadTriggerActions.toggleModal();
    }

});

module.exports = ModalFileListUploadTrigger;
