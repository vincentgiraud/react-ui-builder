'use strict';

var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;

var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');

var OverlayTreeviewItemPaste = require('../desk/OverlayTreeviewItemPaste.js');
var OverlayTreeviewItem = require('../desk/OverlayTreeviewItem.js');


var PanelComponentHierarchyItem = React.createClass({

    getInitialState: function(){
        return {
            showAddBeforeSelect: false
        };
    },

    handleAddBefore: function(e){
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            showAddBeforeSelect: true
        });
    },

    render: function(){

        //var overlay = null;
        //if(this.props.selected === this.props.umyid){
        //    if(this.props.clipboardActive){
        //        overlay = <OverlayTreeviewItemPaste />
        //    } else {
        //        overlay = <OverlayTreeviewItem domNodeId={this.props.umyid} />
        //    }
        //}

        var content = null;

        var isSelected = this.props.selected === this.props.umyid;
        var isCopyMark = this.props.copyMark === this.props.umyid;
        var isCutMark = this.props.cutMark === this.props.umyid;

        var className = 'umy-treeview-list-item' + (isSelected ? ' bg-info' : '');
        if(isCopyMark){
            className += ' umy-grid-basic-border-copy';
        }
        if(isCutMark){
            className += ' umy-grid-basic-border-cut';
        }
        //
        var linkClassName = '';
        var label = this.props.type;
        //

        if(this.props.children && this.props.children.length > 0){
            content = (
                <li className={className}>
                    {/*overlay*/}
                    <a key={'toplink'} className={linkClassName} href="#" onClick={this._handleClick}>
                        <span>{'<' + label + '>'}</span>
                    </a>
                    {this.props.children}
                    <a key={'bottomlink'} className={linkClassName} href="#" onClick={this._handleClick}>
                        <span>{'</' + label + '>'}</span>
                    </a>
                </li>
            );
        } else {
            content = (
                <li className={className}>
                    {/*overlay*/}
                    <a  className={linkClassName} href="#" onClick={this._handleClick}>
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


