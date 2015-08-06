'use strict';

var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Panel = ReactBootstrap.Panel;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;
var Badge = ReactBootstrap.Badge;
var PanelGroup = ReactBootstrap.PanelGroup;
var Input = ReactBootstrap.Input;

var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var PanelAvailableComponentsActions = require('../../action/panel/PanelAvailableComponentsActions.js');
var PanelAvailableComponentsStore = require('../../store/panel/PanelAvailableComponentsStore.js');
var Repository = require('../../api/Repository.js');
var PanelAvailableComponentItem = require('./PanelAvailableComponentItem.js');
var PopoverComponentVariantActions = require('../../action/element/PopoverComponentVariantActions.js');

var PanelAvailableComponents = React.createClass({


    _handleChangeFind: function(e){
        var value = this.refs.inputElement.getValue();
        var newState = {
            filter: value
        };
        this.setState(newState);
    },

    _handleClearFind: function(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({ filter: '' });
    },

    _getGroupItem: function(options){
        return (
            <PanelAvailableComponentItem key={'item' + options.componentId + options.counter}
                                         defaultsIndex={this.state.defaultsIndex}
                                         defaults={this.state.componentDefaults}
                                         componentId={options.componentId}
                                         selected={this.state.selectedComponentId === options.componentId}
                                         componentName={options.componentId}/>
        );
    },

    getInitialState: function () {
        return PanelAvailableComponentsStore.getModel();
    },

    onModelChange: function (model) {
        this.setState(model);
    },

    componentDidMount: function () {
        this.unsubscribe = PanelAvailableComponentsStore.listen(this.onModelChange);
        $(React.findDOMNode(this)).find('.panel-body').remove();
    },

    componentDidUpdate: function(){
        $(React.findDOMNode(this)).find('.panel-body').remove();
    },

    componentWillUpdate: function(nextProps, nextState){
        PopoverComponentVariantActions.hide();
    },

    componentWillUnmount: function () {
        this.unsubscribe();
    },

    render: function(){
        var style = {
            position: 'relative',
            width: '100%'
        };

        var componentTreeModel = this.state.itemsTree;
        var libGroups = [];
        var groupHeaderKey = 0;
        var componentsWithNoGroup = [];
        var counter = 0;
        var _filter = this.state.filter ? this.state.filter.toUpperCase() : null;
        _.forOwn(componentTreeModel, function(group, groupName){
            if(_.isObject(group)){
                var components = [];
                _.forOwn(group, function(componentTypeValue, componentId){
                    if(_filter){
                        if(componentId.toUpperCase().indexOf(_filter) >= 0){
                            components.push(
                                this._getGroupItem({
                                    counter: counter,
                                    componentId: componentId
                                })
                            );
                        }
                    } else {
                        components.push(
                            this._getGroupItem({
                                counter: counter,
                                componentId: componentId
                            })
                        );
                    }

                }.bind(this));
                var key = '' + ++groupHeaderKey;
                if(components.length > 0){
                    var keySuffix = _filter ? '12' : '0';
                    libGroups.push(
                        <Panel collapsible={!_filter}
                               header={groupName}
                               eventKey={key}
                               key={'group' + groupName + counter + keySuffix}>
                            <ListGroup fill>
                                {components}
                            </ListGroup>
                            <div style={{height: '0'}}></div>
                        </Panel>
                    );
                }
            } else {
                //console.log("This filter state: " + this.state.filter);
                if(_filter){
                    if(groupName.toUpperCase().indexOf(_filter) >= 0){
                        componentsWithNoGroup.push(
                            this._getGroupItem({
                                counter: counter,
                                componentId: groupName
                            })
                        );
                    }
                } else {
                    componentsWithNoGroup.push(
                        this._getGroupItem({
                            counter: counter,
                            componentId: groupName
                        })
                    );
                }
            }
            counter++;
        }.bind(this));
        if(componentsWithNoGroup.length > 0){
            libGroups.push(
                <div style={{marginTop: '0.3em'}} key={'groupWithNoGroup' + counter}>
                    <ListGroup fill>
                        {componentsWithNoGroup}
                    </ListGroup>
                </div>
            );
        }


        return (
            <div style={{overflow: 'hidden', paddingTop: '5px'}}>
                <Input
                    ref='inputElement'
                    type={ 'text'}
                    placeholder={ 'Find...'}
                    value={this.state.filter}
                    onChange={this._handleChangeFind}
                    buttonAfter={ <Button onClick={this._handleClearFind}
                                          bsStyle={ 'default'}>
                                    <span className={ 'fa fa-times'}></span>
                                  </Button>
                                }/>
                <div ref='container' style={style}>
                    <PanelGroup ref='panelGroup'>
                        {libGroups}
                    </PanelGroup>
                </div>
            </div>
        );
    }

});

module.exports = PanelAvailableComponents;
