'use strict';

var _ = require('underscore');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;
var Alert = ReactBootstrap.Alert;

var WizardIncludeChildrenStore = require('../../store/wizard/WizardIncludeChildrenStore.js');
var WizardIncludeChildrenActions = require('../../action/wizard/WizardIncludeChildrenActions.js');

var FormCommitAction = require('./FormCommitAction.js');

var WizardIncludeChildren = React.createClass({

    getInitialState: function(){
        return WizardIncludeChildrenStore.getInitialModel();
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentDidMount: function() {
        this.unsubscribe = WizardIncludeChildrenStore.listen(this.onModelChange);
        WizardIncludeChildrenActions.setInitialOptions(
            {
                sourceCode: this.props.sourceCode,
                selectedUmyId: this.props.selectedUmyId,
                componentName: this.props.componentName
            }
        );
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
                    <FormCommitAction
                        {...this.state}
                        onBackStep={WizardIncludeChildrenActions.cancelWizard}
                        onSubmitStep={WizardIncludeChildrenActions.submitStep0}
                        />
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

module.exports = WizardIncludeChildren;
