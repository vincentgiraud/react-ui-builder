'use strict';

var React = require('react/addons');
var ModalProjectSettingsActions = require('../../action/modal/ModalProjectSettingsActions.js');
var ModalUploadProjectActions = require('../../action/modal/ModalUploadProjectActions.js');
var ModalStaticSiteGeneratorActions = require('../../action/modal/ModalStaticSiteGeneratorActions.js');
var Button = require('react-bootstrap').Button;
var DeskAction = require('../../action/desk/DeskActions.js');
var ApplicationActions = require('../../action/application/ApplicationActions.js');
var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');

var cx = React.addons.classSet;

var ToolbarLeft = React.createClass({

    componentDidMount: function(){

    },

    render: function(){

        var leftSideStyle = {
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'bottom': 0
        };

        var leftSideStyleInner = {
            'position': 'relative',
            'minWidth': '4em',
            'width': '4em',
            'padding': '0 0.5em 0 0.5em'
        };

        var btnGroupStyle = {
            'width': '100%',
            'textAlign': 'center'
        };

        return (
            <div style={leftSideStyle}>
                <div style={leftSideStyleInner}>
                    <div className="btn-group" style={btnGroupStyle}>
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                            <span className="fa fa-bars" style={{fontSize: 32}} />
                        </a>
                        <ul className="dropdown-menu" role="menu">
                            <li><a href="#" onClick={this._handleProjectSettings}>
                                <span className="fa fa-gears fa-fw" />&nbsp;Set project proxy</a>
                            </li>
                            <li className="divider" />
                            <li><a href="#" onClick={this._handlePublishProject}>
                                <span className="fa fa-cloud-upload fa-fw" />&nbsp;Publish project</a>
                            </li>
                            <li><a href="#" onClick={this._handleGenerateStaticSite}>
                                <span className="fa fa-sitemap fa-fw" />&nbsp;Create static site</a>
                            </li>
                            <li className="divider" />
                            <li><a href="https://groups.google.com/forum/#!forum/react-ui-builder" target="_blank">
                                <span className="fa fa-comments-o fa-fw"></span>&nbsp;Forum</a>
                            </li>
                            <li className="divider" />
                            <li><a href="#" onClick={ApplicationActions.goToStartPage}>
                                <span className="fa fa-sign-out fa-fw" />&nbsp;Close project</a>
                            </li>
                        </ul>
                    </div>

                    <Button
                        bsStyle={this.props.isAvailableComponentsButtonActive ? 'primary' : 'default'}
                        style={{marginTop: '1em', width: '100%'}}
                        disabled={!this.props.isEditMode}
                        onClick={DeskAction.toggleAvailableComponents}>
                        <span className="fa fa-plus" />
                    </Button>

                    <Button
                        bsStyle={this.props.isComponentsHierarchyButtonActive ? 'primary' : 'default'}
                        style={{marginTop: '0.25em', width: '100%'}}
                        disabled={!this.props.isEditMode}
                        onClick={DeskAction.toggleComponentsHierarchy}>
                        <span className="fa fa-code" />
                    </Button>

                    <Button
                        bsStyle={this.props.isStyleOptionsButtonActive ? 'primary' : 'default'}
                        style={{marginTop: '0.25em', width: '100%'}}
                        disabled={!this.props.isEditMode}
                        onClick={DeskAction.toggleStyleOptions}>
                        <span className="fa fa-paint-brush" />
                    </Button>

                    <Button
                        bsStyle={this.props.isEditMode ? 'primary' : 'default'}
                        style={{marginTop: '1em', width: '100%'}}
                        onClick={DeskAction.startEditMode}>
                        <span className="fa fa-wrench" />
                    </Button>

                    <Button
                        bsStyle={this.props.isLivePreviewMode ? 'primary' : 'default'}
                        style={{marginTop: '0.25em', width: '100%'}}
                        onClick={DeskAction.startLivePreviewMode}>
                        <span className="fa fa-eye" />
                    </Button>

                    <Button
                        bsStyle={this.props.isDocumentMode ? 'primary' : 'default'}
                        style={{marginTop: '0.25em', width: '100%'}}
                        onClick={DeskAction.startDocumentMode}>
                        <span className="fa fa-paperclip fa-flip-vertical" />
                    </Button>

                    <div style={{marginTop: '0.25em', width: '100%', height: '2em'}} />
                </div>
            </div>
        )

    },

    _handleDummy: function(e){
        e.stopPropagation();
        e.preventDefault();
    },

    _handlePublishProject: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalUploadProjectActions.showModal();
    },

    _handleProjectSettings: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalProjectSettingsActions.showModal();
    },

    _handleGenerateStaticSite: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalStaticSiteGeneratorActions.showModal();
    },

    _handleShowProjectComponents: function(e){
        e.stopPropagation();
        e.preventDefault();
        DeskPageFrameActions.showProjectComponents();
    }

});

module.exports = ToolbarLeft;
