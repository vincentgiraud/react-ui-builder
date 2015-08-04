'use strict';

var React = require('react');
var PopoverComponentVariantStore = require('../../store/element/PopoverComponentVariantStore.js');
var PopoverComponentVariantActions = require('../../action/element/PopoverComponentVariantActions.js');
var ReactBootstrap = require('react-bootstrap');

var PopoverComponentVariant = React.createClass({

    getInitialState: function() {
        return PopoverComponentVariantStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentDidMount: function() {
        this.unsubscribe = PopoverComponentVariantStore.listen(this.onModelChange);
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },

    _handleProbeEvent: function(e) {
        e.stopPropagation();
        PopoverComponentVariantActions.probeAction();
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
            top: 'calc(' + parseInt(this.state.top) + 'px - 50px)',
            left: left + 'px'
        };
        var popoverArrowStyle = {
            position: 'absolute',
            top: '50px'
        };
        return (
            <div className='popover right' style={popoverStyle}>
                <div className='arrow' style={popoverArrowStyle}></div>
                <h3 className='popover-title'>Popover for variant</h3>
                <div className='popover-content'>
                    <div style={{width: '300px', height: '300px'}}>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = PopoverComponentVariant;