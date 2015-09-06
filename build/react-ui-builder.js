#!/usr/bin/env node
var io = require('socket.io');
var api = require('./lib/api.js');

process.on('uncaughtException',
    function(err){
        if(err.code === 'EADDRINUSE'){
            console.error('Port is already in use.');
        } else {
            console.log(err);
        }
    }
);
api.initServer({ dirname: __dirname, io: io });