'use strict';

var React = require('react');
var AceEditor = require('../element/AceEditor.js');

var FormActionsComponentEditor = React.createClass({

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
                                   sourceCode={this.props.actionsSourceCode}/>
                    </div>
                </div>
            </div>
        );
    },

    getActionsScript: function(){
        return this.refs.editor.getSourceCode();
    }

});

module.exports = FormActionsComponentEditor;
