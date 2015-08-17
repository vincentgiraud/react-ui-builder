
'use strict';

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var markdown = require('markdown').markdown;
var Panel = ReactBootstrap.Panel;
var TabbedArea = ReactBootstrap.TabbedArea;
var TabPane = ReactBootstrap.TabPane;
var AceEditor = require('../element/AceEditor.js');

var MarkdownEditorX = React.createClass({

    getInitialState: function(){

        return {
            htmlContent: markdown.toHTML(this.props.markdownSource),
            key: 0
        };
    },

    handleSelect: function(key){
        this.setState({ key: key });
    },

    handleMarkdownChange: function(markdownSource){
        if(this.props.onMarkdownChange){
            if(this.refs.editor){
                this.props.onMarkdownChange(this.refs.editor.getSourceCode());
            }
        }
        var htmlContent = markdown.toHTML(markdownSource);
        this.setState({
            htmlContent: htmlContent
        })
    },

    render: function() {
        //var style = _.extend({}, ...this.props.style, )
        return (
            <TabbedArea activeKey={this.state.key} onSelect={this.handleSelect} style={this.props.style}>
                <TabPane tab={ 'Preview' }
                         style={ { padding: '0.5em'} }
                         eventKey={ 0 }>
                    <div dangerouslySetInnerHTML={{__html: this.state.htmlContent}}>
                    </div>
                </TabPane>
                <TabPane tab={ 'Editor' }
                         style={ { padding: '0.5em'} }
                         eventKey={ 1 }>
                    <AceEditor
                        ref='editor'
                        sourceName={this.props.sourceName}
                        onChangeText={this.handleMarkdownChange}
                        mode='ace/mode/markdown'
                        style={{height: '500px', width: '100%'}}
                        sourceCode={this.props.markdownSource} />
                    <hr/>
                    <p style={{marginTop: '1em'}}>
                        <span>A quick reference of </span>
                                <span>
                                    <a href='http://markdown-guide.readthedocs.org/en/latest/basics.html'
                                       target='blank'>
                                        Markdown Basics
                                    </a>
                                </span>
                    </p>
                </TabPane>
            </TabbedArea>
        );
    }
});

module.exports = MarkdownEditorX;
