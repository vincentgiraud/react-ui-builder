'use strict';

var validator = require('validator');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;
var Badge = ReactBootstrap.Badge;
var PanelGroup = ReactBootstrap.PanelGroup;
var TabbedArea = ReactBootstrap.TabbedArea;
var TabPane = ReactBootstrap.TabPane;
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;
var ModalStaticSiteGeneratorStore = require('../../store/modal/ModalStaticSiteGeneratorStore.js');
var ModalStaticSiteGeneratorActions = require('../../action/modal/ModalStaticSiteGeneratorActions.js');

var WizardGenerateStaticSite = require('../wizard/WizardGenerateStaticSite.js');

var ModalStaticSiteGenerator = React.createClass({

    getInitialState: function () {
        return ModalStaticSiteGeneratorStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentDidMount: function() {
        this.unsubscribe = ModalStaticSiteGeneratorStore.listen(this.onModelChange);
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },

    getDefaultProps: function () {
        return {
            onHide: ModalStaticSiteGeneratorActions.hideModal
        };
    },

    _handleClose: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalStaticSiteGeneratorActions.hideModal();
    },

    render: function(){
        return (
            <Modal show={this.state.isModalOpen}
                   onHide={this.props.onHide}
                   dialogClassName='umy-modal-overlay'
                   backdrop={true}
                   keyboard={true}
                   bsSize='medium'
                   ref='dialog'
                   animation={true}>
                {/*<Modal.Header closeButton={false} aria-labelledby='contained-modal-title'>
                 <Modal.Title id='contained-modal-title'>Generate component's source code</Modal.Title>
                 </Modal.Header>*/}
                <Modal.Body>
                    <div>
                        <WizardGenerateStaticSite />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this._handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

});

module.exports = ModalStaticSiteGenerator;
