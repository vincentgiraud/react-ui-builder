var $ = require('jquery');
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

var FormSignIn = React.createClass({

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
            <h3>Sign In</h3>
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
                            <form ref='formSignIn' action='' onSubmit={this._handleSubmit}>
                                <p>
                                    <Input
                                        type="text"
                                        value={this.props.userName}
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
                                        type="checkbox"
                                        ref="rememberInput"
                                        label="Remember me" />
                                </p>
                                <div style={{display: 'table', textAlign: 'right', width: '100%'}}>
                                    <Button bsStyle='default' onClick={this._handleCreateNew}>Create new account</Button>
                                    <Button type='submit' bsStyle='primary' >Sign In</Button>
                                </div>
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
        this._showModalProgress('Singing in. Please wait ...', 400);
        ApplicationActions.initUserCredentials({
            user: this.refs.userNameInput.getValue(),
            pass: this.refs.userPwdInput.getValue(),
            remember: this.refs.rememberInput.getChecked(),
            showError: true
        });
    },

    _handleCreateNew: function(e){
        e.preventDefault();
        e.stopPropagation();
        ApplicationActions.goToSignUpForm();
    }

});

module.exports = FormSignIn;
