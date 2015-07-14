'use strict';

var React = require('react');

var ReactBootstrap = require('react-bootstrap');

var unitsList = ['px', 'em', '%'];

var VerticalSpinnerStyleProperty = React.createClass({

    _handleIncrement: function (e) {
        e.stopPropagation();
        e.preventDefault();
        var f = function (){
            var value = this.state.inputValue ? this.state.inputValue : 0;
            this.setState({
                inputValue: (value + this.props.stepValue)
            });
        }.bind(this);
        f();
        this._mouseDownIntervalPid = setInterval(f, 150);
    },

    _handleDecrement: function (e) {
        e.stopPropagation();
        e.preventDefault();
        var f = function (){
            var value = this.state.inputValue ? this.state.inputValue : 0;
            this.setState({
                inputValue: (value - this.props.stepValue)
            });
        }.bind(this);
        f();
        this._mouseDownIntervalPid = setInterval(f, 150);
    },

    _handleChangeInputValue: function (e) {
        var value = React.findDOMNode(this.refs.inputElement).value;
        if (value && value.length > 0) {
            value = value.replace(/,/, '.');
            var checkChar = value.charAt(value.length - 1);
            if(checkChar !== '.' && checkChar !== '0'){
                value = parseFloat(value);
                if(!value){
                    value = 0;
                }
            }
        } else {
            value = null;
        }
        this.setState({
            inputValue: value
        });
    },

    _handleChangeUnits: function(e){
        e.stopPropagation();
        e.preventDefault();
        this._handleChange(this.state.inputValue, e.currentTarget.text);
    },

    _handleBlur: function(){
        if(this._mouseDownIntervalPid){
            clearInterval(this._mouseDownIntervalPid);
        }
        this._handleChange(this.state.inputValue, this.state.units);
    },

    _handleChange: function(inputValue, units){
        if(this.props.onChangeValue){
            this.props.onChangeValue({
                target: {
                    name: this.props.label,
                    value: (inputValue + units)
                }
            });
        }
    },

    _handleOnKeyDown: function(e){
        if(e.keyCode == 13 || e.keyCode == 27){
            this._handleBlur();
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
                this._handleChange(5, unitsList[0]);
            }
        } else {
            this.setState({
                isDisabled: !this.state.isDisabled
            });
        }
    },

    getInitialState: function () {
        var inputUnit = 'px';
        var inputValue = null;
        var isDisabled = true;
        if(this.props.inputValue){
            unitsList.map(function(unit){
                if(this.props.inputValue.indexOf(unit.toLowerCase()) >= 0){
                    inputUnit = unit;
                }
            }.bind(this));
            inputValue = parseFloat(this.props.inputValue);
            isDisabled = false;
        }
        return {
            inputValue: inputValue,
            units: inputUnit,
            isDisabled: isDisabled
        }
    },

    getDefaultProps: function () {
        return {
            inputValue: null,
            stepValue: 1,
            label: 'Style value'
        };
    },

    render: function () {

        var unitsMenu = [];
        unitsList.map(function(item, i){
            unitsMenu.push(<li key={'unitsMenuOption' + i}><a href="#" onClick={this._handleChangeUnits}>{item}</a></li>);
        }.bind(this));

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
                        <div style={{display: 'table-cell', width: '90%', paddingLeft: '15px', paddingRight: '15px'}}>
                            <div className="input-group">
                                <div className="input-group-btn">
                                    <button className="btn btn-default btn-xs"
                                            type="button"
                                            disabled={this.state.isDisabled}
                                            onMouseDown={this._handleIncrement}
                                            onMouseUp={this._handleBlur}>
                                        <span className="fa fa-plus"></span>
                                    </button>
                                    <button className="btn btn-default btn-xs"
                                            type="button"
                                            disabled={this.state.isDisabled}
                                            onMouseDown={this._handleDecrement}
                                            onMouseUp={this._handleBlur}>
                                        <span className="fa fa-minus"></span>
                                    </button>
                                </div>
                                <input ref="inputElement"
                                       type="text"
                                       disabled={this.state.isDisabled}
                                       className="form-control"
                                       value={this.state.inputValue}
                                       style={{textAlign: 'right', height: '1.85em', paddingTop: '2px', paddingBottom: '2px'}}
                                       onChange={this._handleChangeInputValue}
                                       onKeyDown={this._handleOnKeyDown}
                                       onBlur={this._handleBlur}/>

                                <div className="input-group-btn">
                                    <button
                                        type="button"
                                        disabled={this.state.isDisabled}
                                        className="btn btn-default btn-xs dropdown-toggle"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        id="dropdownMenu">
                                        {this.state.units}
                                        <span className="fa fa-caret-down fa-fw"></span>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="dropdownMenu">
                                        {unitsMenu}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = VerticalSpinnerStyleProperty;