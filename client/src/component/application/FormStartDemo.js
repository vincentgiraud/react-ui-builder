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
        !function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https';
            if (!d.getElementById(id)) {
                js = d.createElement(s);
                js.id = id;
                js.src = p + '://platform.twitter.com/widgets.js';
                fjs.parentNode.insertBefore(js, fjs);
            }
        }(document, 'script', 'twitter-wjs');
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
            <Grid fluid={true}>
                <Row style={{marginTop: '70px'}}>
                    <Col xs={10} md={8} sm={10} lg={6} xsOffset={1} mdOffset={2} smOffset={1} lgOffset={3}>
                        {alert}
                        <p>
                            Please note that this demo version does not have important features for creating
                            React components for your web app.
                        </p>
                        <p>
                            Before you continue please watch <a href="https://www.youtube.com/watch?v=yycaq9qv7us&feature=youtu.be" target="_blank">Short Tutorial</a>
                        </p>
                        <p>
                            To obtain full version and description how to use the tool please go to <a
                            href="https://github.com/ipselon/react-ui-builder">GitHub</a>.
                        </p>
                        <Panel header={panelTitle} bsStyle="primary">
                            <Button bsStyle={ 'default'} block={true} onClick={this._handleOpenProjectOne}>
                                <span>Open project with react-bootstrap components</span>
                            </Button>
                            <Button bsStyle={ 'default'} block={true} onClick={this._handleOpenProjectTwo}>
                                <span>Open project with material-ui components</span>
                            </Button>
                        </Panel>
                        <div>
                            <Grid fluid={true}>
                                <Row>
                                    <Col xs={12} md={6} sm={6} lg={6}>
                                        <div style={{position: 'relative', width: '25em', height: '2em', padding: '0.3em'}}>
                                            Stay in touch with author:
                                            <div style={{position: 'absolute', right: '0px', 'top': '0.1em'}}>
                                                <a
                                                    href="https://twitter.com/alex_pustovalov"
                                                    className="twitter-follow-button"
                                                    data-show-count="false">@alex_pustovalov
                                                </a>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={6} sm={6} lg={6}>
                                        <div style={{position: 'relative', width: '25em', height: '2em', padding: '0.3em'}}>
                                            <div style={{position: 'absolute', top: '0.3em', right: '8.1em'}}>If you like it:</div>
                                            <div style={{position: 'absolute', right: '0px', 'top': '0.1em'}}>
                                                <a className="github-button" href="https://github.com/ipselon/react-ui-builder"
                                                   data-icon="octicon-star" data-count-href="/ipselon/react-ui-builder/stargazers"
                                                   data-count-api="/repos/ipselon/react-ui-builder#stargazers_count"
                                                   data-count-aria-label="# stargazers on GitHub"
                                                   aria-label="Star ipselon/react-ui-builder on GitHub">Star</a>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Grid>
                        </div>
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
