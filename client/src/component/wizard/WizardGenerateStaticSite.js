'use strict';

var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;
var Alert = ReactBootstrap.Alert;

var WizardGenerateStaticSiteStore = require('../../store/wizard/WizardGenerateStaticSiteStore.js');
var WizardGenerateStaticSiteActions = require('../../action/wizard/WizardGenerateStaticSiteActions.js');

var FormPageList = require('./FormPageList.js');
var FormDirName = require('./FormDirName.js');
var FormMessage = require('./FormMessage.js');

var WizardGenerateStaticSite = React.createClass({

    getInitialState: function(){
        return WizardGenerateStaticSiteStore.getInitialModel();
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentDidMount: function() {
        this.unsubscribe = WizardGenerateStaticSiteStore.listen(this.onModelChange);
        //WizardGenerateComponentActions.setInitialOptions({selectedUmyId: this.props.selectedUmyId});
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
                    <FormPageList
                        formStyle={formStyle}
                        {...this.state}
                        onSubmitStep={WizardGenerateStaticSiteActions.submitStep0}/>
                );
                break;
            case 1:
                stepComponent = (
                    <FormDirName
                        formStyle={formStyle}
                        {...this.state}
                        onBackStep={WizardGenerateStaticSiteActions.startStep0}
                        onSubmitStep={WizardGenerateStaticSiteActions.submitStep1}/>
                );
                break;
            case 2:
                stepComponent = (
                    <FormMessage
                        formStyle={formStyle}
                        {...this.state}/>
                );
                break;
            default:

        }
        var formStyle={
            marginTop: '2em'
        };
        return (
            <div style={{width: '100%'}}>
                {alert}
                <h4 className='text-center'>Generate static content</h4>
                {stepComponent}
            </div>
        );
    }

});

module.exports = WizardGenerateStaticSite;
