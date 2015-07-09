'use strict';

var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;


var InputValue = React.createClass({

    getInitialState: function(){
        return {
            value: this.props.value
        }
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
                value={this.state.value}
                onChange={this._handleValueChange}/>
        );
    }

});

module.exports = InputValue;
