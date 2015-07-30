'use strict';

var _ = require('underscore');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Panel = ReactBootstrap.Panel;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;
var Badge = ReactBootstrap.Badge;
var PanelGroup = ReactBootstrap.PanelGroup;

var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var PanelAvailableComponentsActions = require('../../action/panel/PanelAvailableComponentsActions.js');
var PanelAvailableComponentsStore = require('../../store/panel/PanelAvailableComponentsStore.js');
var ModalVariantsTriggerActions = require('../../action/modal/ModalVariantsTriggerActions.js');
var Repository = require('../../api/Repository.js');
var PanelAvailableComponentItem = require('./PanelAvailableComponentItem.js');

var PanelAvailableComponents = React.createClass({

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

    componentWillUnmount: function () {
        this.unsubscribe();
    },

    render: function(){
        var style = {
            paddingTop: '5px',
            //display: this.props.displayStyle,
            width: '100%',
            overflowY: 'auto',
            overflowX: 'hidden'
        };

        var self = this;
        var componentTreeModel = this.state.itemsTree;
        var libGroups = [];
        var groupHeaderKey = 0;
        var componentsWithNoGroup = [];
        var counter = 0;
        _.mapObject(componentTreeModel, function(group, groupName){
            if(_.isObject(group)){
                var components = [];
                _.mapObject(group, function(componentTypeValue, componentId){
                    components.push(
                        <PanelAvailableComponentItem key={'item' + componentId + counter}
                            defaultsIndex={self.state.defaultsIndex}
                            defaults={self.state.componentDefaults}
                            componentId={componentId}
                            selected={self.state.selectedComponentId === componentId}
                            componentName={componentId}/>
                    );
                });
                var key = '' + ++groupHeaderKey;
                libGroups.push(
                    <Panel collapsible header={groupName} eventKey={key} key={'group' + groupName + counter}>
                        <ListGroup fill>
                            {components}
                        </ListGroup>
                        <div style={{height: '0'}}></div>
                    </Panel>
                );
            } else {
                componentsWithNoGroup.push(
                    <PanelAvailableComponentItem key={'item' + groupName + counter}
                        defaultsIndex={self.state.defaultsIndex}
                        defaults={self.state.componentDefaults}
                        componentId={groupName}
                        selected={self.state.selectedComponentId === groupName}
                        componentName={groupName}/>
                );
            }
            counter++;
        });
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
            <div style={style}>
                <PanelGroup>
                    {libGroups}
                </PanelGroup>
            </div>
        );
    }

});

module.exports = PanelAvailableComponents;
