'use strict';

var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Colorpicker = require('./Colorpicker.js');

var ColorpickerStyleProperty = React.createClass({

    _handleChange: function(e){
        if(this.props.onChangeValue){
            this.props.onChangeValue({
                target: {
                    name: this.props.label,
                    value: e.target.value
                }
            });
        }
    },

    _handleDisabled: function(e){
        e.stopPropagation();
        if(this.props.onRemoveValue){
            if(!this.state.isDisabled){
                this.props.onRemoveValue({
                    target: {
                        name: this.props.label
                    }
                })
            } else {
                this._handleChange({target:{value:'#ffffff'}});
            }
        } else {
            this.setState({
                isDisabled: !this.state.isDisabled
            });
        }
    },

    getDefaultProps: function () {
        return {
            colorValue: null,
            label: 'Color'
        };
    },

    getInitialState: function () {
        var isDisabled = this.props.colorValue ? false : true;
        return {
            colorValue: this.props.colorValue,
            isDisabled: isDisabled
        }
    },

    render: function () {
        return (
            <div {...this.props}>
                <p style={{marginBottom: '3px'}}>{this.props.label}</p>
                <div style={{display: 'table', width: '100%'}}>
                    <div style={{display: 'table-row'}}>
                        <div style={{display: 'table-cell', width: '10%', textAlign: 'left', verticalAlign: 'middle'}}>
                            <input type='checkbox'
                                   style={{margin: '0'}}
                                   checked={!this.state.isDisabled}
                                   onChange={this._handleDisabled} />
                        </div>
                        <div style={{display: 'table-cell', width: '80%', paddingLeft: '15px', paddingRight: '15px'}}>
                            <Colorpicker disabled={this.state.isDisabled}
                                         onChangeValue={this._handleChange}
                                         colorValue={this.state.colorValue}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = ColorpickerStyleProperty;