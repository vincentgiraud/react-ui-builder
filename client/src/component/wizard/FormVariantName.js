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

var FormVariantName = React.createClass({


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
            this.props.onSubmitStep({
                variantName: this.state.variantName
            });
        }
    },

    _handleVariantNameChange: function () {
        var variantName = React.findDOMNode(this.refs.variantNameInput).value;
        var newState = {
            variantName: variantName
        };
        this.setState(newState);
    },

    getDefaultProps: function () {
        return {
            onSubmitStep: null,
            onBackStep: null
        };
    },

    getInitialState: function(){
        return {
            variantName: ''
        };
    },

    componentDidMount: function(){
        React.findDOMNode(this.refs.variantNameInput).focus();
    },

    render: function () {
        return (
            <div style={this.props.formStyle}>
                <table style={{width: '100%'}}>
                    <tr>
                        <td style={{width: '20%'}}></td>
                        <td>
                            <h4>{this.props.commitmentMessage}</h4>
                            <div className='form-group '>
                                <label htmlFor='variantNameElement'>Variant name:</label>
                                <input id='variantNameElement'
                                       ref='variantNameInput'
                                       className="form-control input-sm"
                                       type="text"
                                       placeholder='Enter variant name'
                                       value={this.state.variantName}
                                       onChange={this._handleVariantNameChange}
                                    />
                            </div>

                        </td>
                        <td style={{width: '20%'}}></td>
                    </tr>
                </table>
                <div style={{display: 'table', textAlign: 'center', width: '100%', marginTop: '2em'}}>
                    <Button bsStyle='default' onClick={this._handleBackStep}>Cancel</Button>
                    <Button bsStyle='primary' onClick={this._handleSubmitStep}>Commit</Button>
                </div>
            </div>
        );
    }

});

module.exports = FormVariantName;
