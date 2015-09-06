var _ = require ('lodash');
var path = require('path');
var fileManager = require('./FileManager.js');

module.exports = function process(dataObject, resolve, reject){

    var mainTemplate = null;

    fileManager.readFile(path.join(__dirname, 'ComponentMain.tpl'))
        .then( function(fileData) {
            mainTemplate = _.template(fileData);
            resolve(mainTemplate(dataObject));
        })
        .catch( function(err) {
            reject(err);
        });
};

