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
var MarkdownEditorX = require('../element/MarkdownEditorX.js');

var FormUploadProjectDescription = React.createClass({


    handleBackStep: function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onBackStep) {
            this.props.onBackStep();
        }
    },

    handleSubmitStep: function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onSubmitStep) {
            this.props.onSubmitStep({
                projectDescription: this.refs.projectDescriptionEditor.getMarkdownSource()
            });
        }
    },

    getDefaultProps: function () {
        return {
            onSubmitStep: null,
            onBackStep: null
        };
    },

    render: function () {
        return (
            <div style={this.props.formStyle}>
                <table style={{width: '100%'}}>
                    <tr>
                        <td>
                            <h4 className="text-center">Brief project description</h4>
                            <MarkdownEditorX
                                ref='projectDescriptionEditor'
                                sourceName={'projectDescription'}
                                editorHeight={'200px'}
                                previewHeight={'234px'}
                                markdownSource={this.props.projectDescription}/>
                        </td>

                    </tr>
                </table>
                <div style={{display: 'table', textAlign: 'center', width: '100%', marginTop: '1em'}}>
                    <Button bsStyle='default' onClick={this.handleBackStep}>Back</Button>
                    <Button bsStyle='primary' onClick={this.handleSubmitStep}>Next</Button>
                </div>
            </div>
        );
    }

});

module.exports = FormUploadProjectDescription;
