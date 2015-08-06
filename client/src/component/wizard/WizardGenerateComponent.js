'use strict';

var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;
var Alert = ReactBootstrap.Alert;

var WizardGenerateComponentStore = require('../../store/wizard/WizardGenerateComponentStore.js');
var WizardGenerateComponentActions = require('../../action/wizard/WizardGenerateComponentActions.js');

var FormComponentName = require('./FormComponentName.js');
var FormComponentContent = require('./FormComponentContent.js');

var WizardGenerateComponent = React.createClass({

    getInitialState: function(){
        return WizardGenerateComponentStore.getInitialModel();
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentDidMount: function() {
        this.unsubscribe = WizardGenerateComponentStore.listen(this.onModelChange);
        WizardGenerateComponentActions.setInitialOptions({selectedUmyId: this.props.selectedUmyId});
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
                    <FormComponentName
                        formStyle={formStyle} {...this.state}
                        onBackStep={WizardGenerateComponentActions.cancelWizard}
                        onSubmitStep={WizardGenerateComponentActions.submitStep0}
                        />
                );
                break;
            case 1:
                stepComponent = (
                    <FormComponentContent
                        formStyle={formStyle}
                        onBackStep={WizardGenerateComponentActions.startStep0}
                        onSubmitStep={WizardGenerateComponentActions.submitStep1}
                        {...this.state}/>
                );
                break;
            default:

        }
        return (
            <div style={this.props.style}>
                {alert}
                <h4 className='text-center'>Generate Component's source code</h4>
                {stepComponent}
            </div>
        );
    }

});

module.exports = WizardGenerateComponent;
