'use strict';

var _ = require('underscore');
var React = require('react');
var DeskPageFrameActions = require('../action/DeskPageFrameActions.js');
var OverlayTreeviewItemPaste = require('./OverlayTreeviewItemPaste.js');
var OverlayTreeviewItem = require('./OverlayTreeviewItem.js');
var ContentEditable = require('./element/ContentEditable.js');
var PanelComponentsHierarchyActions = require('../action/PanelComponentsHierarchyActions.js');

var PanelComponentHierarchyTextItem = React.createClass({

    _handleTextClick: function(e){
        e.preventDefault();
        e.stopPropagation();
        DeskPageFrameActions.deselectComponent();
        DeskPageFrameActions.selectComponentById(this.props.umyid);
        this.setState({
            isEditable: true
        });
    },

    _handleBlur: function(e){
        //e.currentTarget.value;
        //console.log('New text value: ' + e.target.value);
        PanelComponentsHierarchyActions.inlineTextSubmit(
            {umyId: this.props.umyid, textValue: e.target.value}
        );
        this.setState({
            isEditable: false
        });
    },

    _handleChange: function(e){
        this.setState({
            textValue: e.target.value
        });
    },

    getInitialState: function(){
        return {
            textValue: this.props.textValue,
            isEditable: false
        }
    },

    componentDidMount: function(){
        if(this.state.isEditable === true){
            $(React.findDOMNode(this)).focus();
        }
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            textValue: nextProps.textValue
        });
    },

    render: function(){

        var content = null;
        if(this.state.isEditable === true){
            content = (
                <span className='text-muted' style={{position: 'relative'}}>
                    {this.props.textValue}
                    <ContentEditable onChange={this._handleChange}
                                     onBlur={this._handleBlur}
                                     html={this.state.textValue}/>
                </span>
            );
        } else {
            content = (
                <span className='text-muted' onClick={this._handleTextClick}>
                    {this.props.textValue}
                </span>
            );
        }

        return content;
    }


});

module.exports = PanelComponentHierarchyTextItem;


