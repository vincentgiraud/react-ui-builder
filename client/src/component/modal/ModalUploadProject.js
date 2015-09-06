'use strict';

var _ = require('lodash');
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
var TabPane = ReactBootstrap.TabPane;
var TabbedArea = ReactBootstrap.TabbedArea;
var WizardUploadProject = require('../wizard/WizardUploadProject.js');

var ModalUploadProjectStore = require('../../store/modal/ModalUploadProjectStore.js');
var ModalUploadProjectActions = require('../../action/modal/ModalUploadProjectActions.js');
var ApplicationActions = require('../../action/application/ApplicationActions.js');

var ModalUploadProject = React.createClass({

    _handleClose: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalUploadProjectActions.hideModal();
    },

    _handleLoginForm: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalUploadProjectActions.hideModal();
        ApplicationActions.goToSignInForm();
    },

    getInitialState: function () {
        return ModalUploadProjectStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },
    componentDidMount: function() {
        this.unsubscribe = ModalUploadProjectStore.listen(this.onModelChange);
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },

    getDefaultProps: function () {
        return {
            onHide: ModalUploadProjectActions.hideModal
        };
    },

    render: function(){

        var alerts = [];
        if(this.state.errors && this.state.errors){
            this.state.errors.map(function(error, index){
                alerts.push(
                    <p className='text-danger' key={'error' + index}><strong>{error}</strong></p>
                );
            });
        }

        var modalContent = null;
        var modalFooter = null;
        if(this.state.stage === 'chooseFiles'){

            modalContent = (
                <WizardUploadProject/>
            );

            modalFooter = (
                <div>
                    <Button onClick={this._handleClose}>Close</Button>
                </div>
            );

        } else if(this.state.stage === 'serverConnectionError'){
            modalContent = (
                <div>
                    <h5>Error connection to server.</h5>
                    <h5><span>If you are not authenticated, please sign in on &nbsp;</span>
                        <a href='#' onClick={this._handleLoginForm}>this form</a>
                    </h5>
                </div>
            );
            modalFooter = (
                <div>
                    <Button onClick={this._handleClose}>Close</Button>
                </div>
            );
        }

        return (
            <Modal show={this.state.isModalOpen}
                   onHide={this.props.onHide}
                   dialogClassName='umy-modal-overlay'
                   backdrop={true}
                   keyboard={true}
                   bsSize='medium'
                   animation={true}>
                {/*<Modal.Header closeButton={false}>
                    <Modal.Title>Uploading project files to gallery</Modal.Title>
                </Modal.Header>*/}
                <Modal.Body>
                    {alerts}
                    {modalContent}
                </Modal.Body>
                <Modal.Footer>
                    {modalFooter}
                </Modal.Footer>
            </Modal>
        );
    }

});

module.exports = ModalUploadProject;
