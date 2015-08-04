'use strict';

var ModalProgressActions = require('../../action/modal/ModalProgressActions.js');

var FormMixin = {

    _showModalProgress: function(message, delay){
        ModalProgressActions.showModalProgress(message, delay);
    },

    _showModalMessageArray: function(message){
        ModalProgressActions.showModalMessageArray(message);
    },

    _hideModalProgress: function(){
        ModalProgressActions.hideModalProgress();
    }
};

module.exports = FormMixin;
