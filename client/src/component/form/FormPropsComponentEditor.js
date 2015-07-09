'use strict';

var validator = require('validator');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;

var DeskPageFrameActions = require('../../action/DeskPageFrameActions.js');
var AceEditor = require('../element/AceEditor.js');

var FormPropsComponentEditor = React.createClass({

    render: function(){
        var containerStyle={
            marginTop: '1em',
            width: '100%'
        };
        return (
            <div className='container-fluid' style={containerStyle}>
                <div className='row' style={{marginBottom: '3px'}}>
                    <div className='col-xs-2'>
                        <div className="dropdown">
                            <button className="btn btn-default btn-xs dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="true">
                                <span className="fa fa-gear fa-fw"></span>
                                <span className="fa fa-caret-down fa-fw"></span>
                            </button>
                            <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">
                                <li role="presentation">
                                    <a role="menuitem" href="#" onClick={this.props.handleSaveOptionsVariant}>
                                        Save as new variant for component
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='col-xs-10'>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-12'>
                        <AceEditor ref='editor'
                                   style={{height: '400px', width: '100%'}}
                                   sourceCode={this.props.propsScript}/>
                    </div>
                </div>
            </div>
        );
    },

    getPropsScript: function(){
        return this.refs.editor.getSourceCode();
    }

});

module.exports = FormPropsComponentEditor;
