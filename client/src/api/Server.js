'use strict';

var socket = null;
var io = null;
var serverHost = 'localhost';

var GlobalOverlayActions = require('../action/element/GlobalOverlayActions.js');

var Server = {

    init: function(options){
        if(options.io){
            io = options.io;
        }
        if(options.serverHost){
            serverHost = options.serverHost;
        }
    },

    invoke:function(methodName, options, onError, onSuccess){
        GlobalOverlayActions.show();
        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                methodName: methodName,
                data: options
            }),
            dataType: "json",
            url: "http://" + serverHost + ":2222/invoke"
        }).always(function(response, textStatus){
            //console.log("%o, %o, %o", response, textStatus, response.result);
            GlobalOverlayActions.hide();
            if(textStatus === 'success'){
                if(response.error == true){
                    if(onError){
                        onError(response.errors);
                    }
                } else {
                    if(onSuccess){
                        onSuccess(response.data);
                    }
                }
            }  else {
                if(onError){
                    onError(["Internal Server Error: " + textStatus]);
                }
            }
        });
    },

    onSocketEmit: function(eventTypeName, callback){
        if(!socket){
            socket = io.connect('http://' + serverHost + ':2222');
        }
        socket.on(eventTypeName, callback);
    }

};

module.exports = Server;
