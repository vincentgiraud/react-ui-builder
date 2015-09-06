'use strict';

var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Collapse = ReactBootstrap.Collapse;

var CollapsibleHorizontalDivider = React.createClass({

    _handleToggle(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({open: !this.state.open});
    },

    getInitialState: function(){
        return {};
    },

    render(){
        var caretClassName = 'fa fa-fw text-muted';
        if(this.state.open === true){
            caretClassName += ' fa-caret-down';
        } else {
            caretClassName += ' fa-caret-right';
        }
        return (
            <div {...this.props}>
                <div style={{position: 'relative', width: '100%', height: '0', borderBottom: '1px solid #dddddd', margin: '1em 0 1em 0'}}>
                    <span
                        style={{position: 'absolute', top: '-0.5em', left: '0'}}
                        className={caretClassName}>
                    </span>
                    <span
                        style={{position: 'absolute', top: '-0.7em', left: '1.3em', padding: '0 .5em 0 0', cursor: 'pointer'}}
                        className='text-muted' onClick={this._handleToggle}>
                        {this.props.title}
                    </span>
                </div>
                <Collapse in={this.state.open}>
                    <div ref='panel' style={{padding: '0', marginTop: '0'}}>
                        {this.props.children}
                    </div>
                </Collapse>
            </div>
        );
    }

});

module.exports = CollapsibleHorizontalDivider;

