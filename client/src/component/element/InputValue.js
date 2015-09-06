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

    componentWillReceiveProps: function(nextProps){
        this.setState({
            value: nextProps.value
        });
    },

    _handleChange: function(){
        var value = this.refs.input.getValue();
        var newState = {
            value: value
        };
        this.setState(newState);
    },

    _handleOnBlur: function(){
        if(this.props.onChangeValue){
            this.props.onChangeValue({
                target: {
                    name: this.props.label,
                    value: this.state.value
                }
            });
        }
    },

    getValue: function(){
        return this.refs.input.getValue();
    },

    render: function() {
        return (
            <Input ref='input' {...this.props}
                value={this.state.value}
                onChange={this._handleChange} onBlur={this._handleOnBlur}/>
        );
    }

});

module.exports = InputValue;
