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
var OverlayTrigger = ReactBootstrap.OverlayTrigger;

var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var PanelAvailableComponentsActions = require('../../action/panel/PanelAvailableComponentsActions.js');
var PanelAvailableComponentsStore = require('../../store/panel/PanelAvailableComponentsStore.js');
var ModalVariantsTriggerActions = require('../../action/modal/ModalVariantsTriggerActions.js');
var Repository = require('../../api/Repository.js');
var CollapsibleHorizontalDivider = require('../element/CollapsibleHorizontalDivider.js');

var PanelAvailableComponentItem = React.createClass({

    _handleClick: function(){
        PanelAvailableComponentsActions.selectComponentItem(this.props.componentId);
    },

    _handlePreview: function(e){
        e.preventDefault();
        e.stopPropagation();
        ModalVariantsTriggerActions.showModal(this.props.componentId, this.props.defaults, this.props.defaultsIndex);
    },

    _handleDefaultIndexSelect: function(e){
        e.stopPropagation();
        e.preventDefault();
        PanelAvailableComponentsActions.selectComponentItemDefaultsIndex(
            this.props.componentId,
            parseInt(e.currentTarget.attributes['data-index'].value)
        );
        //ModalVariantsTriggerActions.selectDefaultsIndex(parseInt(e.currentTarget.attributes['data-index'].value));
    },

    render: function(){

        if(this.props.selected){
            var variantSelectorElement = null;
            var variantList = null;
            if(this.props.defaults && this.props.defaults.length > 1){
                variantSelectorElement = (
                    <a key={1} href='#' onClick={this._handlePreview}>Select variant</a>
                );
                var variantListItems = [];
                this.props.defaults.map(function(variant, index){
                    var style = {
                        width: '100%', position: 'relative', marginBottom: '3px', 'padding': '0.3em'
                    };
                    if(index === this.props.defaultsIndex){
                        style.border = '1px solid #000000';
                        style.borderRadius = '3px';

                    }
                    var label = variant.variantName ? variant.variantName : ('Variant #' + index);
                    var iFrame = <iframe src="http://umyproto.com" frameborder="0" style={{width: '100px', height: '100px'}}></iframe>
                    variantListItems.push(
                        <li style={style}>
                            <div style={{width: '10em'}}>
                                <p onClick={this._handleDefaultIndexSelect} style={{cursor: 'pointer'}} data-index={index}>
                                    {label}
                                </p>
                            </div>
                            <OverlayTrigger trigger='focus' placement='right' overlay={<Popover title='Popover bottom'>{iFrame}</Popover>}>
                                <small style={{position: 'absolute', right: '0.3em', top: '0.3em'}} className='fa fa-gears text-muted'></small>
                            </OverlayTrigger>
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
                    {/*variantSelectorElement*/}
                    <CollapsibleHorizontalDivider title='VariantList'>
                        {variantList}
                    </CollapsibleHorizontalDivider>
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
