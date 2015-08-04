'use strict';

var React = require('react/addons');

var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Panel = ReactBootstrap.Panel;
var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;

var CollapsibleLabel = require('../element/CollapsibleLabel.js');
var FormMixin = require('./FormMixin.js');

var ApplicationActions = require('../../action/application/ApplicationActions.js');
var ProjectThumbnail = require('./ProjectThumbnail.js');

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
        var alert = null;
        if(this.props.errors && this.props.errors.length > 0){
            var alerts = [];
            for(var i = 0; i < this.props.errors.length; i++){
                var stringError = JSON.stringify(this.props.errors[i]);
                alerts.push(
                    <p key={'error' + i}><strong>{stringError}</strong></p>
                );
            }
            alert = (
                <Alert bsStyle="danger">{alerts}</Alert>
            );
        }
        var projectThumbnails = [];
        if(this.props.projects && this.props.projects.length > 0){
            for(i = 0; i < this.props.projects.length; i += 2){
                projectThumbnails.push(
                    <Row key={'row' + i}>
                        <Col key={'1'} xs={12} md={6} sm={6} lg={6}>
                            <ProjectThumbnail key={'thumbNail' + i} {...this.props.projects[i]} />
                        </Col>
                        <Col key={'2'} xs={12} md={6} sm={6} lg={6}>
                            <ProjectThumbnail key={'thumbNail' + i} {...this.props.projects[i+1]} />
                        </Col>
                    </Row>
                );
            }
        }
        return (
            <Grid fluent={true} style={{marginTop: '70px'}}>
                <h4>Choose project you want to clone</h4>
                <CollapsibleLabel style={{margin: '0.3em 0 0.3em 0'}} title='Legal stuff'>
                    <div style={{padding: '1em'}}>
                        <p>Data published to the React UI Builder gallery is not part of React UI Builder itself,
                            and is the sole property of the publisher. While every effort is made to ensure accountability,
                            there is absolutely no guarantee, warranty, or assertion expressed or implied as to the quality,
                            fitness for a specific purpose, or lack of malice in any given project in the gallery.</p>
                        <p>If you have a complaint about a project in the React UI Builder gallery,
                            please email&nbsp;&nbsp;<a href='mailto:umyprotoservice@gmail.com'>umyprotoservice(at)gmail.com</a>
                            &nbsp;&nbsp;and explain the situation.</p>
                        <p>Any data published to the React UI Builder gallery (including user account information)
                            may be removed or modified at the sole discretion of the UMyProto Team administration.</p>
                        <p className='lead'>Users can publish Bad Stuff. It will be removed promptly if reported.
                            But there is no vetting process for published projects, and you use them at your own risk.
                            Please inspect the source.
                        </p>
                    </div>
                </CollapsibleLabel>
                {alert}
                {projectThumbnails}
            </Grid>
        );
    }

});

module.exports = FormStart;
