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
var FormActionsComponentEditor = require('../form/FormActionsComponentEditor.js');
var FormStoreComponentEditor = require('../form/FormStoreComponentEditor.js');
var ModalComponentEditorTriggerActions = require('../../action/modal/ModalComponentEditorTriggerActions.js');

var WizardGenerateComponent = require('../wizard/WizardGenerateComponent.js');

var ModalComponentEditor = React.createClass({

    _handleClose: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalComponentEditorTriggerActions.hideModal();
    },

    _handleSave: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalComponentEditorTriggerActions.saveProperties(
            {
                propsScript: this.refs.componentPropsEditor ? this.refs.componentPropsEditor.getPropsScript() : null,
                componentText: this.refs.componentTextInput ? this.refs.componentTextInput.getValue() : null,
                sourceCode: this.refs.componentSourceCodeEditor ? this.refs.componentSourceCodeEditor.getComponentScript() : null,
                actionsSourceCode: this.refs.actionsSourceCodeEditor ? this.refs.actionsSourceCodeEditor.getActionsScript() : null,
                storeSourceCode: this.refs.storeSourceCodeEditor ? this.refs.storeSourceCodeEditor.getStoreScript() : null
            }
        );
    },

    _handleSaveOptionsVariant: function(e){
        e.stopPropagation();
        e.preventDefault();
        var options = {
            propsScript: this.refs.componentPropsEditor.getPropsScript(),
            componentText: this.refs.componentTextInput ? this.refs.componentTextInput.getValue() : null
        };
        ModalComponentEditorTriggerActions.saveOptionsVariant(options);
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
        ModalComponentEditorTriggerActions.startWizardGenerateComponent();
    },

    getDefaultProps: function () {
        return {
            onRequestHide: this._handleClose
        };
    },

    getInitialState: function(){
        return {
            componentText: this.props.componentText,
            showTextEditor: !!this.props.componentText
        }
    },

    componentDidMount: function(){
        var $domNode = $(React.findDOMNode(this));
        $domNode.css({
            'z-index': 1060
        });
        $domNode.find('.modal-dialog').addClass('modal-lg');
        $domNode.find('.panel-body').remove();
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
        if(this.props.errors && this.props.errors.length > 0){
            for(i = 0; i < this.props.errors.length; i++){
                alerts.push(
                    <p className='text-danger' key={'perror' + i}><strong>{JSON.stringify(this.props.errors[i])}</strong></p>
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
                    componentName={this.props.componentName}
                    selectedUmyId={this.props.selectedUmyId}
                    propsScript={this.props.propsScript}
                    editorStyle={{height: '400px', width: '100%'}}/>
            </TabPane>
        );

        if(this.props.wizard === 'GenerateComponent'){
            tabPanes.push(
                <TabPane key={tabPanes.length + 1} eventKey={tabPanes.length + 1} tab='Component'>
                    <WizardGenerateComponent
                        style={{height: '400px', width: '100%'}}
                        selectedUmyId={this.props.selectedUmyId}
                        />
                </TabPane>
            );
        } else if(this.props.sourceCode){
            tabPanes.push(
                <TabPane key={tabPanes.length + 1} eventKey={tabPanes.length + 1} tab='Component'>
                    <FormCodeComponentEditor
                        isSourceCodeGenerated={this.props.isSourceCodeGenerated}
                        componentName={this.props.componentName}
                        selectedUmyId={this.props.selectedUmyId}
                        sourceCode={this.props.sourceCode}
                        ref='componentSourceCodeEditor'
                        style={containerStyle}
                        sourceFilePath={this.props.sourceFilePath}
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

        if(this.props.storeSourceCode){
            tabPanes.push(
                <TabPane key={tabPanes.length + 1} eventKey={tabPanes.length + 1} tab='Store'>
                    <FormStoreComponentEditor
                        ref='storeSourceCodeEditor'
                        storeSourceCode={this.props.storeSourceCode}
                        />
                </TabPane>
            );
        }

        if(this.props.actionsSourceCode){
            tabPanes.push(
                <TabPane key={tabPanes.length + 1} eventKey={tabPanes.length + 1} tab='Actions'>
                    <FormActionsComponentEditor
                        ref='actionsSourceCodeEditor'
                        actionsSourceCode={this.props.actionsSourceCode}
                        />
                </TabPane>
            );
        }

        return (
            <Modal onRequestHide={this.props.onRequestHide} title={false} animation={true} backdrop={false} keyboard={true}>
                <div className='modal-body'>
                    {alerts}
                    <TabbedArea defaultActiveKey={1}>
                        {tabPanes}
                    </TabbedArea>
                </div>
                <div className="modal-footer">
                    <Button onClick={this._handleClose}>Cancel</Button>
                    <Button onClick={this._handleSave} bsStyle="primary">Save changes</Button>
                </div>
            </Modal>
        );
    }

});

module.exports = ModalComponentEditor;
