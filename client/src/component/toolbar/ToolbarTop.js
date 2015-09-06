'use strict';

var validator = require('validator');
var React = require('react/addons');
var Button = require('react-bootstrap').Button;
var DeskAction = require('../../action/desk/DeskActions.js');
var ToolbarTopActions = require('../../action/toolbar/ToolbarTopActions.js');
var ToolbarTopStore = require('../../store/toolbar/ToolbarTopStore.js');
var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var ModalPageInfoEditorActions = require('../../action/modal/ModalPageInfoEditorActions.js');

var cx = React.addons.classSet;

var ToolbarTop = React.createClass({


    getInitialState: function () {
        return ToolbarTopStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },
    componentDidMount: function() {
        this.unsubscribe = ToolbarTopStore.listen(this.onModelChange);
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },

    render: function(){

        var pagesList = [];
        if(this.state.pages && this.state.pages.length > 0){
            for(var i = 0; i < this.state.pages.length; i++){
                pagesList.push(
                    <li key={'pageMenuItem' + i}>
                        <a onClick={this._handleSwichToPage} data-page-index={this.state.pages[i].pageIndex} href="#">
                            {this.state.pages[i].pageName}
                        </a>
                    </li>
                );
            }
        }
        var clipboardContent = [];
        if(this.state.isAddNewComponentMode){
            clipboardContent.push(
                <div key='clearClipboardButton' style={{display: 'table-cell', verticalAlign: 'middle', paddingLeft: '0.5em'}}>
                    <button className="btn btn-xs btn-warning" onClick={this._handleCancelClick}>
                        <span>Clear clipboard</span>
                    </button>
                </div>
            );
            clipboardContent.push(
                <div key='clipboardLabel' style={{
                                display: 'table-cell',
                                verticalAlign: 'middle',
                                paddingLeft: '0.5em'}}>
                    <span>In clipboard: </span>
                    <kbd>{'<' + this.state.inClipboard + '>'}</kbd>
                </div>
            );
        } else {
            clipboardContent.push(
                <div key='copyPage' style={{display: 'table-cell', verticalAlign: 'middle', paddingLeft: '0.5em'}}>
                    <button className="btn btn-default btn-xs" onClick={this._handleCopyPage}>
                        <span>Copy Page</span>
                    </button>
                </div>
            );
            clipboardContent.push(
                <div key='addPage' style={{display: 'table-cell', verticalAlign: 'middle', paddingLeft: '0.5em'}}>
                    <button className="btn btn-default btn-xs" onClick={this._handleAddNewPage}>
                        <span>Add Page</span>
                    </button>
                </div>
            );
            clipboardContent.push(
                <div key='widthButton' style={{display: 'table-cell', verticalAlign: 'middle', paddingLeft: '0.5em'}}>
                    <div className="btn-group" role="group">
                        <button className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                            Width: {this.state.iframeWidth}&nbsp;&nbsp;
                            <span className="caret"></span>
                            &nbsp;&nbsp;
                        </button>
                        <ul className="dropdown-menu" role="menu">
                            <li>
                                <a href="#" onClick={function(){ ToolbarTopActions.changeIframeWidth({iframeWidth: '100%'}); }}>
                                    100%
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={function(){ ToolbarTopActions.changeIframeWidth({iframeWidth: '1200px'}); }}>
                                    1200px
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={function(){ ToolbarTopActions.changeIframeWidth({iframeWidth: '700px'}); }}>
                                    700px
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={function(){ ToolbarTopActions.changeIframeWidth({iframeWidth: '340px'}); }}>
                                    340px
                                </a>
                            </li>

                        </ul>
                    </div>
                </div>
            );
            clipboardContent.push(
                <div key='undoButton' style={{display: 'table-cell', verticalAlign: 'middle', paddingLeft: '0.5em'}}>
                    <button className="btn btn-default btn-xs" onClick={this._handleUndo}>
                        <span className="fa fa-rotate-left" />
                    </button>
                </div>
            );

        }
        //clipboardContent.push(
        //    <div key='blank' style={{
        //            display: 'table-cell',
        //            verticalAlign: 'middle',
        //            paddingLeft: '0.5em',
        //            width: '40%'}}>
        //    </div>
        //);

        return (
            <div style={this.props.style}>
                <div style={{width: '100%'}}>
                    <div style={{
                    display: 'table',
                    padding: '5px 10px 5px 10px'
                }}>
                        <div style={{display: 'table-row'}}>
                            <div style={{display: 'table-cell', verticalAlign: 'middle'}}>
                                {/*
                                <div className="input-group">
                                <span className="input-group-btn">
                                    <button className="btn btn-default btn-xs" onClick={this._handleDeletePage}>
                                        <span className="fa fa-trash" />
                                    </button>
                                </span>
                                    <input ref='currentPageNameInput' type="text" placeholder="Enter page name" style={{
                                    textAlign: 'center',
                                    minWidth: '7em',
                                    width: '100%',
                                    border: 0,
                                    fontSize: 12,
                                    lineHeight: '1.5',
                                    padding: '2px 5px'
                                }} value={this.state.currentPageName}
                                           onChange={this._handleCurrentPageNameChange} onBlur={this._handleCurrentPageNameOnBlur} />
                                    <div className="input-group-btn">
                                        <button className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                                            <span className="caret" />
                                            &nbsp;&nbsp;
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-right" role="menu">
                                            <li role="presentation" className="dropdown-header">Switch to:</li>
                                            {pagesList}
                                        </ul>
                                    </div>
                                </div>
                                 */}
                                <div className="btn-group" role="group">
                                    <button className="btn btn-default btn-xs" onClick={this._handleDeletePage}>
                                        <span className="fa fa-trash" ></span>
                                    </button>
                                    <button className="btn btn-default btn-xs" onClick={this._handlePageInfoEdit}>
                                        <span>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            {this.state.currentPageName}
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </span>
                                    </button>
                                    <div className="btn-group" role="group">
                                        <button className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                                            &nbsp;&nbsp;
                                            <span className="caret"></span>
                                            &nbsp;&nbsp;
                                        </button>
                                        <ul className="dropdown-menu" role="menu">
                                            <li role="presentation" className="dropdown-header">Switch to:</li>
                                            {pagesList}
                                        </ul>
                                    </div>
                                </div>

                            </div>

                            {/*<div style={{display: 'table-cell', verticalAlign: 'middle', paddingLeft: '0.5em'}}>
                                <button className="btn btn-xs" onClick={this._handleUndo}>
                                    <span className="fa fa-rotate-left" />
                                </button>
                            </div>
                            <div style={{display: 'table-cell', verticalAlign: 'middle', paddingLeft: '0.5em'}}>
                                <button className="btn btn-xs" onClick={this._handleRedo}>
                                    <span className="fa fa-rotate-right" />
                                </button>
                            </div>*/}

                            {clipboardContent}
                        </div>
                    </div>
                </div>
            </div>
        );
        //}

    },

    _handleCurrentPageNameChange: function(e){
        e.stopPropagation();
        e.preventDefault();
        var inputValue = React.findDOMNode(this.refs.currentPageNameInput).value;
        if(!inputValue || inputValue.length == 0){
            this._backupInputValue = this.state.currentPageName;
            ToolbarTopActions.currentPageNameChange(inputValue);
        } else if(validator.isAlphanumeric(inputValue)){
            this._backupInputValue = null;
            var firstChar = inputValue.charAt(0).toUpperCase();
            inputValue = firstChar + inputValue.substr(1);
            ToolbarTopActions.currentPageNameChange(inputValue);
        }
    },

    _handleCurrentPageNameOnBlur: function(e){
        e.stopPropagation();
        e.preventDefault();
        if(this._backupInputValue){
            var firstChar = this._backupInputValue.charAt(0).toUpperCase();
            this._backupInputValue = firstChar + this._backupInputValue.substr(1);
            ToolbarTopActions.currentPageNameChange(this._backupInputValue);
            this._backupInputValue = null;
        }
    },

    _handleAddNewPage: function(e){
        e.stopPropagation();
        e.preventDefault();
        ToolbarTopActions.addNewPage();
    },

    _handleDeletePage: function(e){
        e.stopPropagation();
        e.preventDefault();
        if(confirm('Please confirm the deletion of the page. This operation can be undone.')){
            ToolbarTopActions.deletePage();
        }
    },

    _handleCopyPage: function(e){
        e.stopPropagation();
        e.preventDefault();
        ToolbarTopActions.copyPage();
    },

    _handleUndo: function(e){
        e.stopPropagation();
        e.preventDefault();
        ToolbarTopActions.undo();
    },
    //
    //_handleRedo: function(e){
    //    e.stopPropagation();
    //    e.preventDefault();
    //    ToolbarTopActions.redo();
    //},

    _handleRefreshPage: function(e){
        e.stopPropagation();
        e.preventDefault();
        DeskPageFrameActions.renderPageFrame();
    },

    _handleSwichToPage: function(e){
        e.stopPropagation();
        e.preventDefault();
        ToolbarTopActions.switchToPage(e.currentTarget.attributes['data-page-index'].value);
    },

    _handleCancelClick: function(e){
        e.stopPropagation();
        e.preventDefault();
        DeskPageFrameActions.stopClipboardForOptions();
    },

    _handlePageInfoEdit: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalPageInfoEditorActions.showModal();
    }


});

module.exports = ToolbarTop;
