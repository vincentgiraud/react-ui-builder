'use strict';

var ModalProgressTriggerActions = require('../../action/modal/ModalProgressTriggerActions.js');

var FormMixin = {

    _showModalProgress: function(message, delay){
        ModalProgressTriggerActions.showModalProgress(message, delay);
    },

    _showModalMessageArray: function(message){
        ModalProgressTriggerActions.showModalMessageArray(message);
    },

    _hideModalProgress: function(){
        ModalProgressTriggerActions.hideModalProgress();
    }
};

module.exports = FormMixin;
