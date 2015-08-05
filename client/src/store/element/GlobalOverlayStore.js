'use strict';

var Reflux = require('reflux');
var GlobalOverlayActions = require('../../action/element/GlobalOverlayActions.js');

var defaultModel = {
    isShown: false
};

var timeoutPid;

var GlobalOverlayStore = Reflux.createStore({
    model: defaultModel,
    listenables: GlobalOverlayActions,

    onShow: function() {
        if(!timeoutPid){
            timeoutPid = setTimeout(function () {
                if (!this.model.isShown) {
                    this.model.isShown = true;
                    this.trigger(this.model);
                }
                timeoutPid = null;
            }.bind(this), 300);
        }
    },

    onHide: function(){
        if(timeoutPid){
            clearTimeout(timeoutPid);
            timeoutPid = null;
        }
        this.model.isShown = false;
        this.trigger(this.model);
    }

});

module.exports = GlobalOverlayStore;