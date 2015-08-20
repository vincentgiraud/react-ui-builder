
import _ from 'lodash';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import httpProxy from 'http-proxy';

//let app = null;
//let socket = null;
//let server = null;
//let io = null;
//let proxy = null;
//
//
//let socketClient = null;
//let proxyURL = null;
const builderPackFileName = 'builder.tar.gz';
const appPackFileName = 'app.tar.gz';
const modelFileName = 'model.json';
const servicePath = '/.service';

import IndexManager from './IndexManager.js';
import GeneratorManager from './GeneratorManager.js';
import StorageManager from './StorageManager.js';
import ClientManager from './ClientManager.js';
import Validator from './Validator.js';
import StaticSiteManager from './StaticSiteManager.js';

class Api {

    constructor(systemEnv){

        this.systemEnv = systemEnv;

        this.storageManager = new StorageManager(this.systemEnv.serverDir);
        this.staticSiteManager = new StaticSiteManager(this.systemEnv.serverDir);
        this.clientManager = new ClientManager();
        this.validator = new Validator();

        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use('/builder', express.static(path.join(this.systemEnv.serverDir, 'html')));
        this.app.use('/.data', express.static(path.join(this.systemEnv.serverDir, '.data')));
        this.app.post('/invoke', (req, res) => {
            let methodName = req.body.methodName;
            let data = req.body.data || {};
            this[methodName](data)
                .then( response => {
                    res.send({ data: response });
                })
                .catch( err => {
                    res.send({ error: true, errors: [err] });
                });
        });

        this.server = this.app.listen(2222, () => {
            console.log(
                'React UI Builder started successfully.\nPlease go to http://localhost:%d/builder',
                this.server.address().port
            );
            if(this.systemEnv.io){
                this.socket = this.systemEnv.io(this.server);
                this.socket.on('connection', socket => {
                    this.socketClient = socket;
                });
            }
        });

    }

    static initServer(options){
        let systemConfig = {
            serverDir: options.dirname,
            io: options.io
        };
        return new Api(systemConfig);
    }

    test(options){
        return new Promise( (resolve, reject) => {
            if(options){
                resolve(options);
            } else {
                reject('Data was not specified.');
            }
        });
    }

    initUserCredentials(options){
        return this.clientManager.initUserCredentials(options);
    }

    removeUserCredentials(options){
        return this.clientManager.removeUserCredentials();
    }

    loadUserProfile(options){
        return this.clientManager.loadUserProfile();
    }

    createUserProfile(options){
        return this.clientManager.createUserProfile(options);
    }

    readConfiguration(options){
        return this.storageManager.readServerConfig();
    }

    storeConfiguration(options){
        return this.storageManager.writeServerConfig(options);
    }

    readLocalConfiguration(options){
        return this.storageManager.readProjectConfig();
    }

    storeLocalConfiguration(options){
        return this.storageManager.writeProjectConfig(options);
    }

    getPackageConfig(options){
        return this.storageManager.readPackageConfig();
    }

    setupProject(options){
        return this.validator.validateOptions(options, 'projectDirPath')
            .then( () => {
                if(this.indexManager){
                    delete this.indexManager;
                }
                this.indexManager = new IndexManager(options.projectDirPath);
                if(this.generatorManager){
                    delete this.generatorManager;
                }
                this.generatorManager = new GeneratorManager(options.projectDirPath);

                this.storageManager.setProjectDirPath(options.projectDirPath);
                this.staticSiteManager.setProjectDirPath(options.projectDirPath);

                return 'OK';
            });
    }

    setProjectProxy(options){
        return this.storageManager.loadProxyURL(options)
            .then( proxyURL => {

                this.proxyURL = proxyURL;

                if(!this.proxy){
                    this.proxy = httpProxy.createProxyServer();
                    this.proxy.on('error', (err, req, res) => {
                        console.log('Proxy server error connecting to ' + this.proxyURL + req.url);
                    });
                    //
                    this.app.all('/*', (req, res, next) => {
                        if (req.url.indexOf(servicePath) === 0) {
                            next('route');
                        } else {
                            if(this.proxyURL && this.proxyURL.length > 0){
                                this.proxy.web(req, res, { target: this.proxyURL });
                            } else {
                                next('route');
                            }
                        }
                    });
                }
                return { proxyURL: this.proxyURL };
            });
    }

    addProjectStaticRoute(htmlUrlPrefix, htmlDirPath){
        this.app.use(htmlUrlPrefix, express.static(htmlDirPath));
    }

    getProjectGallery(options){
        return this.clientManager.getAllProjects(options);
    }

    preparePreview(options){
        return this.storageManager.cleanServerStorage()
            .then( () => {
                let _options = {
                    id: options.projectId,
                    packageFileName: builderPackFileName
                };
                return this.clientManager.downloadGalleryFile(_options);
            })
            .then( fileBody => {
                return this.storageManager.writeServerBinaryFile(builderPackFileName, fileBody);
            })
            .then( () => {
                return this.storageManager.unpackServerFile(builderPackFileName);
            })
            .then( () => {
                return this.storageManager.readServerJsonFile(modelFileName);
            })
            .then( modelObj => {
                return {
                    projectModel: modelObj,
                    htmlForDesk:  '/.data/build/PageForDesk.html'
                }
            });
    }

    downloadProject(options) {
        let _options = {
            id: options.projectId,
            projectDirPath: options.dirPath,
            projectId: options.projectId,
            packageFileName: appPackFileName
        };
        return this.validator.validateEmptyDir(_options.projectDirPath)
            .then(() => {
                return this.setupProject(_options);
            })
            .then( result => {
                return this.clientManager.downloadGalleryFile(_options);
            })
            .then( fileBody => {
                return this.storageManager.writeProjectBinaryFile(appPackFileName, fileBody);
            })
            .then( () => {
                return this.storageManager.unpackProjectFile(appPackFileName);
            })
            .then( () => {
                return 'OK';
            });

    }

    openLocalProject(options){
        let response = {};
        return this.setupProject(options)
            .then( () => {

                let htmlDirPath = this.storageManager.getProjectBuildDirPath();
                let refinedDirPath = htmlDirPath.split(path.separator).slice(1).join('').substr(0, 30);
                let htmlURLPrefix = servicePath +'/' + refinedDirPath;
                response.htmlURLPrefix = htmlURLPrefix;
                response.htmlForDesk = 'PageForDesk.html';
                this.addProjectStaticRoute(htmlURLPrefix, htmlDirPath);
            })
            .then( () => {
                return this.storageManager.readProjectJsonModel()
                    .then(jsonModel => {
                        response.model = jsonModel;
                    });
            })
            .then( () => {
                return this.indexManager.getComponentsTree()
                    .then( componentsTree => {
                        response.componentsTree = componentsTree;
                    });
            })
            .then( () => {
                return this.storageManager.compileProjectResources();
            })
            .then( () => {
                return response;
            });
    }

    prepareLocalProject(options){
        let response = {};
        let _options = {
            projectDirPath: options.dirPath
        };
        return this.validator.validateEmptyDir(_options.projectDirPath)
            .then( () => {
                return this.setupProject(_options);
            })
            .then( () => {
                return this.storageManager.copyProjectResources();
            })
            .then( () => {
                let htmlDirPath = this.storageManager.getProjectBuildDirPath();
                let htmlURLPrefix = servicePath +'/' + htmlDirPath.substr(0, 30);
                response.htmlURLPrefix = htmlURLPrefix;
                response.htmlForDesk = 'PageForDesk.html';
                this.addProjectStaticRoute(htmlURLPrefix, htmlDirPath);
            })
            .then( () => {
                return this.storageManager.readProjectJsonModel()
                    .then(jsonModel => {
                        response.model = jsonModel;
                    });
            })
            .then( () => {
                return this.indexManager.getComponentsTree()
                    .then( componentsTree => {
                        response.componentsTree = componentsTree;
                    });
            })
            .then( () => {
                return this.storageManager.compileProjectResources();
            })
            .then( () => {
                return response;
            });
    }

    saveProjectModel(options){
        return this.storageManager.writeProjectJsonModel(options.model);
    }

    watchLocalProject(options) {
        return this.storageManager.watchProjectResources((err, data) => {
            let response = {};
            if (err) {
                this.socketClient.emit('compilerWatcher.errors', err);
            } else {
                response = _.extend(response, data);
                this.indexManager.getComponentsTree()
                    .then(componentsTree => {
                        response.componentsTree = componentsTree;
                        setTimeout( () => {
                            this.socketClient.emit('compilerWatcher.success', response);
                        }, 100);

                    })
                    .catch(err => {
                        setTimeout( () => {
                            this.socketClient.emit('compilerWatcher.errors', err);
                        }, 100);
                    });
            }
        });
    }

    stopWatchLocalProject(options){
        return this.storageManager.stopWatchProjectResources();
    }

    loadComponentDefaults(options){
        return this.storageManager.readDefaults(options.componentName);
    }

    saveComponentDefaults(options){
        return this.storageManager.writeDefaults(options.componentName, options.componentOptions);
    }

    saveAllComponentDefaults(options){
        return this.storageManager.writeAllDefaults(options.componentName, options.defaults);
    }

    getGeneratorList(options){
        return this.generatorManager.getGeneratorList();
    }

    generateComponentCode(options){
        return this.validator.validateOptions(options, ['componentName', 'componentGroup', 'componentModel', 'generatorName'])
            .then( () => {
                return this.generatorManager.doGeneration(
                    options.componentModel, options.generatorName,
                    { componentName: options.componentName, groupName: options.componentGroup }
                )
                    .then( generatedObj => {
                        return generatedObj;
                    });
            });
    }

    commitComponentCode(options){
        return this.generatorManager.commitGeneration(options);
    }

    rewriteComponentCode(options){
        return this.validator.validateOptions(options, ['filePath', 'sourceCode'])
            .then( () => {
                return this.storageManager.writeSourceFile(options.filePath, options.sourceCode);
            });
    }

    readComponentCode(options){
        return this.validator.validateOptions(options, ['filePath'])
            .then( () => {
                return this.storageManager.readSourceFile(options.filePath);
            });

    }

    readComponentDocument(options){
        return this.validator.validateOptions(options, ['componentName'])
            .then( () => {
                return this.storageManager.readComponentDocument(options.componentName);
            });
    }

    readProjectDocument(options){
        return this.indexManager.getComponentsNames()
            .then( componentsNames => {
                return this.storageManager.readProjectDocument(componentsNames);
            });
    }

    writeProjectDocument(options){
        return this.validator.validateOptions(options, ['projectDocument'])
            .then( () => {
                return this.storageManager.writeProjectDocument(options.projectDocument);
            });
    }

    generateStaticSite(options){
        return this.validator.validateOptions(options, ['projectModel', 'pageContents', 'destDirName'])
            .then( () => {
                return this.indexManager.initIndex()
                    .then( indexObj => {
                        return this.staticSiteManager.doGeneration(
                            options.projectModel, options.destDirName, indexObj, options.pageContents
                        )
                            .then( generatedObj => {
                                //console.log(JSON.stringify(generatedObj, null, 4));

                                return this.staticSiteManager.commitGeneration(generatedObj);

                            });
                    });
            });
    }

}

export default Api;
