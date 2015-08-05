'use strict';

var _ = require('underscore');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;
var Alert = ReactBootstrap.Alert;

var WizardAppendComponentStore = require('../../store/wizard/WizardAppendComponentStore.js');
var WizardAppendComponentActions = require('../../action/wizard/WizardAppendComponentActions.js');

var FormAvailableComponents = require('./FormAvailableComponents.js');
var FormAvailableComponentVariants = require('./FormAvailableComponentVariants.js');

var PopoverComponentVariantActions = require('../../action/element/PopoverComponentVariantActions.js');

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
            selectedUmyId: this.props.selectedUmyId,
            command: this.props.command
        });
    },

    componentWillUpdate: function(nextProps, nextState){
        PopoverComponentVariantActions.hide();
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
        {/*onSubmitStep={}*/}
        switch(this.state.step) {
            case 0:
                stepComponent = (
                    <FormAvailableComponents itemsTree={this.props.itemsTree}
                                             onSubmitStep={WizardAppendComponentActions.submitStep0}
                                             onCommitStep={WizardAppendComponentActions.commitStep0}/>
                );
                break;
            case 1:
                stepComponent = (
                    <FormAvailableComponentVariants defaults={this.state.defaults}
                                                    defaultsIndex={this.state.defaultsIndex}
                                                    componentId={this.state.componentId}
                                                    onCancelStep={WizardAppendComponentActions.cancelStep0}
                                                    onSubmitStep={WizardAppendComponentActions.submitStep1}/>
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
