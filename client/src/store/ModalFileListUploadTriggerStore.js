'use strict';

var _ = require('underscore');
var Reflux = require('reflux');
var Server = require('../api/Server.js');
var ModalFileListUploadTriggerActions = require('../action/ModalFileListUploadTriggerActions.js');

var defaultModel = {
    isModalOpen: false
};

var excludeFiles = ['.DS_Store', 'node_modules'];
var mandatoryFiles = ['.builder'];

var builderConfig = {};

var ModalFileListUploadTriggerStore = Reflux.createStore({
    model: defaultModel,
    listenables: ModalFileListUploadTriggerActions,

    onShowModal: function(){
        if(!this.model.isModalOpen){
            this.model.errors = null;
            this.model.isModalOpen = true;
            Server.invoke("loadUserProfile", {},
                function(errors){
                    this.model.errors = errors;
                    this.model.stage = 'serverConnectionError';
                    this.trigger(this.model);
                }.bind(this),
                function(response){
                    Server.invoke("readProjectFiles", {},

                        function(errors){
                            this.model.errors = errors;
                            this.trigger(this.model);
                        }.bind(this),

                        function(response){
                            //
                            this.model.dataList = [];
                            var countMandatoryFiles = 0;
                            response.files.map(function(file){
                                if(_.contains(mandatoryFiles, file.name)){
                                    countMandatoryFiles++;
                                }
                                this.model.dataList.push({
                                    isDirectory: file.isDirectory,
                                    name: file.name,
                                    checked: !_.contains(excludeFiles, file.name),
                                    mandatory: _.contains(mandatoryFiles, file.name)
                                });
                            }.bind(this));
                            //
                            if(countMandatoryFiles < mandatoryFiles.length){
                                this.model.errors = this.model.errors || [];
                                this.model.errors.push('Missing one of this files in project folder: ' + mandatoryFiles.join(', '));
                            }
                            //
                            var _trigger = function (){
                                this.model.projectName = builderConfig.projectName;
                                this.model.projectDescription = builderConfig.projectDescription;
                                this.model.projectLicense = builderConfig.projectLicense;
                                //
                                this.model.stage = 'chooseFiles';
                                this.trigger(this.model);
                            }.bind(this);
                            //
                            Server.invoke('readLocalConfiguration', {},
                                function(errors){
                                    _trigger();
                                },
                                function(response){
                                    builderConfig = response;
                                    _trigger();
                                }.bind(this)
                            );
                            //
                        }.bind(this)
                    );
                }.bind(this)
            );
        }
    },

    onUploadFiles: function(options){
        this.model.errors = null;
        console.log(JSON.stringify(options, null, 4));
        if(options.projectName && options.projectName.trim().length > 0){
            //
            builderConfig.projectName = options.projectName.trim();
            builderConfig.projectDescription = options.projectDescription.trim();
            if(options.projectLicense && options.projectLicense.trim().length > 0){
                builderConfig.projectLicense = options.projectLicense.trim();
            } else {
                builderConfig.projectLicense = 'MIT';
            }
            //
            Server.invoke('storeLocalConfiguration', builderConfig, function(errors){}, function(response){});
            //
            Server.invoke('createProject',
                {
                    projectName: builderConfig.projectName,
                    projectDescription: builderConfig.projectDescription,
                    projectLicense: builderConfig.projectLicense,
                    files: options.files
                },
                function(errors){
                    this.model.errors = errors;
                    this.model.stage = 'chooseFiles';
                    this.trigger(this.model);
                    //
                }.bind(this),
                function(response){
                    //
                    this.model.stage = 'uploadingEnd';
                    this.trigger(this.model);
                    //
                }.bind(this)
            );
            this.model.stage = 'uploadingFiles';
        } else {
            this.model.errors = ['Project name is empty.'];
            this.model.stage = 'chooseFiles';
        }
        this.trigger(this.model);
    },

    onHideModal: function(){
        if(this.model.isModalOpen){
            this.model.isModalOpen = false;
            this.trigger(this.model);
        }
    },
    onToggleModal: function(){
        this.model.isModalOpen = !this.model.isModalOpen;
        this.trigger(this.model);
    }
});

module.exports = ModalFileListUploadTriggerStore;
