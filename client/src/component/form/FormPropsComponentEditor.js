'use strict';

var validator = require('validator');
var React = require('react');
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

var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var AceEditor = require('../element/AceEditor.js');
var WizardVariantName = require('../wizard/WizardVariantName.js');
var FormPropsComponentEditorActions = require('../../action/form/FormPropsComponentEditorActions.js');
var FormPropsComponentEditorStore = require('../../store/form/FormPropsComponentEditorStore.js');


var FormPropsComponentEditor = React.createClass({

    _handleCreateVariantName: function (e) {
        e.stopPropagation();
        e.preventDefault();
        FormPropsComponentEditorActions.startWizardSaveVariant({
            propsScript: this.getPropsScript()
        });
    },

    getInitialState: function () {
        return {
            wizard: FormPropsComponentEditorStore.initialModel.wizard,
            propsScript: this.props.propsScript
        };
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            propsScript: nextProps.propsScript
        });
    },

    onModelChange: function (model) {
        this.setState(model);
    },

    componentDidMount: function () {
        this.unsubscribe = FormPropsComponentEditorStore.listen(this.onModelChange);
    },

    componentWillUnmount: function () {
        this.unsubscribe();

    },

    render: function(){

        var editorElement = null;
        var toolBarElement = null;

        if (this.state.wizard === 'SaveVariant') {

            toolBarElement = (
                <Row style={{marginBottom: '3px'}}>
                    <Col xs={12}>
                        <h4 className='text-center'></h4>
                    </Col>
                </Row>
            );
            editorElement = (
                <WizardVariantName
                    componentName={this.props.componentName}
                    selectedUmyId={this.props.selectedUmyId}
                    style={this.props.editorStyle}
                    propsScript={this.state.propsScript} />
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
                                                <a role="menuitem" href="#" onClick={this._handleCreateVariantName}>
                                                    Save as new variant for component
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                                <td>
                                    <p style={{marginLeft: "1em"}}>
                                        {/*<span>{todo - variant name}</span>*/}
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </Col>
                </Row>
            );
            editorElement = (
                <AceEditor ref='editor'
                           sourceName='componentPropsScript'
                           style={this.props.editorStyle}
                           sourceCode={this.state.propsScript}/>
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

    getPropsScript: function(){
        return this.refs.editor.getSourceCode();
    }

});

module.exports = FormPropsComponentEditor;
