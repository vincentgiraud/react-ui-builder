'use strict';

var React = require('react');
var ApplicationStore = require('../../store/application/ApplicationStore.js');
var ModalProgress = require('../modal/ModalProgress.js');
var ModalProjectSettings = require('../modal/ModalProjectSettings.js');
var ModalFileListUpload = require('../modal/ModalFileListUpload.js');
var ModalStaticSiteGenerator = require('../modal/ModalStaticSiteGenerator.js');
var FormSignIn = require('./FormSignIn.js');
var FormSignUp = require('./FormSignUp.js');
var FormStart = require('./FormStart.js');
var FormBrowseGallery = require('./FormBrowseGallery.js');
var FormDownloadProject = require('./FormDownloadProject.js');
var PopoverComponentVariant = require('../element/PopoverComponentVariant.js');
var GlobalOverlay = require('../element/GlobalOverlay.js');
var PopoverComponentVariantActions = require('../../action/element/PopoverComponentVariantActions.js');

var PageErrors = require('./PageErrors.js');
var Desk = require('../desk/Desk.js');
var ApplicationActions = require('../../action/application/ApplicationActions.js');
var FormMixin = require('./FormMixin.js');

var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Panel = ReactBootstrap.Panel;
var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;
var Nav = ReactBootstrap.Nav;
var CollapsibleNav = ReactBootstrap.CollapsibleNav;
var Navbar = ReactBootstrap.Navbar;
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;
var NavItem = ReactBootstrap.NavItem;

/**
 *
 */
var Application = React.createClass({

    mixins: [FormMixin],

    _handleWindowChanges: function(){
        PopoverComponentVariantActions.hide();
    },

    getInitialState: function(){
        return ApplicationStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },
    componentDidMount: function() {
        this._hideModalProgress();
        this.unsubscribe = ApplicationStore.listen(this.onModelChange);
        React.findDOMNode(this.refs.appBody).addEventListener('scroll', this._handleWindowChanges);
    },

    componentDidUpdate: function(){
        this._hideModalProgress();
    },

    componentWillUnmount: function() {
        this.unsubscribe();
        React.findDOMNode(this.refs.appBody).removeEventListener('scroll', this._handleWindowChanges);
    },

    render: function(){
        //
        var linkToHome = null;
        if(this.state.stage !== 'start'){
            linkToHome = (
                <NavItem href="#" onClick={this._handleGoHome}>
                    Back to home
                </NavItem>
            );
        }
        var logOut = null;
        if(this.state.userName){
            logOut = (
                <DropdownButton title={this.state.userName}>
                    <MenuItem onClick={this._handleLogout} eventKey={'1'}><span>Log Out</span></MenuItem>
                </DropdownButton>
            );
        } else {
            logOut = (
                <NavItem href="#" onSelect={this._handleLogin}>{'Log In'}</NavItem>
            );
        }
        var navBar = (
            <Navbar
                staticTop={true}
                fixedTop={true} toggleNavKey={0}>
                <div className='umy-logo' style={{position: 'absolute', left: 'calc(50% - 20px)', top: '0'}}></div>
                <CollapsibleNav eventKey={0}>
                    <Nav navbar>
                        <div style={{display: 'table'}}>
                            <div style={{display: 'table-row'}}>
                                <div style={{display: 'table-cell', verticalAlign: 'middle', paddingLeft: '0.5em', paddingRight: '0.5em', paddingTop: '0.5em', paddingBottom: '0.5em'} }>
                                    <p style={{ margin: '0px', color: '#000'}} className='text-left'>
                                        <span>Helmet</span>
                                    </p>
                                    <p style={{margin: '0px', whiteSpace: 'nowrap'}} className={'text-left text-info'}>
                                        <small>React UI Builder</small>
                                        <small className='text-muted' ref='brandTitle' style={{marginLeft: '0.2em'}}>{this.state.packageVersion}</small>
                                    </p>
                                </div>
                                <div style={{display: 'table-cell', verticalAlign: 'middle', paddingLeft: '0.5em', paddingRight: '0.5em', paddingTop: '0.5em', paddingBottom: '0.5em', width: '10%'} }></div>
                            </div>
                        </div>
                    </Nav>
                    <Nav navbar right={true}>
                        {linkToHome}
                        <NavItem href="https://groups.google.com/forum/#!forum/react-ui-builder" target="_blank">
                            <span className="fa fa-comments-o fa-fw"></span>&nbsp;Forum
                        </NavItem>
                        <NavItem href="https://www.facebook.com/groups/1668757740011916/" target="_blank">
                            <span className='fa fa-facebook-square fa-fw'></span>&nbsp;Group
                        </NavItem>
                        {logOut}
                    </Nav>
                </CollapsibleNav>
            </Navbar>
        );
        //
        var content = null;
        if(this.state.stage === 'start'){
            content = (
                <FormStart
                    errors={this.state.errors}
                    recentProjectDirs={this.state.builderConfig.recentProjectDirs}/>
            );
        } else if(this.state.stage === 'gallery'){
            content = (
                <FormBrowseGallery
                    errors={this.state.errors}
                    projects={this.state.projects}/>
            );
        } else if(this.state.stage === 'downloadProjectForm'){
            content = (
                <FormDownloadProject
                    dirPath={this.state.downloadProjectDirPath}
                    errors={this.state.errors} />
            );
        } else if(this.state.stage === 'deskPage'){
            navBar = null;
            content = (
                <Desk/>
            );
        } else if(this.state.stage === 'signInForm'){
            content = (
                <FormSignIn errors={this.state.errors}/>
            );
        } else if(this.state.stage === 'signUpForm'){
            content = (
                <FormSignUp errors={this.state.errors}/>
            );
        } else if(this.state.stage === 'errors'){
            content = (
                <PageErrors errors={this.state.errors}/>
            );
        } else {
            content = (<h3>Unknown application stage.</h3>);
        }

        return (
            <div style={{overflow: 'hidden'}}>
                <div ref='appBody' style={{position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', overflow: 'auto'}}>
                    {navBar}
                    {content}
                </div>
                <ModalProgress/>
                <ModalStaticSiteGenerator/>
                <ModalProjectSettings/>
                <ModalFileListUpload/>
                <PopoverComponentVariant/>
                <GlobalOverlay/>
            </div>
        );
    },

    _handleGoHome: function(e){
        e.preventDefault();
        e.stopPropagation();
        ApplicationActions.goToStartPage();
    },

    _handleLogout: function(){
        ApplicationActions.removeUserCredentials();
    },

    _handleLogin: function(){
        ApplicationActions.goToSignInForm();
    }

});

module.exports = Application;
