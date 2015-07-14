'use strict';

var React = require('react');

var ReactBootstrap = require('react-bootstrap');


var Colorpicker = React.createClass({


    _handleColorValueChange: function (e) {
        this.setState({
            colorValue: React.findDOMNode(this.refs.colorValueInput).value
        })

    },

    _handleChange: function(e){
        if(this.props.onChangeValue){
            this.props.onChangeValue({
                target: {
                    value: e.value
                }
            });
        }
    },

    _handleKeyDown: function(e){
        if(e.keyCode == 13 || e.keyCode == 27){
            if(this.$colorpicker){
                this._handleChange({value: this.getValue()});
            }
        }
    },

    _handleBlur: function(){
        if(this.$colorpicker){
            this._handleChange({value: this.getValue()});
        }
    },

    _createColorpicker: function(){
        this.$colorpicker = $(React.findDOMNode(this));
        this.$colorpicker.colorpicker()
            .on('hidePicker', function(e){
                this._handleChange({value: this.getValue()});
            }.bind(this));
        if(this.props.disabled){
            this.$colorpicker.colorpicker('disable');
        }
    },

    _destroyColorpicker: function(){
        if (this.$colorpicker) {
            this.$colorpicker.colorpicker('destroy');
        }
    },

    getValue: function(){
        if(this.$colorpicker){
            var value = this.$colorpicker.colorpicker('getValue');
            return value;
        }
        return null;
    },

    getDefaultProps: function () {
        return {
            colorValue: '#ffffff'
        };
    },

    getInitialState: function () {
        return {
            colorValue: this.props.colorValue
        }
    },

    componentDidMount: function () {
        this._createColorpicker();
    },

    componentWillUnmount: function () {
        this._destroyColorpicker();
    },

    componentDidUpdate(){
        this._destroyColorpicker();
        this._createColorpicker();
    },

    render: function () {
        return (
            <div {...this.props}>
                <div className='input-group input-group-sm'>
                    <input
                        ref='colorValueInput'
                        onChange={this._handleColorValueChange}
                        onKeyDown={this._handleKeyDown}
                        onBlur={this._handleBlur}
                        type="text"
                        value={this.state.colorValue}
                        className="form-control"/>
                    <span className="input-group-addon"><i></i></span>
                </div>
            </div>
        );
    }

});

module.exports = Colorpicker;