'use strict';

var _ = require('lodash');
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

var Repository = require('../../api/Repository.js');

var FormComponentName = React.createClass({


    _handleGroupNameChange: function () {
        var groupName = React.findDOMNode(this.refs.groupNameInput).value;
        var newState = {
            componentGroup: groupName
        };
        this.setState(newState);
    },

    _handleGroupNameSelected: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var newState = {
            componentGroup: e.currentTarget.attributes['data-group'].value
        };
        this.setState(newState);
    },

    _validationStateGroupName: function () {
        if (this.state.componentGroup
            && this.state.componentGroup.length > 0
            && validator.isAlphanumeric(this.state.componentGroup)) {
            //
            return 'has-success';
        }
        return 'has-error';
    },

    _validationStateComponentName: function () {
        if (this.state.componentName
            && this.state.componentName.length > 0
            && validator.isAlphanumeric(this.state.componentName)) {
            //
            return 'has-success';
        }
        return 'has-error';
    },

    _handleComponentNameChange: function () {
        var componentName = React.findDOMNode(this.refs.componentNameInput).value;
        var newState = {
            componentName: componentName
        };
        this.setState(newState);
    },

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

    getOptions: function () {
        return {
            componentGroup: React.findDOMNode(this.refs.groupNameInput).value,
            componentName: React.findDOMNode(this.refs.componentNameInput).value
        }
    },

    getInitialState: function () {
        return {
            componentGroup: this.props.componentGroup,
            componentName: this.props.componentName
        }
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

    render: function () {
        var groupItems = [];
        var groups = Repository.getComponentsTreeGroups();
        if (groups && groups.length > 0) {
            for (var i = 0; i < groups.length; i++) {
                if (groups[i] !== 'Html') {
                    groupItems.push(
                        <li key={i}>
                            <a href="#" onClick={this._handleGroupNameSelected} data-group={groups[i]}>
                                <span>{groups[i]}</span>
                            </a>
                        </li>
                    );
                }
            }
        }
        return (
            <div style={this.props.formStyle}>
                    <table style={{width: '100%'}}>
                        <tr>
                            <td style={{width: '20%'}}></td>
                            <td style={{height: '100%', verticalAlign: 'middle'}}>
                                <form>
                                    <div className={'form-group ' + this._validationStateGroupName()}>
                                        <label htmlFor='groupNameElement'>Group:</label>

                                        <div className="input-group input-group-sm">
                                            <input id='groupNameElement'
                                                   ref='groupNameInput'
                                                   type="text"
                                                   className="form-control"
                                                   placeholder='Group name'
                                                   value={this.state.componentGroup}
                                                   onChange={this._handleGroupNameChange}
                                                />

                                            <div className="input-group-btn">
                                                <button type="button"
                                                        className="btn dropdown-toggle" data-toggle="dropdown"
                                                        aria-expanded="false">
                                                    <span className="caret"></span>
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-right" role="menu">
                                                    {groupItems}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={'form-group ' + this._validationStateComponentName()}>
                                        <label htmlFor='componentNameElement'>Component:</label>
                                        <input id='componentNameElement'
                                               ref='componentNameInput'
                                               className="form-control input-sm"
                                               type="text"
                                               placeholder='Component name'
                                               value={this.state.componentName}
                                               onChange={this._handleComponentNameChange}
                                            />
                                    </div>
                                </form>
                            </td>
                            <td style={{width: '20%'}}></td>
                        </tr>
                        <tr>
                            <td colspan='3' style={{height: '2em'}}></td>
                        </tr>
                    </table>
                    <div style={{display: 'table', textAlign: 'center', width: '100%'}}>
                        <Button bsStyle='default' onClick={this._handleBackStep}>Back</Button>
                        <Button bsStyle='primary' onClick={this._handleSubmitStep}>Next</Button>
                    </div>
            </div>
        );
    }

});

module.exports = FormComponentName;
