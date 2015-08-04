'use strict';

var _ = require('underscore');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;
var Alert = ReactBootstrap.Alert;

var WizardAppendComponentStore = require('../../store/wizard/WizardAppendComponentStore.js');
var WizardAppendComponentActions = require('../../action/wizard/WizardAppendComponentActions.js');

var FormAvailableComponents = require('./FormAvailableComponents.js');

var WizardAppendComponent = React.createClass({

    getInitialState: function(){
        return WizardAppendComponentStore.getInitialModel();
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentDidMount: function() {
        this.unsubscribe = WizardAppendComponentStore.listen(this.onModelChange);
        WizardAppendComponentActions.setInitialOptions({
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
        switch(this.state.step) {
            case 0:
                stepComponent = (
                    <FormAvailableComponents itemsTree={this.props.itemsTree}
                                             onSubmitStep={WizardAppendComponentActions.submitStep0}/>
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

module.exports = WizardAppendComponent;
