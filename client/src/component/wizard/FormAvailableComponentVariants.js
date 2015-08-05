'use strict';

var _ = require('underscore');
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
var SidePanel = require('../element/SidePanel.js');
var PopoverComponentVariantActions = require('../../action/element/PopoverComponentVariantActions.js');

var FormAvailableComponentVariants = React.createClass({

    _handleClick: function(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.props.onSubmitStep){
            var index = e.currentTarget.attributes['data-index'].value;
            this.props.onSubmitStep({
                index: index
            });
        }
    },

    _handleCancel: function(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.props.onCancelStep){
            this.props.onCancelStep();
        }
    },

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

    _handlePreview: function(e){
        e.preventDefault();
        e.stopPropagation();
        var index = parseInt(e.currentTarget.attributes['data-index'].value);
        var $variantListItemElement = $(React.findDOMNode(this.refs['variantListItem' + index]));
        var offset = $variantListItemElement.offset();
        var outerWidth = $variantListItemElement.outerWidth();
        //ModalVariantsTriggerActions.showModal(this.props.componentId, this.props.defaults, this.props.defaultsIndex);
        //PanelAvailableComponentsActions.selectComponentItemDefaultsIndex(
        //    this.props.componentId,
        //    index,
        //    {showPreview: true, top: offset.top, left: offset.left, outerWidth: outerWidth}
        //);
    },

    _getListItem: function(options){
        var defaultItemClass = '';
        var labelElement = null;
        if(options.index === this.props.defaultsIndex){
            defaultItemClass = 'text-primary';
            labelElement = (
                <strong>{options.label}</strong>
            );
        } else {
            defaultItemClass = 'text-muted';
            labelElement = (
                <span>{options.label}</span>
            );
        }
        return (
            <li key={'variantListItem' + options.index}
                ref={'variantListItem' + options.index}
                style={{position: 'relative'}}
                className={defaultItemClass}>
                <p onClick={this._handleClick}
                   style={{cursor: 'pointer', margin: '0', padding: '3px', width: 'calc(100% - 2em)'}}
                   data-index={options.index}>
                    {labelElement}
                </p>
                <div style={{position: "absolute", padding: "2px", top: "0", right: "0.3em", cursor: 'pointer', width: '1.5em', height: '1.5em'}}
                     onClick={this._handlePreview}
                     data-index={options.index}>
                    <span className='fa fa-external-link'></span>
                </div>
            </li>
        );

    },

    getInitialState: function(){
        return {
        }
    },

    componentDidMount: function () {
        $(React.findDOMNode(this)).find('.panel-body').remove();
    },

    componentWillUpdate: function(nextProps, nextState){
        PopoverComponentVariantActions.hide();
    },

    componentDidUpdate: function(){
        $(React.findDOMNode(this)).find('.panel-body').remove();
    },

    render: function(){
        var panelStyle = {
            position: 'relative',
            height: '30em',
            overflow: 'auto'
        };

        var variantList = null;
        if(this.props.defaults && this.props.defaults.length > 0){
            var _filter = this.state.filter ? this.state.filter.toUpperCase() : null;
            var variantListItems = [];
            this.props.defaults.map(function(variant, index){
                var label = variant.variantName ? variant.variantName : ('Variant #' + index);
                if(_filter){
                    if(label.toUpperCase().indexOf(_filter) >= 0){
                        variantListItems.push(
                            this._getListItem({
                                label: label,
                                index: index
                            })
                        );
                    }
                } else {
                    variantListItems.push(
                        this._getListItem({
                            label: label,
                            index: index
                        })
                    );
                }
            }.bind(this));
            variantList = (
                <ul className='list-unstyled'>
                    {variantListItems}
                </ul>
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
                    buttonBefore={
                        <Button onClick={this._handleCancel}
                                bsStyle={ 'default'}>
                            <span>Back</span>
                        </Button>
                    }
                    buttonAfter={
                        <Button onClick={this._handleClearFind}
                                bsStyle={ 'default'}>
                            <span className={ 'fa fa-times'}></span>
                        </Button>
                    }/>

                <SidePanel style={panelStyle}>
                    {variantList}
                </SidePanel>
            </div>
        );
    }

});

module.exports = FormAvailableComponentVariants;
