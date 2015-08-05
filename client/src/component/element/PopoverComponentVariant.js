'use strict';

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var PopoverComponentVariantStore = require('../../store/element/PopoverComponentVariantStore.js');
var PopoverComponentVariantActions = require('../../action/element/PopoverComponentVariantActions.js');
var Repository = require('../../api/Repository.js');
var VariantFrame = require('./VariantFrame.js');
var PanelAvailableComponentsActions = require('../../action/panel/PanelAvailableComponentsActions.js');

var PopoverComponentVariant = React.createClass({

    _handleRemoveClick: function(e){
        e.stopPropagation();
        e.preventDefault();
        PanelAvailableComponentsActions.deleteDefaultsIndex(this.state.defaultsIndex);
    },

    _handleCloseClick: function(e){
        e.stopPropagation();
        e.preventDefault();
        PopoverComponentVariantActions.hide();
    },

    _handleWindowChanges: function(e){
        PopoverComponentVariantActions.hide();
    },

    getInitialState: function() {
        return PopoverComponentVariantStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentDidMount: function() {
        this.unsubscribe = PopoverComponentVariantStore.listen(this.onModelChange);
        window.addEventListener("resize", this._handleWindowChanges);
        window.addEventListener("scroll", this._handleWindowChanges);
    },

    componentWillUnmount: function() {
        this.unsubscribe();
        window.removeEventListener("resize", this._handleWindowChanges);
        window.removeEventListener("scroll", this._handleWindowChanges);
    },

    getDefaultProps: function() {
        return {};
    },

    render: function() {
        if(!this.state.isShown){
            return (<span></span>);
        }
        var left = parseInt(this.state.left) + parseInt(this.state.outerWidth);
        var popoverStyle = {
            maxWidth: '800px',
            display: 'block',
            top: 'calc(' + parseInt(this.state.top) + 'px - 70px)',
            left: left + 'px'
        };
        var popoverArrowStyle = {
            position: 'absolute',
            top: 'calc(70px + 0.5em)'
        };
        var iframeStyle = {
            "height" : "250px",
            //"height" : "100%",
            "width" : "450px",
            //"minWidth" : "320px",
            "margin" : "0",
            "padding" : "0"
            //"border" : "1px solid #000000"
        };
        var pageFrameSrc = Repository.getHtmlForDesk();

        var label = this.state.defaults.variantName ? this.state.defaults.variantName : ('Variant #' + this.state.defaultsIndex);

        var deleteButton = null;
        if(this.state.canDelete){
            deleteButton = (
                <button className='btn btn-danger btn-xs'
                        style={{marginRight: '1em'}}
                        role='button'
                        type='button'
                        onClick={this._handleRemoveClick}>
                    <span className='fa fa-trash-o fa-fw'></span>
                </button>
            );
        }

        return (
            <div className='popover right' style={popoverStyle}>
                <div className='arrow' style={popoverArrowStyle}></div>
                <h3 style={{position: 'relative', height: '3em'}} className='popover-title'>
                    {deleteButton}
                    {label}
                    <button className='btn btn-default btn-xs pull-right'
                            role='button'
                            type='button'
                            onClick={this._handleCloseClick}>
                        <span className='fa fa-times fa-fw'></span>
                    </button>
                </h3>
                <div className='popover-content'>
                    <div style={{padding: '0.5em'}}>
                        <VariantFrame
                            frameBorder="0"
                            style={iframeStyle}
                            src={pageFrameSrc}
                            templatePageModel={this.state.templatePageModel}/>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = PopoverComponentVariant;