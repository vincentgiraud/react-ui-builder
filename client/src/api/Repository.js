'use strict';

var _ = require('lodash');
var Common = require('./Common.js');
var Server = require('./Server.js');
var HtmlComponents = require('./HtmlComponents.js');
//var userProfile = null;
//var currentProject = null;

var currentProjectModel = null;
var currentProjectName = null;
var currentPageModel = null;
var currentPageIndex = null;
var currentPageDomNodes = {};
var currentPageWindow = null;
var currentPageDocument = null;
var componentsTree = null;
//var currentPageComponentDefaults = null;
var currentProjectDocument = null;

var htmlForDesk = null;

var flatDefaults = null;
//var clipboardForOptions = null;
var redoPool = [];
var undoPool = [];
var callbackAfterProjectModelRenew = null;

function findComponent(index, componentName, level, result){
    var _result = result || {};
    if(index && _.isObject(index) && level <= 1){
        level++;
        _.forOwn(index, function(value, key){
            if(!_result.value){
                if(key === componentName){
                    _result.value = value;
                } else if(value && _.isObject(value)){
                    _result = findComponent(value, componentName, level, _result);
                    if(_result.value){
                        _result.group = key;
                    }
                }
            }
        });
    }
    return _result;
}

var Repository = {

    saveProjectModel: function(callback){
        Server.invoke('saveProjectModel', {
            model: currentProjectModel
        }, function(err){
            console.error(JSON.stringify(err));
        }, function(response){
        });
    },

    setCurrentProjectModel: function(projectModel){
        undoPool = [];
        currentProjectModel = projectModel;
        currentProjectName = projectModel.name;
        _.each(currentProjectModel.pages, function(page){
            Common.setupPropsUmyId(page, true);
        });
    },

    getCurrentProjectModel: function(){
        return Common.fulex(currentProjectModel);
    },

    getCurrentProjectName: function(){
        return currentProjectName;
    },

    setCurrentPageModel: function(pageName){
        _.each(currentProjectModel.pages, function(page, index){
            if(page.pageName === pageName){
                currentPageModel = page;
                currentPageIndex = index;
            }
        });
    },

    getCurrentProjectPageNames: function(){
        var pageNames = [];
        _.forEach(currentProjectModel.pages, function(page){
            pageNames.push(page.pageName);
        });
        return pageNames;
    },

    setCurrentPageModelByIndex: function(pageIndex){
        if(currentProjectModel.pages && currentProjectModel.pages.length > pageIndex){
            currentPageModel = currentProjectModel.pages[pageIndex];
            currentPageIndex = pageIndex;
        }
    },

    getCurrentPageIndex: function(){
        return currentPageIndex;
    },

    deleteCurrentPageModel: function(callback){
        if(currentProjectModel.pages && currentProjectModel.pages.length > 1){
            this._appendUndoState();
            //
            var newPages = [];
            for(var i = 0; i < currentProjectModel.pages.length; i++){
                if(i != currentPageIndex){
                    newPages.push(currentProjectModel.pages[i]);
                }
            }
            currentProjectModel.pages = newPages;
            newPages = null;
            if(currentPageIndex >= currentProjectModel.pages.length){
                currentPageIndex = currentProjectModel.pages.length - 1;
            }
            currentPageModel = currentProjectModel.pages[currentPageIndex];
            //
            this.saveProjectModel(callback);
        }
    },

    _appendUndoState: function(){
        if(undoPool.length >= 50){
            undoPool = _.rest(undoPool, 50);
        }
        undoPool.push({
            projectModel: Common.fulex(currentProjectModel),
            pageIndex: currentPageIndex
        });
    },
    //
    //_appendRedoState: function(){
    //    if(redoPool.length >= 50){
    //        redoPool = _.rest(redoPool, 50);
    //    }
    //    redoPool.push({
    //        projectModel: Common.fulex(currentProjectModel),
    //        pageIndex: currentPageIndex
    //    });
    //},
    //
    undoCurrentProjectModel: function(callback){
        if(undoPool.length > 0){
            var undoState = _.last(undoPool);
            currentProjectModel = undoState.projectModel;
            this.setCurrentPageModelByIndex(undoState.pageIndex);
            undoPool = _.initial(undoPool);
            this.saveProjectModel(callback);
        }
    },
    //
    //redoCurrentProjectModel: function(){
    //    if(redoPool.length > 0){
    //        this._appendUndoState();
    //        var redoState = _.last(redoPool);
    //        currentProjectModel = redoState.projectModel;
    //        this.setCurrentPageModelByIndex(redoState.pageIndex);
    //        redoPool = _.initial(redoPool);
    //    }
    //},

    getUndoSize: function(){
        return undoPool.length;
    },

    renewCurrentProjectModel: function(projectModel, callback){
        this._appendUndoState();
        currentProjectModel = projectModel;
        _.each(currentProjectModel.pages, function(page){
            Common.setupPropsUmyId(page);
        });
        this.setCurrentPageModelByIndex(currentPageIndex);

        this.saveProjectModel(callback);
    },

    cleanProjectModel: function(projectModel){
        var test = function(type){
            var testComponent = findComponent(componentsTree, type, 0);
            return !!testComponent.value;
        };
        if(projectModel && projectModel.pages){
            _.each(projectModel.pages, function(page){
                Common.deleteInalidTypeItems(page, test);
            });
        }
    },

    getCurrentPageModel: function(){
        return Common.fulex(currentPageModel);
    },

    getCurrentPageName: function(){
        return currentPageModel.pageName;
    },

    setCurrentPageName: function(pageName){
        currentPageModel.pageName = pageName;
    },

    getCurrentPageTitle:function(){
        return currentPageModel.pageTitle;
    },

    setCurrentPageTitle:function(pageTitle){
        currentPageModel.pageTitle = pageTitle;
    },

    getCurrentPageMetaInfo: function(){
        var result = currentPageModel.pageMetaInfo || [];
        return _.clone(result);
    },

    setCurrentPageMetaInfo: function(metaInfo){
        currentPageModel.pageMetaInfo = _.clone(metaInfo);
    },

    getTemplatePageModel: function(){
        return {
            pageName: 'UnnamedPage',
            children: [
                {
                    type: 'h3',
                    props: {
                        style: {
                            padding: '1em',
                            textAlign: 'center'
                        }
                    },
                    children: [
                        {
                            type: 'span',
                            text: 'This is an empty page. ' +
                            'To add new component select needed element on left-side ' +
                            'panel and click on an element on the page where you want to put new component.'
                        }
                    ]
                }
            ]
        };
    },

    findInCurrentPageModelByUmyId: function(umyId){
        var searchResult = Common.findByUmyId(currentPageModel, umyId);
        return Common.fulex(searchResult);
    },

    resetCurrentPageDomNodes: function(){
        currentPageDomNodes = Common.getFlatUmyIdModel(currentPageModel);
    },

    setCurrentPageDomNode: function(key, domNode){
        if(currentPageDomNodes[key]){
            currentPageDomNodes[key].domElement = domNode;
        }
    },

    getCurrentPageDomNode: function(key){
        return currentPageDomNodes[key];
    },

    getCurrentPageDomNodes: function(){
        return currentPageDomNodes;
    },

    setCurrentPageWindow: function(window){
        currentPageWindow = window;
    },

    getCurrentPageWindow: function(){
        return currentPageWindow;
    },

    setCurrentPageDocument: function(doc){
        currentPageDocument = doc;
    },

    getCurrentPageDocument: function(){
        return currentPageDocument;
    },

    setComponentsTree: function(lib){
        componentsTree = lib;
        //
        var components = {};
        //
        _.forOwn(HtmlComponents, function(component, componentName){
            components[componentName] = {
                type: 'Reference'
            };
        });
        componentsTree['Html'] = components;
    },

    getComponentsTree: function(){
        return componentsTree;
    },

    getComponentFromTree: function(componentName){
        if(componentsTree){
            return findComponent(componentsTree, componentName, 0);
        }
    },

    getComponentsTreeGroups: function(){
        return _.keys(componentsTree);
    },

    setHtmlForDesk: function(path){
        htmlForDesk = path;
    },

    getHtmlForDesk: function(){
        return htmlForDesk;
    },

    setCurrentProjectDocument: function(documentObj){
        currentProjectDocument = documentObj;
    },

    getCurrentProjectDocument: function(){

        return currentProjectDocument;
    }


};

module.exports = Repository;
