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

var FormPageList = React.createClass({


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
            this.props.onSubmitStep(
                this.state.pageContents
            );
        }
    },

    handleCheckItemChange: function(e){
        var newState = {
            pageContents: this.state.pageContents
        };
        newState.pageContents[e.currentTarget.value].checked = e.currentTarget.checked;
        this.setState(newState);
    },

    handleRadioItemChange: function(e){
        var newState = {
            pageContents: this.state.pageContents
        };
        _.forOwn(newState.pageContents, function(value, prop){
            value.isIndexPage = false;
        });
        newState.pageContents[e.currentTarget.value].isIndexPage = e.currentTarget.checked;
        this.setState(newState);
    },

    getInitialState: function(){
        return {
            pageContents: this.props.pageContents
        };
    },

    getDefaultProps: function () {
        return {
            onSubmitStep: null,
            onBackStep: null
        };
    },

    render: function () {

        var rows = [];
        if(this.state.pageContents){
            _.forOwn(this.state.pageContents, function(value, prop){
                rows.push(
                    <tr key={'tableRow' + prop}>
                        <td style={{textAlign: "center"}}>
                            <input
                                disabled={value.isIndexPage}
                                type="checkbox"
                                key={'checkBoxItem' + prop}
                                checked={value.checked}
                                value={prop}
                                onChange={this.handleCheckItemChange} />
                        </td>
                        <td style={{width: "50%"}}>
                            {prop}
                        </td>
                        <td style={{textAlign: "center"}}>
                            <input
                                disabled={!value.checked}
                                name="indexPage"
                                type="radio"
                                key={'radioItem' + prop}
                                checked={value.isIndexPage}
                                value={prop}
                                onChange={this.handleRadioItemChange} />

                        </td>
                    </tr>
                );
            }.bind(this));
        }

        return (
            <div style={this.props.formStyle}>
                <h5 style={{marginTop: "1em"}} className="text-center">Select pages for static content</h5>
                <div style={{marginTop: "1em", padding: "0 20px 0 20px", maxHeight: "400px", overflow: "auto"}}>
                    <table className="table" style={{width: '100%'}}>
                        <tr>
                            <th className="text-center">Include</th>
                            <th className="text-center">Page name</th>
                            <th className="text-center">Index page</th>
                        </tr>
                        {rows}
                    </table>
                </div>
                <div style={{display: 'table', textAlign: 'center', width: '100%', marginTop: "1em"}}>
                    <Button bsStyle='primary' onClick={this.handleSubmitStep}>Next</Button>
                </div>
            </div>
        );
    }

});

module.exports = FormPageList;
