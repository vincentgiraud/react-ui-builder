
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var FileManager = {

    readFile: function(filePath){
        return new Promise( function(resolve, reject) {
            fs.readFile(filePath, {encoding: 'utf8'}, function(err, data) {
                if(err){
                    reject("Can't read file: " + filePath + ". Cause: " + err.message);
                } else {
                    resolve(data);
                }
            });
        });
    }

};

module.exports = FileManager;