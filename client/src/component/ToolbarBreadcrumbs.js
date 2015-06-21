'use strict';

var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var ToolbarBreadcrumbsStore = require('../store/ToolbarBreadcrumbsStore.js');
var ToolbarBreadcrumbsActions = require('../action/ToolbarBreadcrumbsActions.js');
var DeskPageFrameActions = require('../action/DeskPageFrameActions.js');

var ToolbarBreadcrumbs = React.createClass({

    _handleClickCrumb: function(e){
        e.stopPropagation();
        e.preventDefault();
        DeskPageFrameActions.deselectComponent();
        DeskPageFrameActions.selectComponentById(e.currentTarget.attributes['data-umyid'].value);
    },

    getInitialState: function () {
        return ToolbarBreadcrumbsStore.getModel();
    },

    onModelChange: function (model) {
        this.setState(model);
    },

    componentDidMount: function () {
        this.unsubscribe = ToolbarBreadcrumbsStore.listen(this.onModelChange);
    },

    componentDidUpdate: function(){
    },

    componentWillUnmount: function () {
        this.unsubscribe();
    },

    render: function() {
        var crumbs = [];
        this.state.crumbs.map(function(item, index){
            crumbs.push(
                <li key={'crumb' + index}><a href="#" onClick={this._handleClickCrumb} data-umyid={item.umyId}>{item.type}</a></li>
            );
        }.bind(this));
        var children = [];
        this.state.activeChildren.map(function(child, index){
            children.push(
                <li key={'child' + index}><a href="#" onClick={this._handleClickCrumb} data-umyid={child.umyId}>{child.type}</a></li>
            )
        }.bind(this));
        var dropdownClassName = crumbs.length >= 3 ? ' dropdown-menu-right' : '';
        if(children.length > 0){
            crumbs.push(
                <li key={'crumbActive'} className='dropdown'>
                    <a href='#' className='dropdown-toggle' data-toggle='dropdown'>
                        {this.state.active}
                        &nbsp;<span className='caret'></span>
                    </a>
                    <ul className={"dropdown-menu" + dropdownClassName} role="menu" style={{overflowY: 'auto', maxHeight: '200px'}}>
                        {children}
                    </ul>
                </li>
            );
        } else {
            crumbs.push(
                <li key={'crumbActive'}>{this.state.active}</li>
            );
        }
        return (
            <div {...this.props}>
                <ol className='breadcrumb'>
                    {crumbs}
                </ol>
            </div>
        );
    }

});

module.exports = ToolbarBreadcrumbs;