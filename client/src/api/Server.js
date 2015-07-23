'use strict';

var socket = null;
var io = null;
var serverHost = 'localhost';
var pathName = '/';
var port = '2222';
var serverURL = '';

var Server = {

    init: function(options){
        this.origin = options.location.origin;
        this.href = options.location.href;
    },

    invoke:function(methodName, options, onError, onSuccess){
        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                methodName: methodName,
                data: options
            }),
            dataType: "json",
            url: this.href + "/invoke/"
        }).always(function(response, textStatus){
            //console.log("%o, %o, %o", response, textStatus, response.result);
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
    }

};

module.exports = Server;
