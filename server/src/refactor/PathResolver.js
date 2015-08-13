
import _ from 'lodash';
import path from 'path';

export function resolveFromComponentPerspective(dataObject){

    let _copyObject = _.clone(dataObject, true);

    let absoluteComponentPath = _copyObject.component.outputFilePath;
    let absoluteComponentDirPath = path.dirname(absoluteComponentPath);
    let indexFileDirPath = path.dirname(_copyObject.component.indexFilePath);
    _copyObject.component.relativeFilePathInIndex = path.relative(indexFileDirPath, absoluteComponentPath);

    _copyObject.component.imports.map( (variable, index) => {
        if(variable.source.substr(0, 6) === '../../'){
            let absoluteSourcePath = path.resolve(indexFileDirPath, variable.source);
            variable.relativeSource = repairPath(path.relative(absoluteComponentDirPath, absoluteSourcePath));
        } else {
            variable.relativeSource = variable.source;
        }
    });

    _.forOwn(_copyObject.modules, (value, prop) => {
        value.relativeFilePath = repairPath(path.relative(absoluteComponentDirPath, value.outputFilePath));
    });
    return _copyObject;

}

export function resolveFromModulePerspective(dataObject, moduleId){

    let _copyObject = _.clone(dataObject, true);

    let indexFileDirPath = path.dirname(dataObject.component.indexFilePath);
    let absoluteModulePath = _copyObject.modules[moduleId].outputFilePath;
    let absoluteModuleDirPath = path.dirname(absoluteModulePath);

    _copyObject.component.relativeFilePath = path.relative(absoluteModuleDirPath, _copyObject.component.outputFilePath);
    _copyObject.modules[moduleId].relativeFilePathInIndex = path.relative(indexFileDirPath, absoluteModulePath);

    _copyObject.component.imports.map( (variable, index) => {
        if(variable.source.substr(0, 6) === '../../'){
            let absoluteSourcePath = path.resolve(indexFileDirPath, variable.source);
            variable.relativeSource = repairPath(path.relative(absoluteModuleDirPath, absoluteSourcePath));
        } else {
            variable.relativeSource = variable.source;
        }
    });

    _.forOwn(_copyObject.modules, (value, prop) => {
        value.relativeFilePath = repairPath(path.relative(absoluteModuleDirPath, value.outputFilePath));
    });

    return _copyObject;

}


export function replaceInPath(path, options){
    let result = path;
    _.forOwn(options, (value, prop) => {
        result = result.replace('{' + prop + '}', value);
    });
    return result;
}

function repairPath(path){
    if(path.substr(0, 1) !== '.'){
        path = './' + path;
    }
    return path;
}
