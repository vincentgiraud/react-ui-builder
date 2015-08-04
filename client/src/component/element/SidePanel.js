'use strict';

var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var PopoverComponentVariantActions = require('../../action/element/PopoverComponentVariantActions.js');

var SidePanel = React.createClass({

    _handleScroll: function(e){
        var domNode = React.findDOMNode(this);
        PopoverComponentVariantActions.scroll({scrollTop: domNode.scrollTop})
    },

    componentDidMount: function () {
        var domNode = React.findDOMNode(this);
        domNode.addEventListener('scroll', this._handleScroll);
        PopoverComponentVariantActions.setupScrollTop({scrollTop: domNode.scrollTop});

    },

    componentDidUpdate: function(){
        var domNode = React.findDOMNode(this);
        PopoverComponentVariantActions.setupScrollTop({scrollTop: domNode.scrollTop});
    },

    componentWillUnmount: function () {
        var domNode = React.findDOMNode(this);
        domNode.removeEventListener('scroll', this._handleScroll);
    },

    render: function() {
        return (
            <div {...this.props}>
                {this.props.children}
            </div>
        );
    }

});

module.exports = SidePanel;

