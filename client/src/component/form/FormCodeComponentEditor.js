'use strict';

var React = require('react/addons');
var validator = require('validator');

var Repository = require('../../api/Repository.js');
var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Panel = ReactBootstrap.Panel;
var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;

var WizardIncludeChildren = require('../wizard/WizardIncludeChildren.js');
var AceEditor = require('../element/AceEditor.js');

var FormCodeComponentEditorActions = require('../../action/form/FormCodeComponentEditorActions.js');
var FormCodeComponentEditorStore = require('../../store/form/FormCodeComponentEditorStore.js');
var ModalPropsEditorTriggerActions = require('../../action/ModalPropsEditorTriggerActions.js');

var FormCodeComponentEditor = React.createClass({

    _handleCreateComponentChildren: function (e) {
        e.stopPropagation();
        e.preventDefault();
        if(this.props.isSourceCodeGenerated === true){
            alert('Please save changes after the source code generation');
        } else {
            FormCodeComponentEditorActions.startWizardIncludeChildren(this.getComponentScript());
        }
    },

    getInitialState: function () {
        return {
            wizard: FormCodeComponentEditorStore.initialModel.wizard,
            sourceCode: this.props.sourceCode
        };
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            sourceCode: nextProps.sourceCode
        });
    },

    onModelChange: function (model) {
        this.setState(model);
    },

    componentDidMount: function () {
        this.unsubscribe = FormCodeComponentEditorStore.listen(this.onModelChange);
    },

    componentWillUnmount: function () {
        this.unsubscribe();

    },

    render: function () {

        var editorElement = null;
        var toolBarElement = null;

        if (this.state.wizard === 'IncludeChildren') {

            toolBarElement = (
                <Row style={{marginBottom: '3px'}}>
                    <Col xs={12}>
                        <h4 className='text-center'></h4>
                    </Col>
                </Row>
            );
            editorElement = (
                <WizardIncludeChildren
                    componentName={this.props.componentName}
                    selectedUmyId={this.props.selectedUmyId}
                    style={this.props.editorStyle}
                    sourceCode={this.state.sourceCode} />
            );

        } else {
            toolBarElement = (
                <Row style={{marginBottom: '3px'}}>
                    <Col xs={12}>
                        <table>
                            <tr>
                                <td>
                                    <div className="dropdown">
                                        <button className="btn btn-default btn-xs dropdown-toggle" type="button"
                                                id="dropdownMenu" data-toggle="dropdown" aria-expanded="true">
                                            <span className="fa fa-gear fa-fw"></span>
                                            <span className="fa fa-caret-down fa-fw"></span>
                                        </button>
                                        <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">
                                            <li role="presentation">
                                                <a role="menuitem" href="#"
                                                   onClick={this._handleCreateComponentChildren}>
                                                    Merge children into source code
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                                <td>
                                    <p style={{marginLeft: "1em"}}>
                                        <span>{this.props.sourceFilePath}</span>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </Col>
                </Row>
            );
            editorElement = (
                <AceEditor ref='editor'
                           mode='ace/mode/jsx'
                           style={this.props.editorStyle}
                           sourceCode={this.state.sourceCode}/>
            );
        }
        return (
            <Grid style={this.props.style} fluent={true}>
                {toolBarElement}
                <Row>
                    <Col xs={12}>
                        {editorElement}
                    </Col>
                </Row>
            </Grid>
        );
    },

    getComponentScript: function () {
        return this.refs.editor.getSourceCode();
    }

});

module.exports = FormCodeComponentEditor;
