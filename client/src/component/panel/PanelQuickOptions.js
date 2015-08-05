'use strict';

var _ = require('underscore');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var PanelQuickOptionsStore = require('../../store/panel/PanelQuickOptionsStore.js');
var PanelQuickOptionsActions = require('../../action/panel/PanelQuickOptionsActions.js');
var StylePanel = require('./StylePanel.js');

var Panel = ReactBootstrap.Panel;
var PanelGroup = ReactBootstrap.PanelGroup;

var StyleGroups = {
    positionStyle: {
        title: 'Position & Size',
        array: []
    },
    displayStyle: {
        title: 'Display',
        array: []
    },
    marginStyle:{
        title: 'Margin',
        array: []
    },
    paddingStyle:{
        title: 'Padding',
        array: []
    },
    borderStyle:{
        title: 'Border',
        array: []
    }
};

var StyleOptionsGroupMapping = {
    position: {
        group: 'positionStyle',
        type: 'list',
        listValue:[
            {value: 'relative', label: 'relative'},
            {value: 'absolute', label: 'absolute'},
            {value: 'static', label: 'static'},
            {value: 'fixed', label: 'fixed'},
            {value: 'sticky', label: 'sticky'}
        ]
    },
    display: {
        group: 'displayStyle',
        type: 'list',
        listValue:[
            {value: 'block', label: 'block'},
            {value: 'inline', label: 'inline'},
            {value: 'contents', label: 'contents'},
            {value: 'list-item', label: 'list-item'},
            {value: 'inline-block', label: 'inline-block'},
            {value: 'inline-table', label: 'inline-table'},
            {value: 'table', label: 'table'},
            {value: 'table-cell', label: 'table-cell'},
            {value: 'table-column', label: 'table-column'},
            {value: 'table-column-group', label: 'table-column-group'},
            {value: 'table-footer-group', label: 'table-footer-group'},
            {value: 'table-header-group', label: 'table-header-group'},
            {value: 'table-row', label: 'table-row'},
            {value: 'table-row-group', label: 'table-row-group'},
            {value: 'flex', label: 'flex'},
            {value: 'inline-flex', label: 'inline-flex'},
            {value: 'grid', label: 'grid'},
            {value: 'inline-grid', label: 'inline-grid'}
        ]
    },
    float: {
        group: 'displayStyle',
        type: 'list',
        listValue: [
            {value: 'left', label: 'left'},
            {value: 'right', label: 'right'},
            {value: 'none', label: 'none'}
        ]
    },
    color: {
        group: 'displayStyle',
        type: 'color'
    },
    backgroundColor: {
        group: 'displayStyle',
        type: 'color'
    },
    top: {
        group: 'positionStyle',
        type: 'digital'
    },
    left: {
        group: 'positionStyle',
        type: 'digital'
    },
    bottom: {
        group: 'positionStyle',
        type: 'digital'
    },
    right: {
        group: 'positionStyle',
        type: 'digital'
    },
    width: {
        group: 'positionStyle',
        type: 'digital'
    },
    height: {
        group: 'positionStyle',
        type: 'digital'
    },
    margin: {
        group: 'marginStyle',
        type: 'digital'
    },
    marginTop: {
        group: 'marginStyle',
        type: 'digital'
    },
    marginBottom: {
        group: 'marginStyle',
        type: 'digital'
    },
    marginLeft: {
        group: 'marginStyle',
        type: 'digital'
    },
    marginRight: {
        group: 'marginStyle',
        type: 'digital'
    },
    padding: {
        group: 'paddingStyle',
        type: 'digital'
    },
    paddingTop: {
        group: 'paddingStyle',
        type: 'digital'
    },
    paddingBottom: {
        group: 'paddingStyle',
        type: 'digital'
    },
    paddingLeft: {
        group: 'paddingStyle',
        type: 'digital'
    },
    paddingRight: {
        group: 'paddingStyle',
        type: 'digital'
    },
    borderWidth:{
        group: 'borderStyle',
        type: 'digital'
    },
    borderStyle: {
        group: 'borderStyle',
        type: 'list',
        listValue:[
            {value: 'solid', label: 'solid'},
            {value: 'dotted', label: 'dotted'},
            {value: 'dashed', label: 'dashed'},
            {value: 'double', label: 'double'},
            {value: 'groove', label: 'groove'},
            {value: 'ridge', label: 'ridge'},
            {value: 'inset', label: 'inset'},
            {value: 'outset', label: 'outset'}
        ]
    },
    borderColor: {
        group: 'borderStyle',
        type: 'color'
    },
    borderRadius: {
        group: 'borderStyle',
        type: 'digital'
    }
};

var PanelQuickOptions = React.createClass({

    _handleStylePanelSelected: function(selectedKey){
        PanelQuickOptionsActions.setActiveLayout({
            activeStylePanel: selectedKey
        });
    },

    getInitialState: function() {
        return PanelQuickOptionsStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentDidMount: function() {
        this.unsubscribe = PanelQuickOptionsStore.listen(this.onModelChange);
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },

    getDefaultProps: function() {
        return {};
    },

    render: function() {
        var style = {
            width: '100%',
            paddingTop: '5px',
            paddingRight: '5px'
        };
        var panelContent = null;
        if(this.state.props){

            var propsStyle = this.state.props.style;
            // clear all groups
            _.mapObject(StyleGroups, function(value, prop){
                StyleGroups[prop].array = [];
            });
            // setup groups with existing values

            _.mapObject(StyleOptionsGroupMapping, function(value, prop){
                var group = StyleGroups[value.group].array;
                var cssProperty = {
                    name: prop,
                    value: propsStyle ? propsStyle[prop] : null,
                    type: value.type,
                    listValue: value.listValue
                };
                group.push(cssProperty);
            });
            var stylePanels = [];
            var eventKey = 1;
            _.mapObject(StyleGroups, function(value, prop){
                stylePanels.push(
                    <StylePanel key={'stylePanel' + eventKey}
                                header={StyleGroups[prop].title}
                                styleProps={StyleGroups[prop].array}
                                split={StyleGroups[prop].split}
                                activeStylePane={this.state.activeStylePane}
                                eventKey={eventKey++}/>
                );
            }.bind(this));
            panelContent = (
                <div style={style}>
                    <PanelGroup accordion={true}
                                defaultActiveKey={this.state.activeStylePanel}
                                onSelect={this._handleStylePanelSelected}>
                        {stylePanels}
                    </PanelGroup>
                </div>
            );
        } else {
            panelContent = (
                <div style={style}>
                    <h4 className='text-center'>Nothing is selected</h4>
                </div>
            );
        }
        return panelContent;
    }

});

module.exports = PanelQuickOptions;