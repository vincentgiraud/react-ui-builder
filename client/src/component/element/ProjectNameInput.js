'use strict';

var React = require('react');
var validator = require('validator');

var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;


var ProjectNameInput = React.createClass({

    getInitialState: function(){
        return {
            value: this.props.value
        }
    },

    getDefaultProps: function() {
        return {
            type: 'text',
            //hasFeedback: true,
            placeholder: 'Enter project name',
            label: 'Project name:',
            help: 'More than 5 characters, less than 50'
        };
    },

    componentWillReceiveProps(nextProps){
        this.setState({
            value: nextProps.value
        })
    },

    _validationStateValue: function(){
        if(this.state.value
            && this.state.value.length >= 5
            && this.state.value.length <= 50
            && validator.isAlphanumeric(this.state.value)){
            //
            return 'success';
        }
        return 'error';
    },

    _handleValueChange: function(){
        var value = this.refs.input.getValue();
        var newState = {
            value: value
        };
        this.setState(newState);
    },

    getValue: function(){
        return this.refs.input.getValue();
    },

    render: function() {
        return (
            <Input ref='input' {...this.props}
                bsStyle={this._validationStateValue()}
                value={this.state.value}
                onChange={this._handleValueChange}/>
        );
    }

});

module.exports = ProjectNameInput;
