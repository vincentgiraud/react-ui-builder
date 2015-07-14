'use strict';

var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Panel = ReactBootstrap.Panel;
var TabbedArea = ReactBootstrap.TabbedArea;
var TabPane = ReactBootstrap.TabPane;
var SelectStyleProperty = require('../element/SelectStyleProperty.js');
var VerticalSpinnerStyleProperty = require('../element/VerticalSpinnerStyleProperty.js');
var ColorpickerStyleProperty = require('../element/ColorpickerStyleProperty.js');
var DigitalStyleProperty = require('../element/DigitalStyleProperty.js');
var PanelQuickOptionsActions = require('../../action/panel/PanelQuickOptionsActions.js');

var StylePanel = React.createClass({

    _handleChangeStyleProperty: function(e){
        var name = e.target.name;
        var value = e.target.value;
        var newStyle = {};
        newStyle[name] = value;
        PanelQuickOptionsActions.changeStyleOptions(newStyle);
    },

    _handleRemoveProperty: function(e){
        PanelQuickOptionsActions.removeStyleOptions(e.target.name);
    },

    _createListOfElements: function(propertyArray){
        var elements = [];
        propertyArray.map(function(property, index){
            if(property.type === 'digital'){
                elements.push(
                    <VerticalSpinnerStyleProperty key={'styleProperty' + index}
                                     style={{marginTop: '1em'}}
                                     label={property.name}
                                     inputValue={property.value}
                                     onChangeValue={this._handleChangeStyleProperty}
                                     onRemoveValue={this._handleRemoveProperty}/>

                );
                {/*
                 <DigitalStyleProperty style={{marginTop: '1em'}}
                 label={property.name}
                 inputValue={property.value}
                 onChangeValue={this._handleChangeStyleProperty}
                 onRemoveValue={this._handleRemoveProperty}/>
                 */}
            } else if(property.type === 'list') {
                elements.push(
                    <SelectStyleProperty key={'styleProperty' + index}
                                         style={{marginTop: '1em'}}
                                         label={property.name}
                                         value={property.value}
                                         listValue={property.listValue}
                                         onChangeValue={this._handleChangeStyleProperty}
                                         onRemoveValue={this._handleRemoveProperty}/>
                );
            } else if(property.type === 'color') {
                elements.push(
                    <ColorpickerStyleProperty key={'styleProperty' + index}
                                              style={{marginTop: '1em'}}
                                              label={property.name}
                                              colorValue={property.value}
                                              onChangeValue={this._handleChangeStyleProperty}
                                              onRemoveValue={this._handleRemoveProperty}/>
                );
                {/*                    <ColorpickerStyleProperty key={'styleProperty' + index}
                 style={{marginTop: '1em'}}
                 label={property.name}
                 colorValue={property.value}
                 onChangeValue={this._handleChangeStyleProperty}
                 onRemoveValue={this._handleRemoveProperty}/>*/}
            }
        }.bind(this));
        return elements;
    },

    getInitialState: function(){
        return {
            activeStylePane: this.props.activeStylePane
        }
    },

    componentDidMount: function(){
        $(React.findDOMNode(this)).find('.panel-body').css({
            'padding': '5px'
        });
    },

    render: function() {
        this.properties = [];
        if(this.props.styleProps){
            this.props.styleProps.map(function(item, index){
                this.properties.push(item);
            }.bind(this));
        }
        return (
            <Panel {...this.props}>
                <div style={{ padding: '0.5em 0.5em 1.5em 0.5em' }}>
                    {this._createListOfElements(this.properties)}
                </div>
            </Panel>
        );
    }

});

module.exports = StylePanel;