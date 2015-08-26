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
var PageList = require('../element/PageList.js');

var FormUploadProjectPageList = React.createClass({


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
                pageContents: this.refs.pageList.getPageContents()
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
                            <h4 className="text-center">Select sample pages</h4>
                            <PageList
                                ref='pageList'
                                pageContents={this.props.pageContents}
                                listHeight="324px" />

                        </td>
                        <td style={{width: '20%'}}></td>
                    </tr>
                </table>
                <div style={{display: 'table', textAlign: 'center', width: '100%', marginTop: '2em'}}>
                    <Button bsStyle='default' onClick={this.handleBackStep}>Back</Button>
                    <Button bsStyle='primary' onClick={this.handleSubmitStep}>Next</Button>
                </div>
            </div>
        );
    }

});

module.exports = FormUploadProjectPageList;
