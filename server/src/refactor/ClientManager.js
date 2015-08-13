import _ from 'lodash';
import path from 'path';
import Client from './Client.js';
import FileManager from './FileManager.js';

class ClientManager {

    constructor(){
        this.client = new Client();
        this.fileManager = new FileManager();
    }

    initUserCredentials(options){
        return this.client.setupUserCredentials(options).then(() => { return 'OK'});
    }

    removeUserCredentials(options){
        return this.client.removeUserCredentials().then(() => { return 'OK'});
    }

    getAllProjects(options){
        return this.client.post('/getProjectGalleryList', options);
    }

    loadUserProfile(){
        var userProfile = {
            login: this.client.getUser()
        };
        return this.client.post("/secure/getUserProfile", userProfile, true)
            .then( () => {
                return { userName: this.client.getUser() };
            });
    }

    createUserProfile(options){
        var userProfile = {
            login: options.user,
            pwd: options.pass,
            email: options.email
        };
        return this.client.post("/addUser", userProfile);
    }

    downloadGalleryFile(options){
        return this.client.download( '/downloadGalleryFile', _.pick(options, ['id', 'packageFileName']) );
    }

}

export default ClientManager;
