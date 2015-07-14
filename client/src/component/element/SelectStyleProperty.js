'use strict';

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Select = require('react-select');

var SelectStyleProperty = React.createClass({

    getInitialState: function(){
        return {
            isDisabled: this.props.value ? false : true
        }
    },

    getDefaultProps: function(){
        return {
            label: 'Label',
            listValue: [
                {value: 'one', label: 'One'},
                {value: 'two', label: 'Two'}
            ]
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
                this._handleChange(this.props.listValue[0].value);
            }
        } else {
            this.setState({
                isDisabled: !this.state.isDisabled
            });
        }
    },

    _handleChange: function(val){
        if(this.props.onChangeValue){
            this.props.onChangeValue({
                target: {
                    name: this.props.label,
                    value: val
                }
            });
        }
    },

    render: function() {
        var _value = this.props.value;
        if(this.state.isDisabled){
            _value = '';
        }
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
                            <Select options={this.props.listValue}
                                    clearable={false}
                                    disabled={this.state.isDisabled}
                                    value={_value}
                                    onChange={this._handleChange}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = SelectStyleProperty;
