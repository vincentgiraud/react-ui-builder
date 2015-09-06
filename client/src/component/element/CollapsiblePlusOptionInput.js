'use strict';

var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Collapse = ReactBootstrap.Collapse;
var Panel = ReactBootstrap.Panel;

var CollapsiblePlusOptionInput = React.createClass({

    _handleToggle(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.props.onToggle){
            this.props.onToggle();
        }
        this.setState({open: !this.state.open});
    },

    handleCommit: function(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.props.onCommit){
            this.props.onCommit({
                path: React.findDOMNode(this.refs.inputPath).value,
                value: React.findDOMNode(this.refs.inputValue).value
            });
        }
    },


    handleOnKeyDown: function(e){
        if(e.keyCode == 27){
            this._handleToggle(e);
        } else if (e.keyCode == 13){
            this.handleCommit(e);
        }
    },

    getInitialState: function(){
        return {};
    },

    getDefaultProps: function(){
        return {
            onToggle: null
        }
    },

    componentDidUpdate: function(){
        if(this.state.open){
            React.findDOMNode(this.refs.inputPath).focus();
        }
    },

    render(){

        var addInputStyle = {
            height: '1.55em',
            paddingTop: '2px',
            paddingBottom: '2px',
            marginBottom: '0.5em'
        };

        return (
            <div {...this.props}>
                <div style={{ display: 'table', width: '100%' }}>
                    <div style={{ display: 'table-row' }}>
                        <div style={{ display: 'table-cell', textAlign: 'center'}}>
                            <button
                                role='button'
                                className='btn btn-default btn-xs' onClick={this._handleToggle}>
                                <span className='fa fa-plus'></span>
                            </button>
                        </div>
                    </div>
                </div>

                <Collapse in={this.state.open}>
                    <div style={{position: 'relative'}}>
                        <Panel>
                            <p>Property path</p>
                            <input ref="inputPath"
                                   placeholder="prop[.prop]"
                                   type="text"
                                   className="form-control"
                                   style={addInputStyle}
                                   onKeyDown={this.handleOnKeyDown}/>
                            <p>Property value</p>
                            <input ref="inputValue"
                                   type="text"
                                   className="form-control"
                                   style={addInputStyle}
                                   onKeyDown={this.handleOnKeyDown}/>
                            <button
                                role='button'
                                className='btn btn-default btn-xs btn-block'
                                onClick={this.handleCommit}>
                                <span>Add</span>
                            </button>
                        </Panel>
                    </div>
                </Collapse>
            </div>
        );
    }

});

module.exports = CollapsiblePlusOptionInput;

