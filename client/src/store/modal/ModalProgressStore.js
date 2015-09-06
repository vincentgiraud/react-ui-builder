'use strict';

var Reflux = require('reflux');
var ModalProgressActions = require('../../action/modal/ModalProgressActions.js');

var defaultModel = {
    isModalOpen: false,
    message: 'Default message text',
    seconds: 0
};

var ModalProgressStore = Reflux.createStore({
    model: defaultModel,
    listenables: ModalProgressActions,

    onShowModalProgress: function(message, delay){
        if(!this.model.isModalOpen){
            this.model.seconds = 0;
            var f = (function(self){
                return function(){
                    self.model.messageArray = null;
                    self.model.message = message;
                    self.model.isModalOpen = true;
                    self.trigger(self.model);
                };
            }(this));
            if(delay && delay > 0){
                this._modalProgressTimeout = setTimeout(f, delay);
            } else {
                f();
            }
        }
    },

    onSecondsIncrement: function(){
        this.model.seconds += 1;
        this.trigger(this.model);
    },

    onShowModalMessageArray: function(message){
        this.model.messageArray = message;
        this.model.message = null;
        this.model.isModalOpen = true;
        this.trigger(this.model);
    },

    onUpdateMessage: function(message){
        this.model.message = message;
        this.trigger(this.model);
    },

    onHideModalProgress: function(){
        if(this._modalProgressTimeout){
            clearTimeout(this._modalProgressTimeout);
            this._modalProgressTimeout = null;
        }
        if(this.model.isModalOpen){
            this.model.isModalOpen = false;
            this.trigger(this.model);
        }
    },

    onToggleModalProgress: function(){
        if(this._modalProgressTimeout){
            clearTimeout(this._modalProgressTimeout);
            this._modalProgressTimeout = null;
        }
        this.model.isModalOpen = !this.model.isModalOpen;
        this.trigger(this.model);
    }

});

module.exports = ModalProgressStore;
