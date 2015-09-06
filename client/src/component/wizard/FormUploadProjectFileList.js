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

var FormUploadProjectFileList = React.createClass({


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
                files: this.state.dataList
            });
        }
    },

    handleItemChange: function(e){
        var newState = {
            dataList: this.state.dataList
        };
        newState.dataList[e.currentTarget.value].checked = e.currentTarget.checked;
        this.setState(newState);
    },

    getDefaultProps: function () {
        return {
            onSubmitStep: null,
            onBackStep: null
        };
    },


    getInitialState: function () {
        return {
            dataList: this.props.dataList
        };
    },

    render: function () {
        return (
            <div style={this.props.formStyle}>
                <table style={{width: '100%'}}>
                    <tr>
                        <td style={{width: '20%'}}></td>
                        <td>
                            <h4 className="text-center">Select files to upload</h4>
                            <div style={{height: '324px', overflow: 'auto'}}>
                                {this.state.dataList.map(function(item, index){
                                    var label = null;
                                    if(item.isDirectory){
                                        label = <div><span className='fa fa-folder fa-fw'></span>&nbsp;&nbsp;<strong>{item.name}</strong></div>;
                                    } else {
                                        label = <div><span className='fa fa-file-o fa-fw'></span>&nbsp;&nbsp;{item.name}</div>;
                                    }
                                    return (
                                        <Input
                                            type="checkbox"
                                            key={'checkBoxItem' + index}
                                            checked={item.checked}
                                            label={label}
                                            value={index}
                                            disabled={item.mandatory}
                                            onChange={this.handleItemChange} />
                                    );
                                }.bind(this))}
                            </div>

                        </td>
                        <td style={{width: '20%'}}></td>
                    </tr>
                </table>
                <div style={{display: 'table', textAlign: 'center', width: '100%', marginTop: '2em'}}>
                    <Button bsStyle='default' onClick={this.handleBackStep}>Back</Button>
                    <Button bsStyle='primary' onClick={this.handleSubmitStep}>Upload project</Button>
                </div>
            </div>
        );
    }

});

module.exports = FormUploadProjectFileList;
