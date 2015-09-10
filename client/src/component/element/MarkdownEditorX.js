
'use strict';

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
//var markdown = require('markdown').markdown;
var marked = require('marked');
var Panel = ReactBootstrap.Panel;
var TabbedArea = ReactBootstrap.TabbedArea;
var TabPane = ReactBootstrap.TabPane;
var AceEditor = require('../element/AceEditor.js');

var MarkdownEditorX = React.createClass({

    getInitialState: function(){

        return {
            htmlContent: marked(this.props.markdownSource),
            key: 0
        };
    },

    //componentDidMount: function(){
    //    React.findDOMNode(this.refs.iframe).srcdoc = this.state.htmlContent;
    //},
    //
    //componentDidUpdate: function(){
    //    React.findDOMNode(this.refs.iframe).srcdoc = this.state.htmlContent;
    //},

    handleSelect: function(key){
        this.setState({ key: key });
    },

    handleMarkdownChange: function(markdownSource){
        if(this.props.onMarkdownChange){
            if(this.refs.editor){
                this.props.onMarkdownChange(this.refs.editor.getSourceCode());
            }
        }
        var htmlContent = marked(markdownSource);
        this.setState({
            htmlContent: htmlContent
        })
    },

    getMarkdownSource: function(){
        return this.refs.editor.getSourceCode();
    },

    render: function() {
        //var style = _.extend({}, ...this.props.style, )
        //var iframeStyle = {
        //    "height" : "500px",
        //    //"height" : "100%",
        //    "width" : "100%",
        //    "minWidth" : "320px",
        //    "margin" : "0",
        //    "padding" : "0",
        //    "border" : "1px solid #000000"
        //};
        //<iframe ref='iframe' seamless={true} frameBorder="0" style={iframeStyle} />
        var editorStyle = {
            height: this.props.editorHeight || '500px',
            width: '100%'
        };
        var previewStyle = {
            height: this.props.previewHeight || '100%',
            overflow: 'auto'
        };

        return (
            <TabbedArea activeKey={this.state.key} onSelect={this.handleSelect} style={this.props.style}>
                <TabPane tab={ 'Preview' }
                         style={ { padding: '0.5em'} }
                         eventKey={ 0 }>
                    <Panel>
                        <div style={previewStyle} dangerouslySetInnerHTML={{__html: this.state.htmlContent}}>
                        </div>
                    </Panel>
                </TabPane>
                <TabPane tab={ 'Editor' }
                         style={ { padding: '0.5em'} }
                         eventKey={ 1 }>
                    <AceEditor
                        ref='editor'
                        sourceName={this.props.sourceName}
                        onChangeText={this.handleMarkdownChange}
                        mode='ace/mode/markdown'
                        style={ editorStyle }
                        sourceCode={ this.props.markdownSource } />
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
                    <p>
                        <span>Also support of </span>
                                <span>
                                    <a href='https://help.github.com/articles/github-flavored-markdown/'
                                       target='blank'>
                                        GFM
                                    </a>
                                </span>
                    </p>
                </TabPane>
            </TabbedArea>
        );
    }
});

module.exports = MarkdownEditorX;
