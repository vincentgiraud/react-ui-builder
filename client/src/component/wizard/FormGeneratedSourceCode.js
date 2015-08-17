'use strict';

var _ = require('lodash');
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

var AceEditor = require('../element/AceEditor.js');

var FormGeneratedSourceCode = React.createClass({


    _handleBackStep: function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onBackStep) {
            this.props.onBackStep(this.getOptions());
        }
    },

    _handleSubmitStep: function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onSubmitStep) {
            this.props.onSubmitStep(this.getOptions());
        }
    },

    _handleModuleSelect: function(e){
        e.preventDefault();
        e.stopPropagation();
        var module = e.currentTarget.attributes['data-module-key'].value;
        this.setState({
            selected: module
        });
    },

    getOptions: function () {
        return {
            sourceCode: this.refs.editor.getSourceCode()
        }
    },

    getInitialState: function () {
        return {
            selected: 'component'
        };
    },

    getDefaultProps: function () {
        return {
            onSubmitStep: null,
            onBackStep: null
        };
    },

    componentDidMount: function () {
    },

    componentWillUnmount: function () {
    },

    trimComponentName: function(label){
        if(label.length > 20){
            label = label.substr(0, 20) + '...';
        }
        return label;
    },

    render: function () {

        var dataObject = this.props.componentSourceDataObject;

        var sourceCode = null;
        var filePath = null;
        if(this.state.selected === 'component'){
            sourceCode = dataObject.component.sourceCode;
            filePath = dataObject.component.outputFilePath;
        } else {
            var selectedModule = dataObject.modules[this.state.selected];
            sourceCode = selectedModule.sourceCode;
            filePath = selectedModule.outputFilePath;
        }

        var itemList = [];
        itemList.push(

            <ListGroupItem key={'component'}
                           style={{position: 'relative', cursor: 'pointer'}}
                           data-module-key={'component'}
                           onClick={this._handleModuleSelect}>
                <span>{this.trimComponentName(dataObject.component.componentName)}</span>
            </ListGroupItem>

        );
        _.forOwn(dataObject.modules, function(module, name){
            itemList.push(
                <ListGroupItem key={name}
                               style={{position: 'relative', cursor: 'pointer'}}
                               data-module-key={name}
                               onClick={this._handleModuleSelect}>
                    <span>{this.trimComponentName(module.name)}</span>
                </ListGroupItem>
            );
        }.bind(this));

        return (
            <div style={this.props.formStyle}>
                <table style={{width: '100%'}}>
                    <tr>
                        <td><p className='text-center'>Modules</p></td>
                        <td><p>{filePath}</p></td>
                    </tr>
                    <tr>
                        <td>
                            <div style={{padding: '0.5em', width: '100%', height: '400px', overflow: 'auto' }}>
                                <ListGroup fill>
                                    {itemList}
                                </ListGroup>
                            </div>
                        </td>
                        <td style={{width: '90%'}}>
                            <AceEditor
                                ref='editor'
                                sourceName={this.state.selected}
                                mode='ace/mode/jsx'
                                isReadOnly={true}
                                style={{ height: '400px', width: '690px'}}
                                sourceCode={sourceCode}/>
                        </td>
                    </tr>
                </table>

                <div style={{display: 'table', textAlign: 'center', width: '100%', marginTop: '2em'}}>
                    <Button bsStyle='default' onClick={this._handleBackStep}>Back</Button>
                    <Button bsStyle='primary' onClick={this._handleSubmitStep}>Save</Button>
                </div>
            </div>
        );
    }

});

module.exports = FormGeneratedSourceCode;
