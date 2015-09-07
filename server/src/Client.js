import fs from 'fs-extra';
import request from 'request';
import FileManager from './FileManager.js';

const defaultConfiguration = {
    serviceURL: 'http://helmetrex.com/rbs'
    //serviceURL: 'http://localhost/rbs'
};

class Client {

    constructor (configuration = defaultConfiguration) {
        this.configModel = configuration;
        this.fileManager = new FileManager();
    }

    setupUserCredentials(options){
        return new Promise( (resolve, reject) => {
            this.configModel.user = options.user;
            this.configModel.pass = options.pass;
            resolve();
        });
    }

    removeUserCredentials(){
        return new Promise( (resolve, reject) => {
            this.configModel.user = null;
            this.configModel.pass = null;
            resolve();
        });
    }

    getUser(){
        return this.configModel.user;
    }

    post (methodName, body, isAuth = false) {
        return new Promise( (resolve, reject) => {
            const url = this.configModel.serviceURL + '/' + methodName;
            var requestOptions = {
                uri: url,
                method: 'POST',
                json: true,
                body: body
            };
            if (isAuth) {
                if (this.configModel.user && this.configModel.pass) {
                    requestOptions.auth = {
                        'user': this.configModel.user,
                        'pass': this.configModel.pass,
                        'sendImmediately': true
                    }
                } else {
                    reject('Specify user name and password or create new account.');
                }
            }
            try {
                request(
                    requestOptions,
                    (error, response, body) => {
                        if (response) {
                            if (response.statusCode !== 200) {
                                if (response.statusCode === 401) {
                                    reject('User is not authenticated');
                                } else {
                                    reject('Got error code ' + response.statusCode + ' processing request to ' + url);
                                }
                            } else if (error) {
                                reject('Error connection to ' + this.configModel.serviceURL);
                            } else {
                                if (body.error === true) {
                                    let errorMessage = "Error: ";
                                    if(body.errors && body.errors.length > 0){
                                        body.errors.map( errorStr => {
                                            errorMessage += errorStr + ', ';
                                        });
                                    }
                                    reject(errorMessage.substr(0, errorMessage.length - 2));
                                } else {
                                    resolve(body.data);
                                }
                            }
                        } else {
                            reject('Error connection to ' + this.configModel.serviceURL);
                        }
                    }
                )
            } catch (e) {
                reject('Error: ' + e.message);
            }
        });
    }

    download(methodName, body, isAuth = false) {
        return new Promise( (resolve, reject) => {
            const requestBody = body;
            const url = this.configModel.serviceURL + methodName;
            let requestOptions = {
                uri: url,
                headers: {'Content-type': 'application/json'},
                method: 'POST',
                body: JSON.stringify(requestBody),
                encoding: null
            };
            if (isAuth) {
                if (this.configModel.user && this.configModel.pass) {
                    requestOptions.auth = {
                        'user': this.configModel.user,
                        'pass': this.configModel.pass,
                        'sendImmediately': true
                    }
                } else {
                    reject('Specify user name and password or create new account.');
                }
            }
            try {
                request(
                    requestOptions,
                    (error, response, body) => {
                        if (response) {
                            if (response.statusCode !== 200) {
                                if (response.statusCode === 401) {
                                    reject('User is not authenticated');
                                } else {
                                    reject('Got error code ' + response.statusCode + ' processing request to ' + url);
                                }
                            } else if (error) {
                                reject('Error connection to ' + this.configModel.serviceURL);
                            } else {
                                resolve(body);
                            }
                        } else {
                            reject('Error connection to ' + this.configModel.serviceURL);
                        }
                    }
                )
            } catch (e) {
                reject('Error: ' + e.message);
            }
        });

    }

    downloadGet(methodName, isAuth = false) {
        return new Promise( (resolve, reject) => {
            const url = this.configModel.serviceURL + methodName;
            let requestOptions = {
                uri: url,
                method: 'GET',
                encoding: null
            };
            if (isAuth) {
                if (this.configModel.user && this.configModel.pass) {
                    requestOptions.auth = {
                        'user': this.configModel.user,
                        'pass': this.configModel.pass,
                        'sendImmediately': true
                    }
                } else {
                    reject('Specify user name and password or create new account.');
                }
            }
            try {
                request(
                    requestOptions,
                    (error, response, body) => {
                        if (response) {
                            if (response.statusCode !== 200) {
                                if (response.statusCode === 401) {
                                    reject('User is not authenticated');
                                } else {
                                    reject('Got error code ' + response.statusCode + ' processing request to ' + url);
                                }
                            } else if (error) {
                                reject('Error connection to ' + this.configModel.serviceURL);
                            } else {
                                resolve(body);
                            }
                        } else {
                            reject('Error connection to ' + this.configModel.serviceURL);
                        }
                    }
                )
            } catch (e) {
                reject('Error: ' + e.message);
            }
        });

    }

    upload(option, isAuth = false) {
        return new Promise( (resolve, reject) => {
            const url = this.configModel.serviceURL + option.url;
            let requestOptions = {
                uri: url,
                method: 'POST'
            };
            if (isAuth) {
                if (this.configModel.user && this.configModel.pass) {
                    requestOptions.auth = {
                        'user': this.configModel.user,
                        'pass': this.configModel.pass,
                        'sendImmediately': true
                    }
                } else {
                    reject('Specify user name and password or create new account.');
                }
            }
            requestOptions.formData = {};
            if (option.filePaths && option.filePaths.length > 0) {
                option.filePaths.map( (filePath, index) => {
                    requestOptions.formData['file_' + index] = fs.createReadStream(filePath);
                });
            } else {
                reject('Files for uploading were not specified.');
            }
            try {
                request(
                    requestOptions,
                    (error, response, body) => {
                        if (response) {
                            if (response.statusCode !== 200) {
                                if (response.statusCode === 401) {
                                    reject('User is not authenticated');
                                } else {
                                    reject('Got error code ' + response.statusCode + ' processing request to ' + url);
                                }
                            } else if (error) {
                                reject('Error connection to ' + this.configModel.serviceURL);
                            } else if (body) {
                                if (body.error === true) {
                                    let errorMessage = "Error: ";
                                    if(body.errors && body.errors.length > 0){
                                        body.errors.map( errorStr => {
                                            errorMessage += errorStr + ', ';
                                        });
                                    }
                                    reject(errorMessage.substr(0, errorMessage.length - 2));
                                } else {
                                    resolve(body.data);
                                }
                            }
                        } else {
                            reject('Error connection to ' + this.configModel.serviceURL);
                        }
                    }
                )
            } catch (e) {
                reject('Error: ' + e.message);
            }
        });
    }

}

export default Client;
