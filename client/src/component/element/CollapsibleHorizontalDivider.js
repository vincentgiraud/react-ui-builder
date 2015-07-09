'use strict';

var classNames = require('classnames');
var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var CollapsibleMixin = ReactBootstrap.CollapsibleMixin;


var CollapsibleHorizontalDivider = React.createClass({

    mixins: [CollapsibleMixin],

    getCollapsibleDOMNode(){
        return React.findDOMNode(this.refs.panel);
    },

    getCollapsibleDimensionValue(){
        return React.findDOMNode(this.refs.panel).scrollHeight;
    },

    onHandleToggle(e){
        e.preventDefault();
        this.setState({expanded:!this.state.expanded});
    },

    render(){
        var styles = this.getCollapsibleClassSet();
        var caretClassName = 'fa fa-fw text-muted';
        if(this.isExpanded()){
            caretClassName += ' fa-caret-down';
        } else {
            caretClassName += ' fa-caret-right';
        }
        return (
            <div {...this.props}>
                <div style={{position: 'relative', width: '100%', height: '0', borderBottom: '1px solid #dddddd', margin: '1em 0 1em 0'}}>
                    <span
                        style={{position: 'absolute', top: '-0.5em', left: '0', backgroundColor: '#ffffff'}}
                        className={caretClassName}>
                    </span>
                    <span
                        style={{position: 'absolute', top: '-0.7em', left: '1.3em', padding: '0 .5em 0 0', backgroundColor: '#ffffff', cursor: 'pointer'}}
                        className='text-muted' onClick={this.onHandleToggle}>
                        {this.props.title}
                    </span>
                </div>
                <div ref='panel' style={{padding: '0', marginTop: '0'}} className={classNames(styles)}>
                    {this.props.children}
                </div>
            </div>
        );
    }

});

module.exports = CollapsibleHorizontalDivider;

