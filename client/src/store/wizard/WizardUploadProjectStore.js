'use strict';

var _ = require('lodash');
var validator = require('validator');
var Reflux = require('reflux');

var Server = require('../../api/Server.js');
var Repository = require('../../api/Repository.js');
var Common = require('../../api/Common.js');

var WizardUploadProjectActions = require('../../action/wizard/WizardUploadProjectActions.js');


var excludeFiles = ['.DS_Store', 'node_modules'];
var mandatoryFiles = ['.builder'];

var defaultModel = {
    step: 0,
    builderConfig: null
};

var WizardUploadProjectStore = Reflux.createStore({
    listenables: WizardUploadProjectActions,

    getInitialModel: function(){
        this.model = _.clone(defaultModel);
        return this.model;
    },

    onSetInitialOptions: function(options){
        this.onStartStep0();
    },

    onStartStep0: function(){
        if(!this.model.builderConfig){
            Server.invoke('readLocalConfiguration', {},
                function(errors){
                    console.log(JSON.stringify(errors, null, 4));
                    this.model.builderConfig = {};
                    this.model.projectLicense = 'MIT';
                    this.model.step = 0;
                    this.trigger(this.model);
                }.bind(this),
                function(response){
                    this.model.builderConfig = response;
                    this.model.projectName = this.model.builderConfig.projectName;
                    this.model.projectLicense = this.model.builderConfig.projectLicense || 'MIT';
                    this.model.step = 0;
                    this.trigger(this.model);
                }.bind(this)
            );
        } else {
            this.model.step = 0;
            this.trigger(this.model);
        }
    },

    onSubmitStep0: function(options){
        this.model.errors = [];
        this.model.projectName = options.projectName;
        this.model.projectLicense = options.projectLicense;
        if(!options.projectName || options.projectName.trim().length < 5) {
            this.model.errors.push('Project name is empty or less than 5 characters.');
        } else if(options.projectName.trim().length > 50) {
            this.model.errors.push('Project license should be less than 50 characters.');
        }
        if(!options.projectLicense || options.projectLicense.trim().length <= 0){
            this.model.errors.push('Project license is empty.');
        } else if(options.projectLicense.trim().length > 100){
            this.model.errors.push('Project license should be less than 100 characters.');
        }

        if(this.model.errors.length === 0){
            Server.invoke('checkCreateProject',
                {projectName: options.projectName},
                function(errors){
                    this.model.errors = errors;
                    this.trigger(this.model);
                }.bind(this),
                function(response){
                    this.onStartStep1();
                }.bind(this)
            );
        } else {
            this.trigger(this.model);
        }
    },

    onStartStep1: function(){
        if(!this.model.projectDescription){
            this.model.projectDescription = this.model.builderConfig.projectDescription;
        }
        this.model.step = 1;
        this.trigger(this.model);
    },

    onSubmitStep1: function(options){
        this.model.errors = [];
        this.model.projectDescription = options.projectDescription;
        if(!options.projectDescription || options.projectDescription.trim().length <= 0){
            this.model.errors.push('Project description is empty.');
        } else if(options.projectDescription.trim().length > 400) {
            this.model.errors.push('Project description should be less than 400 characters.');
        }

        if(this.model.errors.length === 0){
            this.onStartStep2();
        } else {
            this.trigger(this.model);
        }
    },

    onStartStep2: function(){
        if(!this.model.pageContents){
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
        }
        this.model.step = 2;
        this.trigger(this.model);
    },

    onSubmitStep2: function(options){
        this.model.errors = [];
        this.model.pageContents = options.pageContents;
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
            this.onStartStep3();
        } else {
            this.trigger(this.model);
        }
    },

    onStartStep3: function(){

        if(!this.model.dataList){
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

                    //if(countMandatoryFiles < mandatoryFiles.length){
                    //    this.model.errors = this.model.errors || [];
                    //    this.model.errors.push('Missing one of this files in project folder: ' + mandatoryFiles.join(', '));
                    //}

                    this.model.step = 3;
                    this.trigger(this.model);

                }.bind(this)
            );
        } else {
            this.model.step = 3;
            this.trigger(this.model);
        }
    },

    onSubmitStep3: function(options){
        this.model.errors = [];
        this.model.builderConfig.projectName = this.model.projectName.trim();
        this.model.builderConfig.projectDescription = this.model.projectDescription.trim();
        this.model.builderConfig.projectLicense = this.model.projectLicense.trim();

        Server.invoke('storeLocalConfiguration', this.model.builderConfig,
            function(errors){
                this.model.errors = errors;
                this.trigger(this.model);
            }.bind(this),
            function(response){

                var projectModel = Repository.getCurrentProjectModel();
                Repository.cleanProjectModel(projectModel);
                if(projectModel.pages && projectModel.pages.length > 0){
                    projectModel.pages.map(function(page){
                        Common.cleanPropsUmyId(page);
                    });
                }

                Server.invoke('createProject',
                    {
                        projectName: this.model.builderConfig.projectName,
                        projectDescription: this.model.builderConfig.projectDescription,
                        projectLicense: this.model.builderConfig.projectLicense,
                        files: options.files,
                        pageContents: this.model.pageContents,
                        projectModel: projectModel
                    },
                    function(errors){
                        this.model.errors = errors;
                        this.trigger(this.model);

                    }.bind(this),
                    function(response){
                        this.onStartStep4();
                    }.bind(this)
                );
            }.bind(this)
        );

    },

    onStartStep4: function(){
        this.model.messages = [
            'Project is uploaded successfully. Please go to gallery to check.'
        ];
        this.model.step = 4;
        this.trigger(this.model);
    }

});

module.exports = WizardUploadProjectStore;

