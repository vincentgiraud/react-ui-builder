'use strict';

var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;


var ProjectDescriptionInput = React.createClass({

    getInitialState: function(){
        return {
            value: this.props.value
        }
    },

    getDefaultProps: function() {
        return {
            type: 'textarea',
            //hasFeedback: true,
            placeholder: 'Enter description',
            label: 'Project project description:',
            help: 'More than 20 characters, less than 500'
        };
    },

    _validationStateValue: function(){
        if(this.state.value
            && this.state.value.length >= 20
            && this.state.value.length <= 500){
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
            <Input {...this.props}
                ref='input'
                bsStyle={this._validationStateValue()}
                value={this.state.value}
                onChange={this._handleValueChange}/>
        );
    }

});

module.exports = ProjectDescriptionInput;
