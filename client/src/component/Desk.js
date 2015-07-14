'use strict';

var React = require('react');
var DeskStore = require('../store/DeskStore.js');
var ToolbarLeft = require('./ToolbarLeft.js');
var PanelAvailableComponents = require('./PanelAvailableComponents.js');
var PanelComponentsHierarchy = require('./PanelComponentsHierarchy.js');
var ModalPropsEditorTrigger = require('./ModalPropsEditorTrigger.js');
var ModalCodeGeneratorTrigger = require('./ModalCodeGeneratorTrigger.js');
var ToolbarTop = require('./ToolbarTop.js');
var ToolbarBreadcrumbs = require('./ToolbarBreadcrumbs.js');
var DeskPageFrame = require('./DeskPageFrame.js');
var DeskPageFramePreview = require('./DeskPageFramePreview.js');
var Repository = require('../api/Repository.js');
var ToolbarTopActions = require('../action/ToolbarTopActions.js');
var PanelQuickOptions = require('../component/panel/PanelQuickOptions.js');

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

        if(!this.state.isLivePreviewMode){
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
        } else {
            pageFrame = (
                <DeskPageFrame frameBorder="0" style={iframeStyle} src={pageFrameSrc} />
            );
        }

        return (
            <div>
                <ToolbarLeft {...this.state} />
                <div style={leftPanelStyle}>
                    {leftPanelInner}
                </div>
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
                <ModalPropsEditorTrigger/>
                <ModalCodeGeneratorTrigger/>
            </div>
        )
    }

});

module.exports = Desk;
