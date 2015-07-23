'use strict';

var Reflux = require('reflux');
var esprima = require('esprima-fb');
var validator = require('validator');

var Server = require('../../api/Server.js');
var Repository = require('../../api/Repository.js');
var Common = require('../../api/Common.js');
var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var ModalPropsEditorTriggerActions = require('../../action/modal/ModalPropsEditorTriggerActions.js');

var defaultModel = {
    isModalOpen: false
};

var ModalPropsEditorTriggerStore = Reflux.createStore({
    model: defaultModel,
    listenables: ModalPropsEditorTriggerActions,

    onShowModal: function(options){
        if(!this.model.isModalOpen){
            //
            this.model.actionsSourceCode = false;
            this.model.storeSourceCode = false;
            this.model.wizard = 'None';
            this.model.isSourceCodeGenerated = false;
            //
            this.model.selectedUmyId = options.selectedUmyId;

            var searchResult = Repository.findInCurrentPageModelByUmyId(this.model.selectedUmyId);
            if(searchResult){
                //
                var copy = searchResult.found;
                Common.cleanPropsUmyId(copy);
                copy.props = copy.props || {};
                //
                //this.model.componentModel = copy;
                this.model.componentText = copy.text;
                this.model.propsScript = JSON.stringify(copy.props, null, '\t');
                this.model.errors = [];
                this.model.sourceCode = null;
                this.model.isProjectComponent = false;
                //
                var componentTypeValue = Repository.getComponentFromTree(copy.type);
                this.model.componentName = copy.type;
                this.model.componentGroup = componentTypeValue.group;
                //
                this.model.isModalOpen = true;
                //
                if(!componentTypeValue.value || componentTypeValue.value.type === 'Reference'){
                    //
                    this.trigger(this.model);
                    //
                } else if(componentTypeValue.value.type === 'ProjectComponent') {
                    //
                    this.model.isProjectComponent = true;
                    this.model.sourceFilePath = componentTypeValue.value.sourcePath;
                    //
                    Server.invoke('readJSFile', {filePath: componentTypeValue.value.sourcePath},
                        function(errors){
                            this.model.errors = errors;
                            this.trigger(this.model);
                        }.bind(this),
                        function(data){
                            this.model.sourceCode = data;
                            Server.invoke('loadFluxFiles',
                                {
                                    componentName: this.model.componentName
                                },
                                function(errors){
                                    this.model.errors = errors;
                                    this.trigger(this.model);
                                }.bind(this),
                                function(response){
                                    this.model.actionsSourceCode = response.actionsSourceCode;
                                    this.model.storeSourceCode = response.storeSourceCode;
                                    this.trigger(this.model);
                                }.bind(this)
                            );
                        }.bind(this)
                    );
                }
                //
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
            //
            this.model.isModalOpen = true;
            //
            var projectModel = Repository.getCurrentProjectModel();
            var searchResult = null;
            for(var i = 0; i < projectModel.pages.length; i++){
                if(!searchResult){
                    searchResult = Common.findByUmyId(projectModel.pages[i], this.model.selectedUmyId);
                }
            }
            //
            this.model.propsScript = options.propsScript;
            var changedProps = JSON.parse(this.model.propsScript);
            changedProps['data-umyid'] = this.model.selectedUmyId;
            searchResult.found.props = changedProps;
            //
            if(searchResult.found.text){
                if(options.componentText){
                    searchResult.found.text = options.componentText;
                } else {
                    throw new Error('Text value is empty. Please enter text.');
                }
            }
            this.model.actionsSourceCode = options.actionsSourceCode;
            this.model.storeSourceCode = options.storeSourceCode;
            this.model.sourceCode = options.sourceCode;

            Repository.renewCurrentProjectModel(projectModel);
            DeskPageFrameActions.renderPageFrame();
            //
            this.model.isModalOpen = false;
            this.trigger(this.model);
            //
        } catch(e){
            this.model.errors = [e.message];
            this.trigger(this.model);
        }
    },

    onSaveOptionsVariant: function(options){
        this.trigger(this.model);
    },


    onCancelWizard: function(){

        this.model.wizard = 'None';
        this.trigger(this.model);

    },

    onStartWizardGenerateComponent: function(){

        this.model.wizard = 'GenerateComponent';
        this.trigger(this.model);

    },

    onSubmitWizardGenerateComponent: function(options){

        this.model.wizard = 'None';

        this.model.isModalOpen = true;

        this.model.componentGroup = options.componentGroup;
        this.model.componentName = options.componentName;
        this.model.actionsSourceCode = options.actionsSourceCode;
        this.model.storeSourceCode = options.storeSourceCode;
        this.model.sourceCode = options.sourceCode;
        this.model.errors = [];

        this.model.isSourceCodeGenerated = true;

        this.trigger(this.model);
    }

});

module.exports = ModalPropsEditorTriggerStore;
