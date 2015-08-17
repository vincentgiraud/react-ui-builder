'use strict';

var React = require('react');
var DeskStore = require('../../store/desk/DeskStore.js');
var ToolbarLeft = require('../toolbar/ToolbarLeft.js');
var PanelAvailableComponents = require('../panel/PanelAvailableComponents.js');
var PanelComponentsHierarchy = require('../panel/PanelComponentsHierarchy.js');
var ModalComponentEditor = require('../modal/ModalComponentEditor.js');
var ModalComponentGenerator = require('../modal/ModalComponentGenerator.js');
var ModalQuickActionComponent = require('../modal/ModalQuickActionComponent.js');

var ToolbarTop = require('../toolbar/ToolbarTop.js');
var ToolbarBreadcrumbs = require('../toolbar/ToolbarBreadcrumbs.js');
var DeskPageFrame = require('../desk/DeskPageFrame.js');
var DeskPageDocument = require('../desk/DeskPageDocument.js');
var DeskPageFramePreview = require('../desk/DeskPageFramePreview.js');
var Repository = require('../../api/Repository.js');
var ToolbarTopActions = require('../../action/toolbar/ToolbarTopActions.js');
var PanelQuickOptions = require('../panel/PanelQuickOptions.js');
var SidePanel = require('../element/SidePanel.js');

var Desk = React.createClass({

    getInitialState: function(){
        return DeskStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentDidMount: function() {
        this.unsubscribe = DeskStore.listen(this.onModelChange);
        ToolbarTopActions.refreshPageList();
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },

    render: function(){

        var leftPanelWidth = 0;
        var leftPanelInner = null;
        if(this.state.isAvailableComponentsButtonActive){
            leftPanelWidth = 200;
            leftPanelInner = (<PanelAvailableComponents />);
        }

        var bottomPanelHeight = 0;
        var bottomPanelInner = null;
        if(this.state.isComponentsHierarchyButtonActive){
            bottomPanelHeight = 300;
            bottomPanelInner = (<PanelComponentsHierarchy />);
        }

        var rightPanelWidth = 0;
        var rightPanelInner = null;
        if(this.state.isStyleOptionsButtonActive){
            rightPanelWidth = 250;
            rightPanelInner = (<PanelQuickOptions></PanelQuickOptions>);
        }

        var leftPanelStyle = {
            position: 'absolute',
            top: 0,
            left: '4em',
            bottom: '0px',
            width: leftPanelWidth + "px",
            paddingRight: '5px',
            overflow: 'auto'
        };

        var bottomPanelStyle = {
            position: 'absolute',
            left: 'calc(4em + ' + leftPanelWidth +'px)',
            right: 'calc(5px + ' + rightPanelWidth + 'px)',
            bottom: '0px',
            height: bottomPanelHeight + "px"
        };

        var rightPanelStyle = {
            position: 'absolute',
            top: 0,
            right: '0px',
            bottom: '0px',
            width: rightPanelWidth + "px",
            paddingLeft: '5px',
            overflow: 'auto'
        };

        var topComponent = null;
        var topPanelHeight = 0;
        var breadcrumbsComponent = null;

        if(!this.state.isLivePreviewMode && !this.state.isDocumentMode){
            var toolbarTopStyle = {
                position: 'absolute',
                top: 0,
                left: 'calc(4em + ' + leftPanelWidth + 'px)',
                right: 'calc(5px + ' + rightPanelWidth + 'px)',
                height: '3em'
            };
            topComponent = <ToolbarTop style={toolbarTopStyle}/>;
            topPanelHeight = 3;

            if(!this.state.isComponentsHierarchyButtonActive){
                var breadcrumbsTopStyle = {
                    position: 'absolute',
                    top: '3em',
                    left: 'calc(4em + ' + leftPanelWidth + 'px)',
                    right: 'calc(5px + ' + rightPanelWidth + 'px)',
                    height: '3em'
                };
                breadcrumbsComponent = <ToolbarBreadcrumbs style={breadcrumbsTopStyle}></ToolbarBreadcrumbs>
                topPanelHeight += 3;
            }

        } else {
            topPanelHeight = 0.3;
        }

        var bodyStyle = {
            position: 'absolute',
            top: topPanelHeight + 'em',
            left: 'calc(4em + ' + leftPanelWidth + 'px)',
            //bottom: 'calc(5px + ' + bottomPanelHeight + 'px)',
            overflow: 'auto',
            bottom: bottomPanelHeight + 'px',
            WebkitOverflowScrolling: 'touch',
            right: 'calc(5px + ' + rightPanelWidth + 'px)'
        };

        var iframeStyle = {
            "height" : "calc(100% - 5px)",
            //"height" : "100%",
            "width" : "100%",
            "minWidth" : "320px",
            "margin" : "0",
            "padding" : "0",
            "border" : "1px solid #000000"
        };

        var pageFrame = null;
        var pageFrameSrc = Repository.getHtmlForDesk();
        if(this.state.isLivePreviewMode){
            pageFrame = (
                <DeskPageFramePreview frameBorder="0" style={iframeStyle} src={pageFrameSrc} />
            );
        } else if(this.state.isDocumentMode) {
            var documentStyle = {
                "height" : "calc(100% - 5px)",
                "width" : "100%",
                "minWidth" : "320px",
                "margin" : "0",
                "padding" : "0",
                "border" : "1px solid #000000",
                "overflow": "auto"
            };
            pageFrame = (
                <DeskPageDocument style={documentStyle} />
            );
        } else {
            pageFrame = (
                <DeskPageFrame frameBorder="0" style={iframeStyle} src={pageFrameSrc} />
            );
        }

        return (
            <div>
                <ToolbarLeft {...this.state} />
                <SidePanel style={leftPanelStyle}>
                    {leftPanelInner}
                </SidePanel>
                {topComponent}
                {breadcrumbsComponent}
                <div style={bodyStyle}>
                    {pageFrame}
                </div>
                <div style={rightPanelStyle}>
                    {rightPanelInner}
                </div>
                <div style={bottomPanelStyle}>
                    {bottomPanelInner}
                </div>
                <ModalComponentEditor/>
                <ModalComponentGenerator/>
                <ModalQuickActionComponent/>
            </div>
        )
    }

});

module.exports = Desk;
