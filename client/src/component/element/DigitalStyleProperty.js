'use strict';

var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var DigitalStyleSlider = require('./DigitalStyleSlider.js');

var unitsList = ['px', 'em', '%'];

var DigitalStyleProperty = React.createClass({

    getInitialState: function(){
        var inputUnit = 'px';
        var inputValue = 0;
        var isDisabled = true;
        if(this.props.inputValue){
            unitsList.map(function(unit){
                if(this.props.inputValue.indexOf(unit.toLowerCase()) >= 0){
                    inputUnit = unit;
                }
            }.bind(this));
            inputValue = parseFloat(this.props.inputValue);
            if(!inputValue){
                inputValue = 0;
            }
            isDisabled = false;
        }
        return {
            value: inputValue,
            units: inputUnit,
            isDisabled: isDisabled
        };
    },

    _handleChangeUnits: function(e){
        e.stopPropagation();
        e.preventDefault();
        this._handleChange({
            target: {
                name: this.props.label,
                value: (this.state.value + e.currentTarget.text)
            }
        });
        //this.setState({
        //    units: e.currentTarget.text
        //});
    },

    _handleChange: function(e){
        if(this.props.onChangeValue){
            this.props.onChangeValue(e);
        }
    },

    _handleDisabled: function(e){
        e.stopPropagation();
        if(!this.state.isDisabled){
            if(this.props.onRemoveValue){
                this.props.onRemoveValue({
                    target: {
                        name: this.props.label
                    }
                })
            } else {
                this.setState({
                    isDisabled: !this.state.isDisabled
                });
            }
        } else {
            this._handleChange({
                target: {
                    name: this.props.label,
                    value: (this.state.value + this.state.units)
                }
            });
        }
    },

    _handleChangeSlider: function(e){
        this._handleChange({
            target: {
                name: this.props.label,
                value: (e.target.value + this.state.units)
            }
        });
    },

    render: function() {
        var dropDownMenu = null;
        if(!this.state.isDisabled){
            var unitsMenu = [];
            unitsList.map(function(item, i){
                if(item !== this.state.units){
                    unitsMenu.push(
                        <li key={'unitsMenuOption' + i}>
                            <a href="#" onClick={this._handleChangeUnits}>
                                {item}
                            </a>
                        </li>
                    );
                }
            }.bind(this));
            dropDownMenu = (
                <div className={'dropdown'}>
                    <a href='#' className={'dropdown-toggle'} data-toggle='dropdown'>
                        {this.state.value + ' ' + this.state.units}
                        &nbsp;<span className='caret'></span>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-right" role="menu">
                        {unitsMenu}
                    </ul>
                </div>
            );
        }
        return (
            <div {...this.props}>
                <p>{this.props.label}</p>
                <div style={{display: 'table', width: '100%'}}>
                    <div style={{display: 'table-row'}}>
                        <div style={{display: 'table-cell', width: '10%'}}>
                            <input type='checkbox'
                                   style={{margin: '0'}}
                                   checked={!this.state.isDisabled}
                                   onChange={this._handleDisabled} />
                        </div>
                        <div style={{display: 'table-cell', width: '70%', paddingLeft: '15px', paddingRight: '15px'}}>
                            <DigitalStyleSlider disabled={this.state.isDisabled}
                                                value={this.state.value}
                                                onChangeValue={this._handleChangeSlider}/>
                        </div>
                        <div style={{display: 'table-cell', whiteSpace: 'nowrap'}}>
                            {dropDownMenu}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = DigitalStyleProperty;
