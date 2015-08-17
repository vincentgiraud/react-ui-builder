import path from 'path';
import _ from 'lodash';
import child_process from 'child_process';
import FileManager from './FileManager.js';
import ProjectCompiler from './ProjectCompiler.js';

const configFileName = 'react-ui-builder.json';
const templateDirName = 'templates';
const storageDirName = '.data';
const builderDirName = '.builder';
const buildDirName = 'build';
const generatorsDirName = 'generators';
const sourceDirName = 'src';
const scriptsDirName = 'scripts';
const docsDirName = 'docs';
const fileConfigName = 'config.json';
const indexFileName = 'index.js';
const npmPackageFileName = 'package.json';

const exec = child_process.exec;

function isFirstCharacterInUpperCase(text){
    if (text && text.length > 0) {
        let firstChar = text.charAt(0);
        let firstCharUpperCase = firstChar.toUpperCase();
        return firstChar === firstCharUpperCase;
    }
    return false;
}

class StorageManager {

    constructor(serverDirPath){

        this.serverDirPath = serverDirPath;
        this.serverConfigFilePath = path.join(this.serverDirPath, configFileName);
        this.serverTemplateDirPath = path.join(this.serverDirPath, templateDirName);
        this.packageFilePath = path.join(this.serverDirPath, npmPackageFileName);
        this.storageDirPath = path.join(this.serverDirPath, storageDirName);

        this.fileManager = new FileManager();
        this.compiler = new ProjectCompiler();

    }

    setProjectDirPath(projectDirPath){
        this.projectDirPath = projectDirPath;
        this.builderDirPath = path.join(projectDirPath, builderDirName);
        this.buildDirPath = path.join(this.builderDirPath, buildDirName);
        this.generatorsDirPath = path.join(this.builderDirPath, generatorsDirName);
        this.sourceDirPath = path.join(this.builderDirPath, sourceDirName);
        this.indexFilePath = path.join(this.sourceDirPath, indexFileName);
        this.docsDirPath = path.join(this.builderDirPath, docsDirName);
        this.scriptsDirName = scriptsDirName;
        this.configFilePath = path.join(this.builderDirPath, fileConfigName);
    }

    readServerConfig(){
        return this.fileManager.readJson(this.serverConfigFilePath).then( jsonObj => {
            return jsonObj;
        });
    }

    writeServerConfig(configObj){
        return this.fileManager.writeJson(this.serverConfigFilePath, configObj);
    }

    readPackageConfig(){
        return this.fileManager.readJson(this.packageFilePath);
    }

    cleanServerStorage(){
        return this.fileManager.removeFile(this.storageDirPath)
            .then( () => {
                return this.fileManager.ensureDirPath(this.storageDirPath);
            });
    }

    writeServerBinaryFile(filePath, fileData){
        let destFilePath = path.join(this.storageDirPath, filePath);
        return this.fileManager.writeBinaryFile(destFilePath, fileData);
    }

    unpackServerFile(filePath){
        let srcFilePath = path.join(this.storageDirPath, filePath);
        return this.fileManager.unpackTarGz(srcFilePath, this.storageDirPath).then( () => {
            return this.fileManager.removeFile(srcFilePath);
        });
    }

    readServerJsonFile(filePath){
        let srcFilePath = path.join(this.storageDirPath, filePath);
        return this.fileManager.readJson(srcFilePath);
    }

    getProjectBuildDirPath(){
        return this.buildDirPath;
    }

    loadProxyURL(options){
        const proxyConfFilePath = path.join(this.builderDirPath, 'proxy.json');
        return this.fileManager.ensureFilePath(proxyConfFilePath)
            .then( () => {
                return this.fileManager.readJson(proxyConfFilePath)
                    .then( jsonObj => {
                        var data = jsonObj;
                        if(options){
                            if(options.proxyURLDelete){
                                data.proxyURL = null;
                            } else if(options.proxyURL){
                                data.proxyURL = options.proxyURL;
                            }
                        }
                        return this.fileManager.writeJson(proxyConfFilePath, data)
                            .then( () => {
                                return data.proxyURL;
                            });
                    })
                    .catch( err => {
                        return this.fileManager.writeJson(proxyConfFilePath, { proxyURL: options.proxyURL })
                            .then( () => {
                                return options.proxyURL;
                            });
                    });
            });
    }

    readProjectConfig(){
        return this.fileManager.readJson(this.configFilePath);
    }

    writeProjectConfig(options){
        return this.fileManager.writeJson(this.configFilePath, options);
    }

    writeProjectBinaryFile(filePath, fileData){
        let destFilePath = path.join(this.projectDirPath, filePath);
        return this.fileManager.writeBinaryFile(destFilePath, fileData);
    }

    writeSourceFile(filePath, fileData){
        return this.fileManager.writeFile(filePath, fileData, false);
    }

    readSourceFile(filePath){
        return this.fileManager.readFile(filePath);
    }

    unpackProjectFile(filePath){
        let srcFilePath = path.join(this.projectDirPath, filePath);
        return this.fileManager.unpackTarGz(srcFilePath, this.projectDirPath).then( () => {
            return this.fileManager.removeFile(srcFilePath);
        });
    }

    readProjectJsonModel(){
        let srcFilePath = path.join(this.builderDirPath, 'model.json');
        return this.fileManager.readJson(srcFilePath);
    }

    writeProjectJsonModel(jsonObj){
        let srcFilePath = path.join(this.builderDirPath, 'model.json');
        return this.fileManager.writeJson(srcFilePath, jsonObj);
    }

    copyProjectResources(){
        let srcAssetsDirPath = path.join(this.serverTemplateDirPath, 'build');
        return this.fileManager.copyFile(srcAssetsDirPath, this.buildDirPath)
            .then( () => {
                let srcGeneratorsDirPath = path.join(this.serverTemplateDirPath, 'generators');
                return this.fileManager.copyFile(srcGeneratorsDirPath, this.generatorsDirPath)
            })
            .then( () => {
                let pageForDeskFilePath = path.join(this.serverTemplateDirPath, 'src');
                return this.fileManager.copyFile(pageForDeskFilePath, this.sourceDirPath);
            })
            .then( () => {
                let npmPackageFilePath = path.join(this.serverTemplateDirPath, npmPackageFileName);
                return this.fileManager.copyFile(npmPackageFilePath, path.join(this.projectDirPath, npmPackageFileName));
            })
            .then( () => {
                let modelFilePath = path.join(this.serverTemplateDirPath, 'model.json');
                return this.fileManager.copyFile(modelFilePath, path.join(this.builderDirPath, 'model.json'));
            });
    }

    installPackages(){
        return new Promise( (resolve, reject) => {
            try{
                let child = exec('npm install', {cwd: this.projectDirPath},
                    (error, stdout, stderr) => {
                        if (error !== null) {
                            reject(error);
                        } else {
                            resolve()
                        }
                    });
            } catch(e){
                reject(e);
            }
        });
        //var execPath = path.join(projectDirPath, 'npm install');

    }

    compileProjectResources() {
        return this.installPackages()
            .then( () => {
                let pageForDeskFilePath = path.join(this.sourceDirPath, 'PageForDesk.js');
                var nodeModulesPath = path.join(this.projectDirPath, 'node_modules');
                return this.compiler.compile(pageForDeskFilePath, this.buildDirPath, 'bundle.js', nodeModulesPath);
            });
    }

    watchProjectResources(callback){
        return this.compiler.stopWatchCompiler()
            .then( () => {
                let pageForDeskFilePath = path.join(this.sourceDirPath, 'PageForDesk.js');
                var nodeModulesPath = path.join(this.projectDirPath, 'node_modules');

                return this.compiler.watchCompiler(
                    pageForDeskFilePath, this.buildDirPath, 'bundle.js', nodeModulesPath, callback
                )
            });
    }

    stopWatchProjectResources(){
        return this.compiler.stopWatchCompiler();
    }

    readDefaults(componentName){
        let lookupComponentName =
            isFirstCharacterInUpperCase(componentName) ? componentName : ('html-' + componentName);
        return this.fileManager.readJson(path.join(this.builderDirPath, 'defaults', lookupComponentName + '.json'));
    }

    writeDefaults(componentName, modelObj){
        return this.fileManager.ensureDirPath(path.join(this.builderDirPath, 'defaults'))
            .then( () => {
                return this.readDefaults(componentName)
                    .catch( err => {
                        return [];
                    });
            }).then( defaultsModel => {
                let defaults = defaultsModel;
                defaults.push(modelObj);
                let lookupComponentName =
                    isFirstCharacterInUpperCase(componentName) ? componentName : ('html-' + componentName);
                return this.fileManager.writeJson(
                    path.join(this.builderDirPath, 'defaults', lookupComponentName + '.json'), defaults
                );
            });
    }

    writeAllDefaults(componentName, modelObj){
        return this.fileManager.ensureDirPath(path.join(this.builderDirPath, 'defaults'))
            .then( () => {
                let defaults = modelObj;
                let lookupComponentName =
                    isFirstCharacterInUpperCase(componentName) ? componentName : ('html-' + componentName);
                return this.fileManager.writeJson(
                    path.join(this.builderDirPath, 'defaults', lookupComponentName + '.json'), defaults
                );
            });
    }

    readProjectDocument(components){
        let documentObj = {
            overview: {},
            components: {}
        };
        let overviewFilePath = path.join(this.docsDirPath, 'Readme.md');
        return this.fileManager.ensureFilePath(overviewFilePath)
            .then( () => {
                return this.fileManager.readFile(overviewFilePath)
                    .then( fileData => {
                        fileData = fileData || 'Project does not have Readme';
                        documentObj.overview.markdown = fileData;
                    });
            })
            .then( () => {
                if(components && components.length > 0){
                    return components.reduce( (sequence, componentName) => {
                        return sequence.then( () => {
                            let componentNoteFilePath = path.join(this.docsDirPath, 'components', componentName + '.md');
                            return this.fileManager.ensureFilePath(componentNoteFilePath)
                                .then( () => {
                                    return this.fileManager.readFile(componentNoteFilePath)
                                        .then( fileData => {
                                            fileData = fileData || 'Component does not have notes';
                                            documentObj.components[componentName] = {
                                                markdown: fileData
                                            }
                                        });
                                });
                        });
                    }, Promise.resolve());
                }
            })
            .then( () => {
                return documentObj;
            });
    }

    writeProjectDocument(documentObj){
        if(documentObj.overview){
            let overviewFilePath = path.join(this.docsDirPath, 'Readme.md');
            documentObj.overview.markdown = documentObj.overview.markdown || 'Project does not have Readme';
            return this.fileManager.writeFile(overviewFilePath, documentObj.overview.markdown, false)
                .then( () => {
                    if(documentObj.components){
                        let sequence = Promise.resolve();
                        _.forOwn(documentObj.components, (component, componentName) => {
                            sequence = sequence.then( () => {
                                let componentNoteFilePath = path.join(this.docsDirPath, 'components', componentName + '.md');
                                component.markdown = component.markdown || 'Component does not have notes';
                                return this.fileManager.writeFile(componentNoteFilePath, component.markdown, false);
                            });
                        });
                        return sequence;
                    }
                });
        }
    }

    readComponentDocument(componentName){
        let componentNoteFilePath = path.join(this.docsDirPath, 'components', componentName + '.md');
        return this.fileManager.ensureFilePath(componentNoteFilePath)
            .then( () => {
                return this.fileManager.readFile(componentNoteFilePath)
                    .then( fileData => {
                        fileData = fileData || 'Component does not have notes';
                        return fileData;
                    });
            });
    }

}

export default StorageManager;
