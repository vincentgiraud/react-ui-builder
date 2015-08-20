'use strict';

var _ = require('lodash');
var validator = require('validator');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var Button = ReactBootstrap.Button;
var Alert = ReactBootstrap.Alert;

var FormDirName = React.createClass({


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
                dirName: this.state.dirName
            });
        }
    },

    validateDirName: function () {
        if (this.state.dirName
            && this.state.dirName.length > 0
            && validator.isAlphanumeric(this.state.dirName)) {
            //
            return 'has-success';
        }
        return 'has-error';
    },

    handleDirNameChange: function () {
        var dirName = React.findDOMNode(this.refs.dirNameInput).value;
        var newState = {
            dirName: dirName
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
            dirName: ''
        };
    },

    componentDidMount: function(){
        React.findDOMNode(this.refs.dirNameInput).focus();
    },

    render: function () {
        return (
            <div style={this.props.formStyle}>
                <h5 style={{marginTop: "1em"}} className="text-center">Enter folder name where static content will be stored</h5>
                <table style={{width: '100%', marginTop: "1em"}}>
                    <tr>
                        <td style={{width: '20%'}}></td>
                        <td>
                            <div className={'form-group ' + this.validateDirName()}>
                                <input id='dirNameElement'
                                       ref='dirNameInput'
                                       className="form-control input-sm"
                                       type="text"
                                       placeholder='Enter folder name'
                                       value={this.state.dirName}
                                       onChange={this.handleDirNameChange}
                                    />
                                <p className="text-muted" style={{marginTop: '0.5em'}}>Folder is relative to the project root</p>
                            </div>


                        </td>
                        <td style={{width: '20%'}}></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <Alert bsStyle="warning">
                                <p className="text-center">
                                    Please note, if the folder exists its content will be
                                    erased.
                                </p>
                            </Alert>
                        </td>
                        <td></td>
                    </tr>
                </table>
                <div style={{display: 'table', textAlign: 'center', width: '100%', marginTop: "1em"}}>
                    <Button bsStyle='default' onClick={this._handleBackStep}>Back</Button>
                    <Button bsStyle='primary' onClick={this._handleSubmitStep}>Generate</Button>
                </div>
            </div>
        );
    }

});

module.exports = FormDirName;
