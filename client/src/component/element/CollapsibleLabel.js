'use strict';

var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Collapse = ReactBootstrap.Collapse;

var CollapsibleLabel = React.createClass({

    _handleToggle(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.props.onToggle){
            this.props.onToggle();
        }
        this.setState({open: !this.state.open});
    },

    getInitialState: function(){
        return {};
    },

    getDefaultProps: function(){
        return {
            onToggle: null
        }
    },

    render(){
        var caretClassName = 'fa text-muted';
        if(this.state.open === true){
            caretClassName += ' fa-caret-down';
        } else {
            caretClassName += ' fa-caret-right';
        }
        return (
            <div style={{position: 'relative'}}>
                <div className={caretClassName}
                     style={{position: "absolute", padding: "2px", top: "0", left: "-1em", cursor: 'pointer', width: '1.5em', height: '1.5em'}}>
                </div>
                <p style={{cursor: 'pointer'}} className='text-muted' onClick={this._handleToggle}>
                    <span>
                        {this.props.title}
                    </span>
                </p>
                <Collapse in={this.state.open}>
                    <div ref='panel' style={{padding: '0', marginTop: '0'}}>
                        {this.props.children}
                    </div>
                </Collapse>
            </div>
        );
    }

});

module.exports = CollapsibleLabel;

