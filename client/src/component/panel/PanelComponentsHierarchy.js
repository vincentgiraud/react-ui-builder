'use strict';

var _ = require('lodash');
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var React = require('react');
var DeskAction = require('../../action/desk/DeskActions.js');
var PanelComponentsHierarchyStore = require('../../store/panel/PanelComponentsHierarchyStore.js');
var PanelComponentsHierarchyActions = require('../../action/panel/PanelComponentsHierarchyActions.js');
var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var OverlayTreeviewItemPaste = require('../desk/OverlayTreeviewItemPaste.js');
var OverlayTreeviewItem = require('../desk/OverlayTreeviewItem.js');
var PanelComponentHierarchyItem = require('../panel/PanelComponentHierarchyItem.js');
var PanelComponentHierarchyTextItem = require('../panel/PanelComponentHierarchyTextItem.js');

var scrollToSelected = function($frameWindow){
    setTimeout((function(_frameWindow){
        return function(){
            var $selected = _frameWindow.find(".bg-info");
            if($selected && $selected.length > 0){
                var diff = ($selected.offset().top + _frameWindow.scrollTop()) - _frameWindow.offset().top;
                var margin = parseInt(_frameWindow.css("height"))/5;
                //_frameWindow[0].scrollTop = (diff - margin);
                //console.log("Scroll to " + (diff - margin));
                _frameWindow.animate(
                    { scrollTop: (diff - margin) },
                    300
                );
                diff = null;
                margin = null;
            }
            $selected = null;
        }
    })($frameWindow), 0);

};

var PanelComponentsHierarchy = React.createClass({

    getInitialState: function () {
        return PanelComponentsHierarchyStore.getModel();
    },

    onModelChange: function (model) {
        this.setState(model);
    },

    componentDidMount: function () {
        this.unsubscribe = PanelComponentsHierarchyStore.listen(this.onModelChange);
        PanelComponentsHierarchyActions.setFrameWindow(React.findDOMNode(this));
        this.$frameWindow = $(React.findDOMNode(this));
        scrollToSelected(this.$frameWindow);
    },

    componentDidUpdate: function(){
        if(this.state.selectedUmyId){
            scrollToSelected(this.$frameWindow);
        }
    },

    componentWillUnmount: function () {
        this.unsubscribe();
        this.$frameWindow = null;
    },

    render: function () {

        var style = {
            //display: this.props.displayStyle,
            padding: '2em 1em 1em 1em',
            height: '100%',
            overflow: 'auto'
            //border: '1px solid #ffffff'
        };

        //
        var pageModel = this.state.currentPageModel;
        var self = this;
        var listItems = [];
        if(pageModel){
            if (pageModel.props){
                _.forOwn(pageModel.props, function(value, prop){
                    if(_.isObject(value) && value.type){
                        listItems.push(self._buildNode(value));
                    }
                });
            }
            if (pageModel.children) {
                _.map(pageModel.children, function (child) {
                    listItems.push(self._buildNode(child));
                });
            }
        }

        //
        return (
            <div style={style}>
                <Button bsSize='xsmall'
                        style={
                            {padding: '0.2em', position: 'absolute', top: '-1.5em', left: '1em', width: '2em', height: '2em', zIndex: '1030'}
                        } onClick={DeskAction.toggleComponentsHierarchy}>
                    <span className='fa fa-times fa-fw'></span>
                </Button>
                <ul className='umy-treeview-list' style={{border: 0}}>
                    {listItems}
                </ul>
            </div>
        );
    },

    _buildNode: function (rootItem) {
        var self = this;
        var inner = [];
        if (rootItem.text) {
            var text = rootItem.text;
            if (text && text.length > 150) {
                text = text.substr(0, 150) + " [...]";
            }
            inner.push(
                <PanelComponentHierarchyTextItem umyid={rootItem.props['data-umyid']}
                                                 key={'text' + rootItem.props['data-umyid']}
                                                 textValue={text} />
            )
        }
        var innerProps = [];
        if (rootItem.props){
            _.forOwn(rootItem.props, function(value, prop){
                if(_.isObject(value) && value.type){
                    innerProps.push(self._buildNode(value));
                }
            });
        }
        var children = [];
        if (rootItem.children && rootItem.children.length > 0) {
            _.map(rootItem.children, function (child) {
                children.push(self._buildNode(child));
            });
        }
        if(innerProps.length > 0 || children.length > 0){
            inner.push(
                <ul key={'list' + rootItem.props['data-umyid']} className='umy-treeview-list'>
                    {innerProps}
                    {children}
                </ul>
            );
        }

        return (
            <PanelComponentHierarchyItem
                key={'listitem' + rootItem.props['data-umyid']}
                componentName={rootItem.componentName}
                selected={this.state.selectedUmyId}
                umyid={rootItem.props['data-umyid']}
                copyMark={this.state.copyMarkUmyId}
                cutMark={this.state.cutMarkUmyId}
                type={rootItem.type}

                clipboardActive={this.state.clipboardActive}>
                {inner}
            </PanelComponentHierarchyItem>
        );
    }

});

module.exports = PanelComponentsHierarchy;
