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
var Popover = ReactBootstrap.Popover;

var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var PanelAvailableComponentsActions = require('../../action/panel/PanelAvailableComponentsActions.js');
var PanelAvailableComponentsStore = require('../../store/panel/PanelAvailableComponentsStore.js');
var ModalVariantsTriggerActions = require('../../action/modal/ModalVariantsTriggerActions.js');
var Repository = require('../../api/Repository.js');
var CollapsibleLabel = require('../element/CollapsibleLabel.js');
var PopoverComponentVariantActions = require('../../action/element/PopoverComponentVariantActions.js');

var PanelAvailableComponentItem = React.createClass({

    _handleClick: function(){
        PanelAvailableComponentsActions.selectComponentItem(this.props.componentId);
    },

    _handlePreview: function(e){
        e.preventDefault();
        e.stopPropagation();
        var index = parseInt(e.currentTarget.attributes['data-index'].value);
        var $variantListItemElement = $(React.findDOMNode(this.refs['variantListItem' + index]));
        var offset = $variantListItemElement.offset();
        var outerWidth = $variantListItemElement.outerWidth();
        //ModalVariantsTriggerActions.showModal(this.props.componentId, this.props.defaults, this.props.defaultsIndex);
        PanelAvailableComponentsActions.selectComponentItemDefaultsIndex(
            this.props.componentId,
            index,
            {showPreview: true, top: offset.top, left: offset.left, outerWidth: outerWidth}
        );
    },

    _handleDefaultIndexSelect: function(e){
        e.stopPropagation();
        e.preventDefault();
        PanelAvailableComponentsActions.selectComponentItemDefaultsIndex(
            this.props.componentId,
            parseInt(e.currentTarget.attributes['data-index'].value),
            {showPreview: false}
        );
        //ModalVariantsTriggerActions.selectDefaultsIndex(parseInt(e.currentTarget.attributes['data-index'].value));
    },

    componentWillUpdate: function(nextProps, nextState){
        PopoverComponentVariantActions.hide();
    },

    render: function(){

        if(this.props.selected){

            var variantList = null;
            var variantName = null;
            if(this.props.defaults && this.props.defaults.length > 0){

                var variantListItems = [];
                var defaultItemClass = '';
                var labelElement = null;
                this.props.defaults.map(function(variant, index){
                    var label = variant.variantName ? variant.variantName : ('Variant #' + index);
                    if(index === this.props.defaultsIndex){
                        defaultItemClass = 'text-primary';
                        labelElement = (
                            <strong>{label}</strong>
                        );
                        variantName = label;
                    } else {
                        defaultItemClass = 'text-muted';
                        labelElement = (
                            <span>{label}</span>
                        );
                    }
                    variantListItems.push(
                        <li key={'variantListItem' + index} ref={'variantListItem' + index} style={{position: 'relative'}} className={defaultItemClass}>
                            <p onClick={this._handleDefaultIndexSelect}
                               style={{cursor: 'pointer', margin: '0', padding: '3px', width: 'calc(100% - 2em)'}}
                               data-index={index}>
                                {labelElement}
                            </p>
                            <div style={{position: "absolute", padding: "2px", top: "0", right: "0.3em", cursor: 'pointer', width: '1.5em', height: '1.5em'}}
                                 onClick={this._handlePreview}
                                 data-index={index}>
                                <span className='fa fa-external-link'></span>
                            </div>
                        </li>
                    );
                }.bind(this));
                variantList = (
                    <ul className='list-unstyled'>
                        {variantListItems}
                    </ul>
                );
            }
            var titleComponentName = this.props.componentName;
            if(titleComponentName.length > 13){
                titleComponentName = titleComponentName.substr(0, 13) + '...';
            }
            return (
                <ListGroupItem header={titleComponentName}>
                    <hr style={{marginTop: '0', marginBottom: '0'}}/>
                    <p>{variantName}</p>
                    {/*variantSelectorElement*/}
                    <CollapsibleLabel title='More variants ...' onToggle={PopoverComponentVariantActions.hide}>
                        {variantList}
                    </CollapsibleLabel>
                </ListGroupItem>
            );
        } else {
            var componentName = this.props.componentName;
            if(componentName.length > 20){
                componentName = componentName.substr(0, 20) + '...';
            }
            return (
                <ListGroupItem style={{cursor: 'pointer'}} onClick={this._handleClick}>
                    <span>{componentName}</span>
                </ListGroupItem>
            );
        }
    }

});

module.exports = PanelAvailableComponentItem;
