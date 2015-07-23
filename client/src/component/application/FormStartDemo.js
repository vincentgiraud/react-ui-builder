'use strict';

var React = require('react/addons');

var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Panel = ReactBootstrap.Panel;
var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;
var Badge = ReactBootstrap.Badge;
var Input = ReactBootstrap.Input;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;

var ModalProgressTrigger = require('../modal/ModalProgressTrigger.js');
var FormMixin = require('./FormMixin.js');

var ApplicationActions = require('../../action/application/ApplicationActions.js');

var FormStart = React.createClass({

    mixins: [FormMixin],

    componentDidMount: function(){
        this._hideModalProgress();
    },

    getDefaultProps: function () {
        return {
            errors: null
        };
    },

    componentDidUpdate: function(){
        this._hideModalProgress();
    },


    render: function(){
        var panelTitle = (
            <h3>Choose what you want to do</h3>
        );
        var alerts = [];
        var alert = null;
        if(this.props.errors && this.props.errors.length > 0){
            for(var i = 0; i < this.props.errors.length; i++){
                var stringError = JSON.stringify(this.props.errors[i]);
                alerts.push(
                    <p key={'serror' + i}><strong>{stringError}</strong></p>
                );
            }
            alert = (
                <Alert bsStyle="danger">{alerts}</Alert>
            );
        }
        return (
            <Grid fluent={true}>
                <Row style={{marginTop: '70px'}}>
                    <Col xs={10} md={8} sm={10} lg={6} xsOffset={1} mdOffset={2} smOffset={1} lgOffset={3}>
                        {alert}
                        <Panel header={panelTitle} bsStyle="primary">
                            <Button bsStyle={ 'default'} block={true} onClick={this._handleOpenProjectOne}>
                                <span>Open project with react-bootstrap components</span>
                            </Button>
                            <Button bsStyle={ 'default'} block={true} onClick={this._handleOpenProjectTwo}>
                                <span>Open project with material-ui components</span>
                            </Button>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    },

    _handleOpenProjectOne: function(e){
        e.preventDefault();
        e.stopPropagation();
        ApplicationActions.openLocalProject({dirPathIndex: 0});
    },

    _handleOpenProjectTwo: function(e){
        e.preventDefault();
        e.stopPropagation();
        ApplicationActions.openLocalProject({dirPathIndex: 1});
    }

});

module.exports = FormStart;
