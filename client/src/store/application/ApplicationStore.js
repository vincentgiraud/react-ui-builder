'use strict';

var _ = require('lodash');
var Reflux = require('reflux');
var ApplicationActions = require('../../action/application/ApplicationActions.js');
var ModalProgressActions = require('../../action/modal/ModalProgressActions.js');
var PanelAvailableComponentsActions = require('../../action/panel/PanelAvailableComponentsActions.js');
var Server = require('../../api/Server.js');
var docCookie = require('../../api/cookies.js');
var Repository = require('../../api/Repository.js');

var defaultModel = {
    stage: 'start',
    errors: null,
    packageVersion: 'unversioned',
    builderConfig: {}
};

var autoSaveProjectModelProcessId = null;

function startAutosaveProjectModel(){
    if(!autoSaveProjectModelProcessId){
        autoSaveProjectModelProcessId = setTimeout(function(){
            Server.invoke('saveProjectModel', {
                model: Repository.getCurrentProjectModel()
            }, function(err){
                console.error(JSON.stringify(err));
            }, function(response){
                //console.log('Project model is saved successfully');
                autoSaveProjectModelProcessId = null;
                startAutosaveProjectModel();
            });
        }, 300000);
    }
}

function stopAutosaveProjectModel(){
    if(autoSaveProjectModelProcessId){
        clearTimeout(autoSaveProjectModelProcessId);
        autoSaveProjectModelProcessId = null;
        //console.log('Project model saving is stopped successfully');
    }
}

var ApplicationStore = Reflux.createStore({
    model: defaultModel,
    listenables: ApplicationActions,

    onGoToErrors: function(errors){
        this.model.stage = 'errors';
        this.model.errors = errors;
        this.trigger(this.model);
    },

    onGoToStartPage: function(){
        this.onStopAutosaveProjectModel();
        this.model.errors = null;
        this.model.stage = 'start';
        this.trigger(this.model);
    },

    onGoToDeskPage: function(){
        this.model.errors = null;
        this.model.stage = 'deskPage';
        this.trigger(this.model);
    },

    onGoToGallery: function(){
        Server.invoke('getProjectGallery',
            {},
            function(errors){
                this.model.errors = errors;
                this.model.stage = 'start';
                this.trigger(this.model);
            }.bind(this),

            function(response){
                this.model.stage = 'gallery';
                this.model.projects = response;
                if(this.model.projects.length % 2 > 0){
                    this.model.projects.push({
                        isEmpty: true
                    })
                }
                this.model.errors = null;
                this.trigger(this.model);
            }.bind(this)
        );
    },

    onRefreshServerInfo: function(options){
        var self = this;
        Server.invoke("getPackageConfig",
            {},
            function(errors){
                self.onGoToErrors(errors);
            },
            function(response){
                if(response){
                    self.model.packageVersion = response.version;
                }
                Server.invoke('readConfiguration', {},
                    function(errors){
                        //self.onGoToErrors(errors);
                        self.onStoreBuilderConfig(self.model.builderConfig);
                        self.onInitUserCredentials(options);
                    },
                    function(response){
                        self.model.builderConfig = response;
                        self.onInitUserCredentials(options);
                    }
                );
            }
        )
    },

    onStoreBuilderConfig: function(config){
        var self = this;
        Server.invoke('storeConfiguration', config,
            function(errors){
                self.onGoToErrors(errors);
            },
            function(response){
                ;
            }
        );
    },

    onOpenLocalProject: function(options){
        var dirPath = null;
        if(options.dirPath && options.dirPath.trim().length > 0) {
            dirPath = options.dirPath.trim();
        }
        if(dirPath) {

            ModalProgressActions.showModalProgress('Project is being compiled and loaded. Please wait...', 400);

            Server.invoke('openLocalProject', { projectDirPath: dirPath },
                function(errors){

                    this.model.errors = errors;
                    this.trigger(this.model);
                }.bind(this),
                function(response){

                    Repository.setCurrentProjectModel(response.model);
                    Repository.setHtmlForDesk(response.htmlURLPrefix + '/' + response.htmlForDesk);
                    Repository.setCurrentPageModelByIndex(0);
                    Repository.setComponentsTree(response.componentsTree);
                    //Repository.setCallbackAfterProjectModelRenew(function(){
                    //    Server.invoke('saveProjectModel', {
                    //        model: Repository.getCurrentProjectModel()
                    //    }, function(err){
                    //        console.error(JSON.stringify(err));
                    //    }, function(response){
                    //        //console.log('Project model is saved successfully');
                    //    });
                    //});

                    this.model.errors = null;

                    this.model.builderConfig.recentProjectDirs = this.model.builderConfig.recentProjectDirs || [];
                    var foundIndex = -1;
                    this.model.builderConfig.recentProjectDirs.map( function(item, index) {
                        if(item === dirPath){
                            foundIndex = index;
                        }
                    });
                    if(foundIndex >= 0){
                        this.model.builderConfig.recentProjectDirs.splice(foundIndex, 1);
                    }
                    this.model.builderConfig.recentProjectDirs.splice(0, 0, dirPath);

                    this.onStoreBuilderConfig(this.model.builderConfig);

                    Server.onSocketEmit('compilerWatcher.success', function(data){
                        Repository.setComponentsTree(data.componentsTree);
                        PanelAvailableComponentsActions.refreshComponentList();
                    });

                    Server.invoke('setProjectProxy', {}, function(err){}, function(response){});
                    Server.invoke('watchLocalProject', {}, function(err){}, function(response){});

                    Server.invoke('readProjectDocument', {},
                        function(err) { console.log(err); },
                        function(response){
                            Repository.setCurrentProjectDocument(response);
                        }
                    );

                    this.onGoToDeskPage();


                }.bind(this)
            );
        } else {
            this.model.errors = ['Please specify local project directory path'];
            this.trigger(this.model);
        }
    },

    onStopAutosaveProjectModel: function(){
        //Repository.setCallbackAfterProjectModelRenew(null);
        Server.invoke('stopWatchLocalProject', function(err){}, function(){});
    },

    onPreviewProject: function(projectId){
        ModalProgressActions.showModalProgress('Preparing preview. Please wait...', 300);
        Server.invoke('preparePreview', {projectId: projectId},
            function (errors) {
                this.onGoToErrors(errors);
            }.bind(this),
            function (response) {
                this.model.previewProjectId = projectId;
                this.model.previewProjectModel = response.projectModel;
                this.model.previewHtml = response.htmlForDesk;
                this.model.errors = null;
                this.model.stage = 'previewProject';
                this.trigger(this.model);
            }.bind(this)
        );
    },

    onStartDownloadProject: function(projectId){
        this.model.cloneProjectId = projectId;
        this.model.errors = null;
        this.model.stage = 'downloadProjectForm';
        this.trigger(this.model);
    },

    onDownloadProject: function(options){
        var dirPath = null;
        if(options.dirPath && options.dirPath.trim().length > 0) {
            dirPath = options.dirPath.trim();
        }
        if(dirPath){
            this.model.downloadProjectDirPath = options.dirPath;
            ModalProgressActions.showModalProgress('npm modules are being installed. Please wait, it will take some time...', 400);
            Server.invoke('downloadProject',
                {
                    dirPath: options.dirPath,
                    projectId: this.model.cloneProjectId
                },
                function(errors){
                    this.model.errors = errors;
                    this.model.stage = 'downloadProjectForm';
                    this.trigger(this.model);
                }.bind(this),
                function(response){
                    this.onOpenLocalProject({
                        dirPath: options.dirPath
                    });
                }.bind(this)
            );
        } else {
            this.model.errors = ['Please specify local directory path'];
            this.trigger(this.model);
        }
    },

    onLoadUserProfile: function(showError){
        Server.invoke("loadUserProfile", {},
            function(errors){
                if(showError){
                    this.onGoToSignInForm(errors);
                } else {
                    this.model.userName = undefined;
                    this.onGoToStartPage();
                }
            }.bind(this),
            function(response){
                this.model.userName = response.userName;
                this.onGoToStartPage();
            }.bind(this)
        );
    },

    /**
     *
     * @param options { user, pass, remember }
     */
    onInitUserCredentials: function(options){
        Server.invoke("initUserCredentials", options,
            function(err){},
            function(response){
                if(options.remember === true){
                    docCookie.setItem("umyproto-react-builder-user", options.user, 31536e3, "/");
                    docCookie.setItem("umyproto-react-builder-pass", options.pass, 31536e3, "/");
                }
                this.onLoadUserProfile(options.showError);
            }.bind(this));
    },

    onRemoveUserCredentials: function(){
        Server.invoke("removeUserCredentials", {},
            function(err){},
            function(response){
                docCookie.removeItem("umyproto-react-builder-user", "/");
                docCookie.removeItem("umyproto-react-builder-pass", "/");
                this.onLoadUserProfile();
            }.bind(this));
    },

    /**
     *
     * @param options {user, pass, remember}
     */
    onCreateUserProfile: function(options){
        Server.invoke("createUserProfile", options,
            function(errors){
                this.onGoToSignUpForm(errors);
            }.bind(this),
            function(response){
                this.onInitUserCredentials(
                    {user: options.user, pass: options.pass, remember: options.remember}
                );
            }.bind(this)
        );
    },

    onGoToSignInForm: function(errors){
        this.model.stage = 'signInForm';
        this.model.errors = errors;
        this.trigger(this.model);
    },

    onGoToSignUpForm: function(errors){
        this.model.stage = 'signUpForm';
        this.model.errors = errors;
        this.trigger(this.model);
    }


});

module.exports = ApplicationStore;
