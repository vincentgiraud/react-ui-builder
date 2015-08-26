'use strict';

var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;
var Alert = ReactBootstrap.Alert;

var WizardUploadProjectStore = require('../../store/wizard/WizardUploadProjectStore.js');
var WizardUploadProjectActions = require('../../action/wizard/WizardUploadProjectActions.js');

var FormUploadProjectName = require('./FormUploadProjectName.js');
var FormUploadProjectDescription = require('./FormUploadProjectDescription.js');
var FormUploadProjectPageList = require('./FormUploadProjectPageList.js');
var FormUploadProjectFileList = require('./FormUploadProjectFileList.js');
var FormMessage = require('./FormMessage.js');

var WizardUploadProject = React.createClass({

    getInitialState: function(){
        return WizardUploadProjectStore.getInitialModel();
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentDidMount: function() {
        this.unsubscribe = WizardUploadProjectStore.listen(this.onModelChange);
        WizardUploadProjectActions.setInitialOptions({});
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },

    render: function(){

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

        var stepComponent = null;
        var formStyle={
            marginTop: '1em'
        };
        switch(this.state.step) {
            case 0:
                stepComponent = (
                    <FormUploadProjectName
                        {...this.state}
                        formStyle={formStyle}
                        onSubmitStep={WizardUploadProjectActions.submitStep0}/>
                );
                break;
            case 1:
                stepComponent = (
                    <FormUploadProjectDescription
                        {...this.state}
                        formStyle={formStyle}
                        onBackStep={WizardUploadProjectActions.startStep0}
                        onSubmitStep={WizardUploadProjectActions.submitStep1}/>
                );
                break;
            case 2:
                stepComponent = (
                    <FormUploadProjectPageList
                        {...this.state}
                        formStyle={formStyle}
                        onBackStep={WizardUploadProjectActions.startStep1}
                        onSubmitStep={WizardUploadProjectActions.submitStep2}/>
                );
                break;
            case 3:
                stepComponent = (
                    <FormUploadProjectFileList
                        {...this.state}
                        formStyle={formStyle}
                        onBackStep={WizardUploadProjectActions.startStep2}
                        onSubmitStep={WizardUploadProjectActions.submitStep3}/>
                );
                break;
            case 4:
                stepComponent = (
                    <FormMessage
                        formStyle={formStyle}
                        {...this.state}/>
                );
                break;
            default:

        }
        return (
            <div style={this.props.style}>
                {alert}
                {stepComponent}
            </div>
        );
    }

});

module.exports = WizardUploadProject;
