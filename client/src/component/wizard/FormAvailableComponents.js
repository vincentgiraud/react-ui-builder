'use strict';

var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;
var Badge = ReactBootstrap.Badge;
var PanelGroup = ReactBootstrap.PanelGroup;

var Repository = require('../../api/Repository.js');
var FormAvailableComponentsActions = require('../../action/wizard/FormAvailableComponentsActions.js');
var FormAvailableComponentsStore = require('../../store/wizard/FormAvailableComponentsStore.js');

var FormAvailableComponents = React.createClass({

    _handleClick: function(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.props.onCommitStep){
            var componentId = e.currentTarget.attributes['data-component-id'].value;
            this.props.onCommitStep({
                componentId: componentId
            });
        }
    },

    _handleChangeFind: function(e){
        FormAvailableComponentsActions.setFilter(this.refs.inputElement.getValue());
    },

    _handleClearFind: function(e){
        e.preventDefault();
        e.stopPropagation();
        FormAvailableComponentsActions.setFilter('');
    },

    _handleVariantsClick: function(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.props.onSubmitStep){
            var componentId = e.currentTarget.attributes['data-component-id'].value;
            this.props.onSubmitStep({
                componentId: componentId
            });
        }
    },

    _createListItem: function(componentId, counter){
        var componentName = componentId;
        if(componentName.length > 20){
            componentName = componentName.substr(0, 20) + '...';
        }
        return (
            <ListGroupItem key={'item' + componentId + counter}
                           style={{position: 'relative', cursor: 'pointer'}}
                           data-component-id={componentId}
                           onClick={this._handleClick}>
                <span>{componentName}</span>
                <Button bsSize='xsmall'
                        bsStyle='default'
                        data-component-id={componentId}
                        onClick={this._handleVariantsClick}
                        style={{position: 'absolute', right: '1em', top: '0.5em'}}>
                    Variants...
                </Button>
            </ListGroupItem>
        );

    },

    componentDidMount: function () {
        this.unsubscribe = FormAvailableComponentsStore.listen(this.onModelChange);
        $(React.findDOMNode(this)).find('.panel-body').remove();
        var input = this.refs.inputElement.getInputDOMNode();
        var len = input.value ? input.value.length : 0;
        input.focus();
        input.setSelectionRange(len, len);
    },

    componentDidUpdate: function(){
        $(React.findDOMNode(this)).find('.panel-body').remove();
    },

    getInitialState: function(){
        return FormAvailableComponentsStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },

    render: function(){
        var panelStyle = {
            position: 'relative',
            height: '30em',
            overflow: 'auto'
        };

        var componentTreeModel = this.props.itemsTree;
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
                                this._createListItem(componentId, counter)
                            );
                        }
                    } else {
                        components.push(
                            this._createListItem(componentId, counter)
                        );
                    }
                }.bind(this));
                var key = '' + ++groupHeaderKey;
                if(components.length > 0){
                    libGroups.push(
                        <Panel collapsible={false} header={groupName} eventKey={key} key={'group' + groupName + counter}>
                            <ListGroup fill>
                                {components}
                            </ListGroup>
                            <div style={{height: '0'}}></div>
                        </Panel>
                    );
                }
            } else {
                if(_filter){
                    if(groupName.toUpperCase().indexOf(_filter) >= 0) {
                        componentsWithNoGroup.push(
                            this._createListItem(groupName, counter)
                        );
                    }
                } else {
                    componentsWithNoGroup.push(
                        this._createListItem(groupName, counter)
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
            <div style={{overflow: 'hidden', padding: '0.5em'}}>
                <Input
                    ref='inputElement'
                    type={ 'text'}
                    value={this.state.filter}
                    placeholder={ 'Find...'}
                    onChange={this._handleChangeFind}
                    buttonAfter={ <Button onClick={this._handleClearFind}
                                          bsStyle={ 'default'}>
                                    <span className={ 'fa fa-times'}></span>
                                  </Button>
                                }/>

                <div ref='container' style={panelStyle}>
                    <PanelGroup ref='panelGroup'>
                        {libGroups}
                    </PanelGroup>
                </div>
            </div>
        );
    }

});

module.exports = FormAvailableComponents;
