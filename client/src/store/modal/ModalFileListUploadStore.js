'use strict';

var _ = require('lodash');
var Reflux = require('reflux');
var Server = require('../../api/Server.js');
var Common = require('../../api/Common.js');
var Repository = require('../../api/Repository.js');
var ModalFileListUploadActions = require('../../action/modal/ModalFileListUploadActions.js');

var defaultModel = {
    isModalOpen: false
};

var excludeFiles = ['.DS_Store', 'node_modules'];
var mandatoryFiles = ['.builder'];

var builderConfig = {};

var ModalFileListUploadStore = Reflux.createStore({
    model: defaultModel,
    listenables: ModalFileListUploadActions,

    readProjectConfig: function(callback){
        Server.invoke('readLocalConfiguration', {},
            function(errors){
                callback();
            },
            function(response){
                builderConfig = response;
                callback();
            }.bind(this)
        );
    },

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

                            if(countMandatoryFiles < mandatoryFiles.length){
                                this.model.errors = this.model.errors || [];
                                this.model.errors.push('Missing one of this files in project folder: ' + mandatoryFiles.join(', '));
                            }

                            this.model.pageContents = {};
                            var pages = Repository.getCurrentProjectPageNames();
                            if(pages && pages.length > 0){
                                pages.map(function(pageName, index){
                                    this.model.pageContents[pageName] = {
                                        isIndexPage: index === 0,
                                        checked: true
                                    };
                                }.bind(this));
                            }

                            this.readProjectConfig(function (){
                                this.model.projectName = builderConfig.projectName;
                                this.model.projectDescription = builderConfig.projectDescription;
                                this.model.projectLicense = builderConfig.projectLicense || 'MIT';

                                this.model.stage = 'chooseFiles';
                                this.trigger(this.model);
                            }.bind(this));

                        }.bind(this)
                    );
                }.bind(this)
            );
        }
    },

    onUploadFiles: function(options){
        this.model.errors = [];

        if(!options.projectName || options.projectName.trim().length < 5) {
            this.model.errors.push('Project name is empty or less than 5 characters.');
        } else if(options.projectName.trim().length > 50) {
            this.model.errors.push('Project license should be less than 50 characters.');
        }
        if(!options.projectDescription || options.projectDescription.trim().length <= 0){
            this.model.errors.push('Project description is empty.');
        } else if(options.projectDescription.trim().length > 400) {
            this.model.errors.push('Project description should be less than 400 characters.');
        }
        if(!options.projectLicense || options.projectLicense.trim().length <= 0){
            this.model.errors.push('Project license is empty.');
        } else if(options.projectLicense.trim().length > 100){
            this.model.errors.push('Project license should be less than 100 characters.');
        }
        if(options.pageContents){
            var isValidContents = false;
            _.forOwn(options.pageContents, function(value, prop){
                if(value.isIndexPage){
                    isValidContents = true;
                }
            });
            if(!isValidContents){
                this.model.errors.push('Please select pages for preview.');
            }
        }
        if(this.model.errors.length === 0){

            builderConfig.projectName = options.projectName.trim();
            builderConfig.projectDescription = options.projectDescription.trim();
            if(options.projectLicense && options.projectLicense.trim().length > 0){
                builderConfig.projectLicense = options.projectLicense.trim();
            } else {
                builderConfig.projectLicense = 'MIT';
            }

            var pageContents = {};
            _.forOwn(options.pageContents, function(value, prop){
                if(value.checked){
                    pageContents[prop] = value;
                }
            });

            var projectModel = Repository.getCurrentProjectModel();
            Repository.cleanProjectModel(projectModel);
            if(projectModel.pages && projectModel.pages.length > 0){
                projectModel.pages.map(function(page){
                    Common.cleanPropsUmyId(page);
                });
            }

            Server.invoke('createProject',
                {
                    projectName: builderConfig.projectName,
                    projectDescription: builderConfig.projectDescription,
                    projectLicense: builderConfig.projectLicense,
                    files: options.files,
                    pageContents: pageContents,
                    projectModel: projectModel
                },
                function(errors){
                    this.model.errors = errors;
                    this.model.stage = 'chooseFiles';
                    this.trigger(this.model);

                }.bind(this),
                function(response){

                    Server.invoke('storeLocalConfiguration', builderConfig,
                        function(errors){
                            this.model.stage = 'uploadingEnd';
                            this.trigger(this.model);
                        }.bind(this),
                        function(response){
                            this.model.stage = 'uploadingEnd';
                            this.trigger(this.model);
                        }.bind(this)
                    );

                }.bind(this)
            );
            //this.model.stage = 'uploadingFiles';
        } else {
            this.model.stage = 'chooseFiles';
            this.trigger(this.model);
        }
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

module.exports = ModalFileListUploadStore;
