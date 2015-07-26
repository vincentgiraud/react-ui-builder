'use strict';

var _ = require('underscore');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;
var Alert = ReactBootstrap.Alert;

var WizardVariantNameStore = require('../../store/wizard/WizardVariantNameStore.js');
var WizardVariantNameActions = require('../../action/wizard/WizardVariantNameActions.js');

var FormVariantName = require('./FormVariantName.js');

var WizardVariantName = React.createClass({

    getInitialState: function(){
        return WizardVariantNameStore.getInitialModel();
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentDidMount: function() {
        this.unsubscribe = WizardVariantNameStore.listen(this.onModelChange);
        WizardVariantNameActions.setInitialOptions({
            propsScript: this.props.propsScript,
            componentName: this.props.componentName,
            selectedUmyId: this.props.selectedUmyId
        });
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
                    <FormVariantName {...this.state}
                                     formStyle={formStyle}
                                     onBackStep={WizardVariantNameActions.cancelWizard}
                                     onSubmitStep={WizardVariantNameActions.submitStep0}/>
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

module.exports = WizardVariantName;
