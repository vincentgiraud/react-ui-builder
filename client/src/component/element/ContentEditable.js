'use strict';

var React = require('react');

var ContentEditable = React.createClass({

    _emitChange: function(){

        var html = React.findDOMNode(this).innerHTML;
        if (this.props.onChange && html !== this.lastHtml) {
            this.props.onChange({
                target: {
                    value: html
                }
            });
        }
        this.lastHtml = html;

    },

    _handleOnBlur: function(){
        if(this.props.onBlur){
            this.props.onBlur({
                target: {
                    value: this.lastHtml
                }
            })
        }
    },

    _handleOnKeyDown: function(e){
        if(e.keyCode == 13 || e.keyCode == 27){
            this._handleOnBlur();
        }
    },

    shouldComponentUpdate: function(nextProps){
        return nextProps.html !== React.findDOMNode(this).innerHTML;
    },

    componentDidUpdate: function() {
        var node = React.findDOMNode(this);
        if ( this.props.html !== node.innerHTML ) {
            node.innerHTML = this.props.html;
        }
    },

    componentDidMount: function(){
        $(React.findDOMNode(this)).focus();
    },

    render: function(){
        return (
            <span className='umy-grid-text-editable'
                  onInput={this._emitChange}
                  onBlur={this._handleOnBlur}
                  onKeyDown={this._handleOnKeyDown}
                  contentEditable
                  dangerouslySetInnerHTML={{__html: this.props.html}}>
            </span>
        );
    }

});

module.exports = ContentEditable;
