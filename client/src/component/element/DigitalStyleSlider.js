'use strict';

var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;


var DigitalStyleSlider = React.createClass({

    _handleChange: function(e){
        if(this.props.onChangeValue){
            this.props.onChangeValue({
                target: {
                    value: e.value
                }
            });
        }
    },

    _createSlider: function(){
        var value = parseFloat(this.props.value);
        var min = value - 50;
        var max = value + 50;
        var showTooltip = this.props.disabled ? 'hide' : 'show';
        this.$slider = $(React.findDOMNode(this.refs.digitalSlider)).slider({
            max: max,
            min: min,
            step: 1,
            enabled: !this.props.disabled,
            tooltip: showTooltip
        });
        this.$slider.slider('setValue', value);
        this.$slider.on('slideStop', this._handleChange);
    },

    _destroySlider: function(){
        if(this.$slider){
            this.$slider.off();
            this.$slider.slider('destroy');
            this.$slider = null;
        }
    },

    getValue: function(){
        if(this.$slider){
            return this.$slider.slider('getValue');
        } else {
            return null;
        }
    },

    componentDidMount: function(){
        this._createSlider();
    },

    componentWillUnmount(){
        this._destroySlider();
    },

    componentDidUpdate(){
        this._destroySlider();
        this._createSlider();
    },

    render: function() {

        return (
            <input type="text" style={{width: '100%'}}
                   ref='digitalSlider'/>
        );
    }

});

module.exports = DigitalStyleSlider;
