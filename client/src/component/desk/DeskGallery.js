'use strict';

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Panel = ReactBootstrap.Panel;
var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;
var SplitButton = ReactBootstrap.SplitButton;
var MenuItem = ReactBootstrap.MenuItem;
var Nav = ReactBootstrap.Nav;
var CollapsibleNav = ReactBootstrap.CollapsibleNav;
var Navbar = ReactBootstrap.Navbar;
var DropdownButton = ReactBootstrap.DropdownButton;
var NavItem = ReactBootstrap.NavItem;
var ApplicationActions = require('../../action/application/ApplicationActions.js');

var Desk = React.createClass({

    getInitialState: function(){
        return {
            activePageIndex: 0
        };
    },

    render: function(){

        var topPanelHeight = 4;

        var bodyStyle = {
            position: 'absolute',
            top: topPanelHeight + 'em',
            left: '0px',
            //bottom: 'calc(5px + ' + bottomPanelHeight + 'px)',
            overflow: 'hidden',
            bottom: '0px',
            WebkitOverflowScrolling: 'touch',
            right: '0px'
        };

        var iframeStyle = {
            //"height" : "calc(100% - 0px)",
            "height" : "100%",
            "width" : "100%",
            "minWidth" : "320px",
            "margin" : "0",
            "padding" : "0",
            "border" : "0"
        };

        var pageSwitcher = null;
        if(this.props.projectModel.pages && this.props.projectModel.pages.length > 0){
            var items = [];
            for(var i = 0; i < this.props.projectModel.pages.length; i++){
                items.push(
                    <li key={'item' + i} role="presentation">
                        <a role="menuitem" href="#" onClick={this._handleChangePage} data-page-index={i}>
                            {this.props.projectModel.pages[i].pageName}
                        </a>
                    </li>
                );
            }
            pageSwitcher = (
                <li className="dropdown">
                    <a href='#' className="dropdown-toggle"
                            role="button"
                            id="dropdownMenu"
                            data-toggle="dropdown"
                            aria-expanded="true">
                        <span>{this.props.projectModel.pages[this.state.activePageIndex].pageName}</span>
                        <span className="fa fa-caret-down fa-fw"></span>
                    </a>
                    <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">
                        {items}
                    </ul>
                </li>
            );
        }

        var navBarGallery = (
            <Navbar
                brand={
                    <div style={{position: 'relative'}}>
                        <span>Project pages</span>
                        <span style={{fontSize: '8px', position: 'absolute', top: '0.5em', right: '-0.5em', color: 'red'}} className="badge">
                            {this.props.projectModel.pages.length}
                        </span>
                    </div>
                }
                staticTop={true}
                fixedTop={true} toggleNavKey={0}>
                <CollapsibleNav eventKey={0}>
                    <Nav navbar left={true}>
                        <span>Switch:   </span>
                        {pageSwitcher}
                    </Nav>
                    <Nav navbar right={true}>
                        <NavItem href="#" onClick={this._handleClone}>
                            Clone project
                        </NavItem>
                        <NavItem href="#" onClick={this._handleClosePreview}>
                            Back to gallery
                        </NavItem>
                    </Nav>
                </CollapsibleNav>
            </Navbar>
        );

        return (
            <div>
                {navBarGallery}
                <div style={bodyStyle}>
                    <iframe style={iframeStyle} ref='iframeElement' src={this.props.src} />
                </div>
            </div>
        )
    },

    componentDidMount: function() {
        var domNode = React.findDOMNode(this.refs.iframeElement);
        domNode.onload = (function(){
            this._renderFrameContent(this.state.activePageIndex);
        }).bind(this);
    },

    componentDidUpdate: function(){
        this._renderFrameContent(this.state.activePageIndex);
    },

    _renderFrameContent: function(pageIndex) {
        var iframeDOMNode = React.findDOMNode(this.refs.iframeElement);
        var doc = iframeDOMNode.contentDocument;
        var win = iframeDOMNode.contentWindow;
        if(doc.readyState === 'complete' && win.endpoint && win.endpoint.Page) {
            win.endpoint.replaceState(this.props.projectModel.pages[pageIndex]);
        }
    },

    _handleChangePage: function(e){
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            activePageIndex: e.currentTarget.attributes['data-page-index'].value
        });
    },

    _handleClosePreview: function(e){
        e.stopPropagation();
        e.preventDefault();
        ApplicationActions.goToGallery();
    },

    _handleClone: function (e) {
        e.preventDefault();
        e.stopPropagation();
        ApplicationActions.startDownloadProject(this.props.projectId);
    }

});

module.exports = Desk;
