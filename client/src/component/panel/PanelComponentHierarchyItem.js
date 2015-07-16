'use strict';

var _ = require('underscore');
var React = require('react');
var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var OverlayTreeviewItemPaste = require('../desk/OverlayTreeviewItemPaste.js');
var OverlayTreeviewItem = require('../desk/OverlayTreeviewItem.js');

var PanelComponentHierarchyItem = React.createClass({

    render: function(){

        var overlay = null;
        if(this.props.selected === this.props.umyid){
            if(this.props.clipboardActive){
                overlay = <OverlayTreeviewItemPaste />
            } else {
                overlay = <OverlayTreeviewItem domNodeId={this.props.umyid} />
            }
        }

        var content = null;

        var className = 'umy-treeview-list-item' + (this.props.selected === this.props.umyid ? ' bg-info' : '');
        if(this.props.copyMark === this.props.umyid){
            className += ' umy-grid-basic-border-copy';
        }
        if(this.props.cutMark === this.props.umyid){
            className += ' umy-grid-basic-border-cut';
        }
        //
        var linkClassName = '';
        var label = this.props.type;
        //
        if(this.props.children && this.props.children.length > 0){
            content = (
                <li className={className}>
                    {overlay}
                    <a key={'toplink'} className={linkClassName} href='#' onClick={this._handleClick}>
                        <span>{'<' + label + '>'}</span>
                    </a>
                    {this.props.children}
                    <a key={'bottomlink'} className={linkClassName} href='#' onClick={this._handleClick}>
                        <span>{'</' + label + '>'}</span>
                    </a>
                </li>
            );
        } else {
            content = (
                <li className={className}>
                    {overlay}
                    <a  className={linkClassName} href='#' onClick={this._handleClick}>
                        <span>{'<' + label + '/>'}</span>
                    </a>
                </li>
            );
        }

        return content;
    },

    _handleClick: function(e){
        e.preventDefault();
        e.stopPropagation();
        DeskPageFrameActions.deselectComponent();
        DeskPageFrameActions.selectComponentById(this.props.umyid);
    }

});

module.exports = PanelComponentHierarchyItem;


