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
var InputValue = require('../element/InputValue.js');
var ProjectNameInput = require('../element/ProjectNameInput.js');

var FormUploadProjectName = React.createClass({

    handleSubmitStep: function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onSubmitStep) {
            this.props.onSubmitStep({
                projectName: this.refs.projectNameInput.getValue(),
                projectLicense: this.refs.licenseInput.getValue()
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
                        <td style={{width: '20%'}}></td>
                        <td>
                            <h4 className="text-center">Project name</h4>
                            <div style={{height: '324px', overflow: 'auto'}}>
                                <ProjectNameInput value={this.props.projectName} ref='projectNameInput'/>
                                <InputValue
                                    ref='licenseInput'
                                    type='text'
                                    value={this.props.projectLicense}
                                    label='License:' placeholder='License'/>
                                <div style={{padding: '0.5em'}}>
                                    <p>Any data published to the React Component Exchange (including user account information)
                                        may be removed or modified at the sole discretion of the Helmet administration.</p>
                                </div>
                            </div>
                        </td>
                        <td style={{width: '20%'}}></td>
                    </tr>
                </table>
                <div style={{display: 'table', textAlign: 'center', width: '100%', 'marginTop': '2em'}}>
                    <Button bsStyle='primary' onClick={this.handleSubmitStep}>Next</Button>
                </div>
            </div>
        );
    }

});

module.exports = FormUploadProjectName;
