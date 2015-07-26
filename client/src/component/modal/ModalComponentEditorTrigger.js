'use strict';

var React = require('react');
var OverlayMixin = require('react-bootstrap').OverlayMixin;
var ModalComponentEditor = require('./ModalComponentEditor.js');
var ModalComponentEditorTriggerStore = require('../../store/modal/ModalComponentEditorTriggerStore.js');
var ModalComponentEditorTriggerActions = require('../../action/modal/ModalComponentEditorTriggerActions.js');

var ModalComponentEditorTrigger = React.createClass({
    mixins:[OverlayMixin],

    getInitialState: function () {
        return ModalComponentEditorTriggerStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },
    componentDidMount: function() {
        this.unsubscribe = ModalComponentEditorTriggerStore.listen(this.onModelChange);
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },

    render: function () {
        return (
            <span/>
        );
    },

    renderOverlay: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        }

        return (
            <ModalComponentEditor {...this.state}
                onRequestHide={this._handleClose}/>
        );
    },

    _handleClose: function(){
        ModalComponentEditorTriggerActions.toggleModal();
    }

});

module.exports = ModalComponentEditorTrigger;
