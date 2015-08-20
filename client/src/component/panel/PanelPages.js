'use strict';

var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var PanelPagesStore = require('../../store/panel/PanelPagesStore.js');
var PanelPagesActions = require('../../action/panel/PanelPagesActions.js');

var Panel = ReactBootstrap.Panel;
var PanelGroup = ReactBootstrap.PanelGroup;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;
var Button = ReactBootstrap.Button;

var PanelPages = React.createClass({

    handlePageSelected: function(e){
        e.preventDefault();
        e.stopPropagation();
        var pageIndex = e.currentTarget.attributes['data-page-index'].value;
        PanelPagesActions.setActivePage({index: pageIndex});
        //PanelPagesActions.setActiveLayout({
        //    activeStylePanel: selectedKey
        //});
    },

    getInitialState: function() {
        return PanelPagesStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentDidMount: function() {
        this.unsubscribe = PanelPagesStore.listen(this.onModelChange);
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },

    getDefaultProps: function() {
        return {};
    },

    render: function() {
        var style = {
            width: '100%',
            paddingTop: '5px',
            paddingRight: '5px'
        };
        var panelContent = null;
        if(this.state.pages){

            //var propsStyle = this.state.props.style;
            //// clear all groups
            //_.forOwn(StyleGroups, function(value, prop){
            //    StyleGroups[prop].array = [];
            //});
            //// setup groups with existing values
            //
            //_.forOwn(StyleOptionsGroupMapping, function(value, prop){
            //    var group = StyleGroups[value.group].array;
            //    var cssProperty = {
            //        name: prop,
            //        value: propsStyle ? propsStyle[prop] : null,
            //        type: value.type,
            //        listValue: value.listValue
            //    };
            //    group.push(cssProperty);
            //});
            //var stylePanels = [];
            //var eventKey = 1;
            //_.forOwn(StyleGroups, function(value, prop){
            //    stylePanels.push(
            //        <StylePanel key={'stylePanel' + eventKey}
            //                    header={StyleGroups[prop].title}
            //                    styleProps={StyleGroups[prop].array}
            //                    split={StyleGroups[prop].split}
            //                    activeStylePane={this.state.activeStylePane}
            //                    eventKey={eventKey++}/>
            //    );
            //}.bind(this));
            var panels = [];
            var bsStyle = 'default';
            this.state.pages.map(function(page, index){
                var name = page.pageName;
                if(name.length > 30){
                    name = name.substr(0, 30) + '...';
                }
                if(index === this.state.activePageIndex){
                    bsStyle = 'primary';

                    panels.push(
                        <ListGroupItem bsStyle={bsStyle}>
                            <span>{name}</span>
                            <div>
                                <Button><span>Button</span></Button>
                                <Button><span>Button</span></Button>
                            </div>
                        </ListGroupItem>
                    );


                } else {
                    panels.push(
                        <ListGroupItem
                            bsStyle={bsStyle}
                            style={{cursor: 'pointer'}}
                            onClick={this.handlePageSelected}>
                            <span>{name}</span>
                        </ListGroupItem>
                    );
                }
            }.bind(this));
            panelContent = (
                <div style={style}>
                    <ListGroup fill>
                        {panels}
                    </ListGroup>
                </div>
            );
        } else {
            //<div style={{ padding: '0.5em 0.5em 1.5em 0.5em' }}>
            //
            //</div>
            panelContent = (
                <div style={style}>
                    <h4 className='text-center'>No pages</h4>
                </div>
            );
        }
        return panelContent;
    }

});

module.exports = PanelPages;