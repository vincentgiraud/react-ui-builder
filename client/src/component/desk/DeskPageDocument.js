'use strict';
var _ = require('lodash');

var React = require('react/addons');
var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Button = ReactBootstrap.Button;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;
var Badge = ReactBootstrap.Badge;
var PanelGroup = ReactBootstrap.PanelGroup;
var TabbedArea = ReactBootstrap.TabbedArea;
var TabPane = ReactBootstrap.TabPane;
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;

var MarkdownEditorX = require('../element/MarkdownEditorX.js');
var DeskPageDocumentStore = require('../../store/desk/DeskPageDocumentStore.js');
var DeskPageDocumentActions = require('../../action/desk/DeskPageDocumentActions.js');


var DeskPageDocument = React.createClass({

    getInitialState: function(){
        return DeskPageDocumentStore.getInitialModel();
    },

    componentDidMount: function() {
        this.unsubscribe = DeskPageDocumentStore.listen(this.onModelChange);
    },

    componentDidUpdate(){
        if(this.state.scrollToTop){
            $(React.findDOMNode(this)).animate(
                { scrollTop: 0 },
                300
            );
        }
    },

    componentWillUnmount: function(){
        this.unsubscribe();
    },

    onModelChange: function(model) {
        this.setState(model);
    },


    handleSectionSelect: function(e){
        e.preventDefault();
        e.stopPropagation();
        var section = e.currentTarget.attributes['data-section-key'].value;
        DeskPageDocumentActions.changeSection(section);
    },

    handleSaveChanges: function(e){
        e.preventDefault();
        e.stopPropagation();
        DeskPageDocumentActions.saveChanges();
    },

    trimComponentName: function(label){
        if(label.length > 50){
            label = label.substr(0, 50) + '...';
        }
        return label;
    },

    handleChangeFind: function(e){
        var value = this.refs.inputElement.getValue();
        var newState = {
            filter: value
        };
        this.setState(newState);
    },

    handleClearFind: function(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({ filter: '' });
    },

    render: function() {

        var alerts = [];
        var alert = null;
        if(this.state.errors && this.state.errors.length > 0){
            for(var i = 0; i < this.state.errors.length; i++){
                var stringError = JSON.stringify(this.state.errors[i]);
                alerts.push(
                    <p key={'serror' + i}><strong>{stringError}</strong></p>
                );
            }
            alert = (
                <Alert bsStyle="danger">{alerts}</Alert>
            );
        }

        var _filter = this.state.filter ? this.state.filter.toUpperCase() : null;
        var componentSections = [];
        if(this.state.document.components){
            _.forOwn(this.state.document.components, function(component, componentName) {
                if(_filter){
                    if(componentName.toUpperCase().indexOf(_filter) >= 0){
                        componentSections.push(
                            <ListGroupItem key={componentName}
                                           style={{position: 'relative', cursor: 'pointer'}}
                                           data-section-key={componentName}
                                           onClick={this.handleSectionSelect}>
                                <span>{this.trimComponentName(componentName)}</span>
                            </ListGroupItem>
                        );
                    }
                } else {
                    componentSections.push(
                        <ListGroupItem key={componentName}
                                       style={{position: 'relative', cursor: 'pointer'}}
                                       data-section-key={componentName}
                                       onClick={this.handleSectionSelect}>
                            <span>{this.trimComponentName(componentName)}</span>
                        </ListGroupItem>
                    );
                }

            }.bind(this));
        }

        return (
            <div {...this.props}>
                <Grid fluid={true}>
                    <Row>
                        <Col xs={10}>
                            {alert}
                            <h3 style={{marginBottom: '1em'}}><span>Project documentation </span><small>use markdown to edit the content</small></h3>
                        </Col>
                        <Col xs={2}>
                            <Button
                                className='pull-right'
                                bsStyle={this.state.isModified ? 'success' : 'default'} style={{marginTop: '1em'}}
                                onClick={this.handleSaveChanges}>
                                Save changes
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={3}>
                            <ListGroup fill>
                                <ListGroupItem key={'component'}
                                               style={{position: 'relative', cursor: 'pointer'}}
                                               data-section-key={'overview'}
                                               onClick={this.handleSectionSelect}>
                                    <span>Overview</span>
                                </ListGroupItem>
                            </ListGroup>
                            <Input
                                ref='inputElement'
                                type={ 'text'}
                                placeholder={ 'Filter...'}
                                value={this.state.filter}
                                onChange={this.handleChangeFind}
                                buttonAfter={ <Button onClick={this.handleClearFind}
                                          bsStyle={ 'default'}>
                                    <span className={ 'fa fa-times'}></span>
                                  </Button>
                                }/>
                            <ListGroup fill>
                                {componentSections}
                            </ListGroup>
                        </Col>
                        <Col xs={9}>
                            <h4 className='text-center'>
                                {this.state.currentDocumentSectionName === 'overview' ? 'Project overview' : this.state.currentDocumentSectionName}
                            </h4>
                            <MarkdownEditorX
                                sourceName={this.state.currentDocumentSectionName}
                                markdownSource={this.state.currentMarkdownSource}
                                onMarkdownChange={DeskPageDocumentActions.markdownChange}/>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }

});

module.exports = DeskPageDocument;
