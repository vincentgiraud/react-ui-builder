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
var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var FormCodeComponentEditor = require('../form/FormCodeComponentEditor.js');
var FormPropsComponentEditor = require('../form/FormPropsComponentEditor.js');
//var FormActionsComponentEditor = require('../form/FormActionsComponentEditor.js');
//var FormStoreComponentEditor = require('../form/FormStoreComponentEditor.js');
var ModalComponentEditorStore = require('../../store/modal/ModalComponentEditorStore.js');
var ModalComponentEditorActions = require('../../action/modal/ModalComponentEditorActions.js');

var ModalComponentEditor = React.createClass({

    _handleClose: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalComponentEditorActions.hideModal();
    },

    _handleSave: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalComponentEditorActions.saveProperties(
            {
                propsScript: this.refs.componentPropsEditor ? this.refs.componentPropsEditor.getPropsScript() : null,
                componentText: this.refs.componentTextInput ? this.refs.componentTextInput.getValue() : null,
                sourceCode: this.refs.componentSourceCodeEditor ? this.refs.componentSourceCodeEditor.getComponentScript() : null,
                actionsSourceCode: this.refs.actionsSourceCodeEditor ? this.refs.actionsSourceCodeEditor.getActionsScript() : null,
                storeSourceCode: this.refs.storeSourceCodeEditor ? this.refs.storeSourceCodeEditor.getStoreScript() : null
            }
        );
    },

    _validationStateComponentText: function(){
        if(this.state.componentText && this.state.componentText.length > 0){
            return 'success';
        } else {
            return 'error';
        }
    },

    _handleChangeState: function(){
        this.setState({
            componentText: this.refs.componentTextInput ? this.refs.componentTextInput.getValue() : null
        });
    },

    _handleCreateComponent: function (e) {
        e.stopPropagation();
        e.preventDefault();
        ModalComponentEditorActions.startWizardGenerateComponent(
            { selectedUmyId: this.state.selectedUmyId }
        );
    },

    getInitialState: function () {
        return ModalComponentEditorStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentDidMount: function() {
        this.unsubscribe = ModalComponentEditorStore.listen(this.onModelChange);
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },

    getDefaultProps: function () {
        return {
            onHide: ModalComponentEditorActions.hideModal
        };
    },

    render: function(){
        var containerStyle={
            marginTop: '1em',
            width: '100%'
        };
        var tabPanes = [];
        var alerts = [];

        if(this.state.errors && this.state.errors.length > 0){
            for(var i = 0; i < this.state.errors.length; i++){
                var stringError = JSON.stringify(this.state.errors[i]);
                alerts.push(
                    <p className='text-danger' key={'serror' + i}><strong>{stringError}</strong></p>
                );
            }
        }

        if(this.state.showTextEditor){
            tabPanes.push(
                <TabPane key={tabPanes.length + 1} eventKey={tabPanes.length + 1} tab='Component Text'>
                    <div className='container-fluid' style={containerStyle}>
                        <div className='row'>
                            <div className='col-xs-12'>
                                <p>
                                    <Input
                                        type="textarea"
                                        placeholder="Enter text"
                                        hasFeedback
                                        bsStyle={this._validationStateComponentText()}
                                        value={this.state.componentText}
                                        onChange={this._handleChangeState}
                                        ref="componentTextInput"
                                        style={{width: '100%', height: '400px'}}/>
                                </p>
                            </div>
                        </div>
                    </div>
                </TabPane>
            );
        }

        tabPanes.push(
            <TabPane key={tabPanes.length + 1} eventKey={tabPanes.length + 1} tab='Properties'>
                <FormPropsComponentEditor
                    ref='componentPropsEditor'
                    style={containerStyle}
                    componentName={this.state.componentName}
                    selectedUmyId={this.state.selectedUmyId}
                    propsScript={this.state.propsScript}
                    editorStyle={{height: '400px', width: '100%'}}/>
            </TabPane>
        );

        if(!this.state.errorReadingSourceFile){
            if(this.state.sourceCode){
                tabPanes.push(
                    <TabPane key={tabPanes.length + 1} eventKey={tabPanes.length + 1} tab='Component'>
                        <FormCodeComponentEditor
                            componentName={this.state.componentName}
                            selectedUmyId={this.state.selectedUmyId}
                            sourceCode={this.state.sourceCode}
                            ref='componentSourceCodeEditor'
                            style={containerStyle}
                            sourceFilePath={this.state.sourceFilePath}
                            editorStyle={{height: '400px', width: '100%'}}
                            />
                    </TabPane>
                );
            } else {
                tabPanes.push(
                    <TabPane key={tabPanes.length + 1} eventKey={tabPanes.length + 1} tab='Component'>
                        <div style={{height: '400px', width: '100%'}}>
                            <div style={{height: '100%', width: '100%', marginTop: '1em'}}>
                                <table style={{ width: '100%'}}>
                                    <tr>
                                        <td style={{width: '20%'}}></td>
                                        <td style={{height: '100%', textAlign: 'center', verticalAlign: 'middle'}}>
                                            <Button block={false}
                                                    onClick={this._handleCreateComponent}>
                                                <span>Generate Component's source code</span>
                                            </Button>
                                        </td>
                                        <td style={{width: '20%'}}></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </TabPane>
                );
            }
        }

        if(this.state.storeSourceCode){
            tabPanes.push(
                <TabPane key={tabPanes.length + 1} eventKey={tabPanes.length + 1} tab='Store'>
                    <FormStoreComponentEditor
                        ref='storeSourceCodeEditor'
                        storeSourceCode={this.state.storeSourceCode}
                        />
                </TabPane>
            );
        }

        if(this.state.actionsSourceCode){
            tabPanes.push(
                <TabPane key={tabPanes.length + 1} eventKey={tabPanes.length + 1} tab='Actions'>
                    <FormActionsComponentEditor
                        ref='actionsSourceCodeEditor'
                        actionsSourceCode={this.state.actionsSourceCode}
                        />
                </TabPane>
            );
        }

        return (
            <Modal show={this.state.isModalOpen}
                   onHide={this.props.onHide}
                   dialogClassName='umy-modal-overlay'
                   backdrop={true}
                   keyboard={true}
                   bsSize='large'
                   ref='dialog'
                   animation={true}>
                {/*<Modal.Header closeButton={false} aria-labelledby='contained-modal-title'>
                 <Modal.Title id='contained-modal-title'></Modal.Title>
                 </Modal.Header>*/}
                <Modal.Body>
                    {alerts}
                    <TabbedArea defaultActiveKey={1}>
                        {tabPanes}
                    </TabbedArea>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this._handleClose}>Cancel</Button>
                    <Button onClick={this._handleSave} bsStyle="primary">Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }

});

module.exports = ModalComponentEditor;
