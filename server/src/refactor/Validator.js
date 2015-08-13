import _ from 'lodash';
import path from 'path';
import FileManager from './FileManager.js';

class Validator {

    constructor(){
        this.fileManager = new FileManager();
    }

    validateEmptyDir(dirPath){
        return this.fileManager.checkDirIsEmpty(dirPath);
    }

    validateOptions(options, props){
        return new Promise((resolve, reject) => {
            if(!options){
                reject('Options is not specified');
            } else {
                let notFound = [];
                if(_.isArray(props)){
                    props.map( item => {
                        if( _.isUndefined(options[item]) || _.isNull(options[item])){
                            notFound.push(item);
                        }
                    });
                } else if(_.isString(props)){
                    if( _.isUndefined(options[props]) || _.isNull(options[props]) ){
                        notFound.push(props);
                    }
                }
                if(notFound.length === 1){
                    reject('Option is not available or null: ' + _(notFound).toString());
                } else if(notFound.length > 1) {
                    reject('Options is not available or null: ' + _(notFound).toString());
                } else {
                    resolve();
                }
            }
        });
    }

}

export default Validator;
