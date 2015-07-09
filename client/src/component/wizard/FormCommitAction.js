'use strict';

var _ = require('underscore');
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

var FormCommitAction = React.createClass({


    _handleBackStep: function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onBackStep) {
            this.props.onBackStep();
        }
    },

    _handleSubmitStep: function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onSubmitStep) {
            this.props.onSubmitStep();
        }
    },

    getDefaultProps: function () {
        return {
            onSubmitStep: null,
            onBackStep: null
        };
    },

    render: function () {
        var commitButton = null;
        if(this.props.isCommittable){
            commitButton = (
                <Button bsStyle='primary' onClick={this._handleSubmitStep}>Commit</Button>
            );
        }
        return (
            <div style={this.props.formStyle}>
                <table style={{width: '100%'}}>
                    <tr>
                        <td style={{width: '10%'}}></td>
                        <td>
                            <h4>{this.props.commitmentMessage}</h4>
                        </td>
                        <td style={{width: '10%'}}></td>
                    </tr>
                    <tr>
                        <td colspan='3' style={{height: '2em'}}></td>
                    </tr>
                </table>
                <div style={{display: 'table', textAlign: 'center', width: '100%'}}>
                    <Button bsStyle='default' onClick={this._handleBackStep}>Back</Button>
                    {commitButton}
                </div>
            </div>
        );
    }

});

module.exports = FormCommitAction;
