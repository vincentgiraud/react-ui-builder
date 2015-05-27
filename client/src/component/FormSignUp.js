var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Panel = ReactBootstrap.Panel;
var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;

var ModalProgressTrigger = require('./ModalProgressTrigger.js');
var FormMixin = require('./FormMixin.js');

var ApplicationActions = require('../action/ApplicationActions.js');

var FormSignUp = React.createClass({

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
            <h3>Create new account</h3>
        );
        var alert = null;
        if(this.props.errors && this.props.errors.length > 0){
            var alerts = [];
            for(var i = 0; i < this.props.errors.length; i++){
                alerts.push(
                    <p><strong>{this.props.errors[i]}</strong></p>
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
                            <form action='#' onSubmit={this._handleSubmit}>
                                <p>
                                    <Input
                                        type="text"
                                        value={this.props.login}
                                        placeholder="Enter user name"
                                        label="User name"
                                        hasFeedback
                                        ref="userNameInput"
                                        style={{width: '100%'}} />
                                </p>
                                <p>
                                    <Input
                                        type="password"
                                        label="Password"
                                        ref="userPwdInput"
                                        style={{width: '100%'}} />
                                </p>
                                <p>
                                    <Input
                                        type="text"
                                        value={this.props.email}
                                        placeholder="Enter email address"
                                        label="Email address"
                                        ref="userEmailInput"
                                        style={{width: '100%'}} />
                                </p>
                                <p>
                                    <Input
                                        type="checkbox"
                                        ref="rememberInput"
                                        label="Remember me" />
                                </p>
                                <Button type='submit' bsStyle='primary'>Create</Button>
                                <Button bsStyle='default' onClick={this._handleCancel}>Cancel</Button>
                            </form>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    },

    _handleSubmit: function(e){
        e.preventDefault();
        e.stopPropagation();
        this._showModalProgress('Creating user profile. Please wait ...', 400);
        ApplicationActions.createUserProfile({
            user: this.refs.userNameInput.getValue(),
            pass: this.refs.userPwdInput.getValue(),
            email: this.refs.userEmailInput.getValue(),
            remember: this.refs.rememberInput.getChecked()
        });
    },

    _handleCancel: function(e){
        e.preventDefault();
        e.stopPropagation();
        ApplicationActions.goToSignInForm();
    }

});

module.exports = FormSignUp;
