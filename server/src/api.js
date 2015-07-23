'use strict';

var _ = require('underscore');
var express = require("express");
var path = require('path');
var bodyParser = require('body-parser');
var httpProxy = require('http-proxy');

var app = null;
var socket = null;
var server = null;
var io = null;
var proxy = null;

var Client = require('./Client.js');
var Compiler = require('./Compiler.js');
var StorageManager = require('./StorageManager.js');
var ComponentGenerator = require('./ComponentGenerator.js');
var ComponentCodeRewriter = require('./ComponentCodeRewriter.js');

var FacadeProjectLocal = require('./FacadeProjectLocal.js');
var FacadeGallery = require('./FacadeGallery.js');

var systemEnv = {
    builderDir: './',
    fileConfigPath: './react-builder.json',

    templateDirPath: './template',
    serviceDirUrl: '/.data'
};

var dirPaths = [
    'projects/1', 'projects/2'
];

var socketClient = null;
var proxyURL = null;

module.exports = {

    initServer: function(options){
        //
        if(options.dirname){
            systemEnv.builderDir = options.dirname;
            systemEnv.fileConfigPath = path.join(options.dirname, 'react-builder.json');
            systemEnv.templateDirPath = path.join(options.dirname, 'template');
        }
        //
        app = express();
        app.use(bodyParser.json());
        //
        app.use('/builder', express.static(path.join(systemEnv.builderDir, 'html')));
        app.use('/.data', express.static(path.join(systemEnv.builderDir, '.data')));
        app.post('/invoke', function(req, res){
            var methodName = req.body.methodName;
            var data = req.body.data;
            this[methodName](data, function(response){
                res.send(response);
            });
        }.bind(this));
        //
        server = app.listen(2222, function() {
            console.log(
                'React UI Builder started successfully.\nPlease go to http://localhost:%d/builder',
                server.address().port
            );
        });
        //
    },

    addProjectStaticRoute: function(htmlUrlPrefix, htmlDirPath){
        app.use(htmlUrlPrefix, express.static(htmlDirPath));
    },

    readConfiguration: function(options, callback){
        StorageManager.readObject(systemEnv.fileConfigPath, function(err, data){
            if(err){
                callback({
                    error: true,
                    errors: [ err ]
                });
            } else {
                callback({data: data});
            }
        });
    },

    readLocalConfiguration: function(options, callback){
        FacadeProjectLocal.readLocalConfig(function(err, data){
            if(err){
                callback({
                    error: true,
                    errors: [ err ]
                });
            } else {
                callback({data: data});
            }
        });
    },

    getPackageConfig: function(options, callback){
        callback({data: 'Demo'});
    },

    createProject: function(options, callback){
        callback({error: true, errors: ['This is demo version.']});
    },

    prepareLocalProject: function (options, callback) {
        var response = {};
        var dirPath = dirPaths[options.dirPathIndex];
        if (dirPath && dirPath.length > 0) {
            //
            dirPath = path.join(systemEnv.builderDir, dirPath);
            var htmlDirPath = path.join(dirPath, '.builder', 'build');
            var htmlURLPrefix = systemEnv.serviceDirUrl +'/' + path.basename(dirPath);
            response.htmlURLPrefix = htmlURLPrefix;
            this.addProjectStaticRoute(htmlURLPrefix, htmlDirPath);
            //
            FacadeProjectLocal.loadProjectModel({dirPath: dirPath},
                function (err, data) {
                    if (err) {
                        //console.error(err);
                        callback({error: true, errors: [err]});
                    } else {
                        response = _.extend(response, data);
                        FacadeProjectLocal.loadComponentIndex(
                            function (err, data) {
                                if (err) {
                                    callback({
                                        error: true,
                                        errors: ['Project has broken components-index.js file', err]
                                    });
                                } else {
                                    response = _.extend(response, data);
                                    response.htmlForDesk = 'PageForDesk.html';
                                    callback({data: response});
                                }
                            }
                        );
                    }
                }
            );
        }
    },

    readJSFile: function(options, callback){
        StorageManager.readJSFile({filePath: options.filePath}, function(err, data){
            if(err){
                callback({error: true, errors:[err]});
            } else {
                callback({data: data});
            }
        })
    },

    loadFluxFiles: function(options, callback){
        FacadeProjectLocal.loadFluxFiles(
            {
                componentName: options.componentName
            },
            function(err, data){
                if(err){
                    callback({error: true, errors:[err]});
                } else {
                    callback({data: data});
                }
            }
        );
    },

    loadComponentDefaults: function(options, callback){
        FacadeProjectLocal.loadComponentDefaults(options, function(err, data){
            if (err) {
                //console.error(err);
                callback({error: true, errors: [err]});
            } else {
                callback({data: data});
            }
        });
    },

    saveComponentDefaults: function(options, callback){
        callback({error: true, errors: ['To save component\'s options as variant for builder please install react-ui-builder locally']});
    },

    generateComponentCode: function(options, callback){
        FacadeProjectLocal.loadComponentIndex(
            function(err, data) {
                if (err) {
                    callback({error: true, errors: ['Project has broken components-index.js file', err]});
                } else {
                    ComponentGenerator.generateComponentCode(
                        {
                            templateDir: path.join(systemEnv.builderDir, 'templates'),
                            indexFilePath: data.indexFilePath,
                            componentsArray: data.componentsArray,
                            variables: data.variables,
                            componentName: options.componentName,
                            componentGroup: options.componentGroup,
                            componentModel: options.componentModel,
                            includeChildren: options.includeChildren,
                            includeAllReferences: options.includeAllReferences,
                            includeFlux: options.includeFlux
                        },
                        function(err, data){
                            if (err) {
                                //console.error(err);
                                callback({error: true, errors: [err]});
                            } else {
                                callback({data: data});
                            }
                        }
                    );
                }
            }
        );
    },

    generateFluxCode: function(options, callback){
        ComponentGenerator.generateFluxCode(
            {
                templateDir: path.join(systemEnv.builderDir, 'templates'),
                componentName: options.componentName,
                componentGroup: options.componentGroup
            },
            function(err, data){
                if (err) {
                    //console.error(err);
                    callback({error: true, errors: [err]});
                } else {
                    callback({data: data});
                }
            }
        )
    },

    isChildrenAcceptable: function(options, callback){
        if(options.sourceCode
            && options.sourceCode.indexOf('this.props.children') >= 0){
            callback({data: {isChildrenAcceptable: true}});
        } else {
            callback({data: {isChildrenAcceptable: false}});
        }
    },

    generateComponentChildrenCode: function(options, callback){
        FacadeProjectLocal.generateComponentChildrenCode(
            {
                templateDir: path.join(systemEnv.builderDir, 'templates'),
                componentModel: options.componentModel,
                sourceCode: options.sourceCode,
                componentGroup: options.componentGroup
            },
            function(err, data){
                if(err){
                    callback({error: true, errors: [err]});
                } else {
                    callback({data: data});
                }
            }
        );
    },

    rewriteComponentSourceCode: function(options, callback){
        var result = FacadeProjectLocal.checkSourceCode(options);
        if(!result){
            callback({error: true, errors: ['This is demo version.']});
        } else {
            callback({error: true, errors: [result]});
        }
    },

    writeNewComponentSourceCode: function(options, callback){
        var result = FacadeProjectLocal.checkSourceCode(options);
        if(!result){
            callback({error: true, errors: ['This is demo version.']});
        } else {
            callback({error: true, errors: [result]});
        }
    }

};
