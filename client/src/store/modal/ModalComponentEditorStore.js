'use strict';

var Reflux = require('reflux');
var esprima = require('esprima-fb');
var validator = require('validator');

var Server = require('../../api/Server.js');
var Repository = require('../../api/Repository.js');
var Common = require('../../api/Common.js');
var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var ModalComponentEditorActions = require('../../action/modal/ModalComponentEditorActions.js');
var ModalComponentGeneratorActions = require('../../action/modal/ModalComponentGeneratorActions.js');

var defaultModel = {
    isModalOpen: false
};

var ModalComponentEditorStore = Reflux.createStore({
    model: defaultModel,
    listenables: ModalComponentEditorActions,

    onShowModal: function(options){
        if(!this.model.isModalOpen){

            this.model.selectedUmyId = options.selectedUmyId;
            this.model.errorReadingSourceFile = false;
            this.model.documentMarkdown = undefined;

            var searchResult = Repository.findInCurrentPageModelByUmyId(this.model.selectedUmyId);
            if(searchResult){

                var copy = searchResult.found;
                Common.cleanPropsUmyId(copy);
                copy.props = copy.props || {};

                this.model.componentText = copy.text;
                this.model.propsScript = JSON.stringify(copy.props, null, '\t');
                this.model.errors = [];
                this.model.sourceCode = null;
                //
                var componentTypeValue = Repository.getComponentFromTree(copy.type);
                this.model.componentName = copy.type;
                this.model.componentGroup = componentTypeValue.group;
                //
                this.model.isModalOpen = true;
                this.model.showTextEditor = !!this.model.componentText;


                Server.invoke('readComponentDocument', {componentName: copy.type},
                    function(errors){
                        this.model.errors = errors;
                        this.trigger(this.model);
                    }.bind(this),
                    function(response){
                        this.model.documentMarkdown = response;

                        if(!componentTypeValue.value || !componentTypeValue.value.absoluteSource){

                            this.trigger(this.model);

                        } else if(componentTypeValue.value.absoluteSource) {

                            this.model.sourceFilePath = componentTypeValue.value.absoluteSource;

                            Server.invoke('readComponentCode', {filePath: componentTypeValue.value.absoluteSource},
                                function(errors){
                                    this.model.errors = errors;
                                    this.model.errorReadingSourceFile = true;
                                    this.trigger(this.model);
                                }.bind(this),
                                function(data){

                                    this.model.sourceCode = data;
                                    this.trigger(this.model);



                                }.bind(this)
                            );
                        }

                    }.bind(this)
                );

            }
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
    },

    onSaveProperties: function(options){
        try{

            this.model.isModalOpen = true;

            var projectModel = Repository.getCurrentProjectModel();
            var searchResult = null;
            for(var i = 0; i < projectModel.pages.length; i++){
                if(!searchResult){
                    searchResult = Common.findByUmyId(projectModel.pages[i], this.model.selectedUmyId);
                }
            }

            this.model.propsScript = options.propsScript;
            var changedProps = JSON.parse(this.model.propsScript);
            changedProps['data-umyid'] = this.model.selectedUmyId;
            searchResult.found.props = changedProps;

            if(searchResult.found.text){
                if(options.componentText){
                    searchResult.found.text = options.componentText;
                } else {
                    throw new Error('Text value is empty. Please enter text.');
                }
            }
            this.model.sourceCode = options.sourceCode;

            if(options.sourceCode){

                var componentTypeValue = Repository.getComponentFromTree(this.model.componentName);

                    Server.invoke('rewriteComponentCode',
                        {
                            filePath: componentTypeValue.value.absoluteSource,
                            sourceCode: options.sourceCode
                        },
                        function(err){
                            this.model.errors = [JSON.stringify(err)];
                            this.trigger(this.model);
                        }.bind(this),
                        function(response){

                            Repository.renewCurrentProjectModel(projectModel);
                            DeskPageFrameActions.renderPageFrame();
                            //
                            this.model.isModalOpen = false;
                            this.trigger(this.model);
                        }.bind(this)
                    );

            } else {

                Repository.renewCurrentProjectModel(projectModel);
                DeskPageFrameActions.renderPageFrame();

                this.model.isModalOpen = false;
                this.trigger(this.model);
            }
        } catch(e){
            this.model.errors = [e.message];
            this.trigger(this.model);
        }
    },

    onStartWizardGenerateComponent: function(options){
        this.model.isModalOpen = false;
        this.trigger(this.model);
        ModalComponentGeneratorActions.showModal({ selectedUmyId: options.selectedUmyId });
    }

});

module.exports = ModalComponentEditorStore;
