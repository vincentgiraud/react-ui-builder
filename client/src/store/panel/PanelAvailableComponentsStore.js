'use strict';

var _ = require('underscore');
var Reflux = require('reflux');
var HtmlComponents = require('../../api/HtmlComponents.js');
var Server = require('../../api/Server.js');
var PanelAvailableComponentsActions = require('../../action/panel/PanelAvailableComponentsActions.js');
var Repository = require('../../api/Repository.js');
var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');
var PopoverComponentVariantActions = require('../../action/element/PopoverComponentVariantActions.js');

var defaultsIndexMap = {};

var PanelAvailableComponentsStore = Reflux.createStore({
    listenables: PanelAvailableComponentsActions,
    model: {},


    getModel: function(){
        this.model.itemsTree = Repository.getComponentsTree();
        return this.model;
    },

    onRefreshComponentList: function(){
        //PopoverComponentVariantActions.hide();
        this.trigger(this.getModel());
    },

    onSelectComponentItem: function(componentId){
        this.model.selectedComponentId = componentId;

        this.model.componentDefaults = [];
        //PopoverComponentVariantActions.hide();

        Server.invoke('loadComponentDefaults', {componentName: componentId},
            function(err){
                var htmlDefaults = HtmlComponents[componentId];
                if(htmlDefaults){
                    this.model.componentDefaults.push({
                        variantName: 'Default',
                        type: componentId,
                        props: htmlDefaults.props,
                        children: htmlDefaults.children,
                        text: htmlDefaults.text
                    });
                } else {
                    this.model.componentDefaults.push({
                        type: componentId
                    });
                }
                this.model.defaultsIndex = 0;
                Server.invoke('saveComponentDefaults',
                    {
                        componentName: componentId,
                        componentOptions: this.model.componentDefaults[0]
                    },
                    function(err){
                        //console.error(JSON.stringify(err));
                    },
                    function(response){
                        // do nothing
                    }
                );

                this.copyToClipboard(this.model.componentDefaults[this.model.defaultsIndex]);

            }.bind(this),
            function(response){
                this.model.componentDefaults = response.model;
                var defaultsIndex = defaultsIndexMap[componentId];
                if(!_.isNumber(defaultsIndex) || defaultsIndex >= this.model.componentDefaults.length){
                    defaultsIndex = 0;
                    defaultsIndexMap[componentId] = defaultsIndex;
                }

                this.model.defaultsIndex = defaultsIndex;
                // some defaults don't have type value
                this.model.componentDefaults[defaultsIndex].type = componentId;

                this.copyToClipboard(this.model.componentDefaults[defaultsIndex]);

            }.bind(this)
        );
    },

    onSelectComponentItemDefaultsIndex: function(componentId, index, previewOptions){
        if(previewOptions.showPreview === true){
            PopoverComponentVariantActions.show({
                componentId: componentId,
                defaults: this.model.componentDefaults[index],
                defaultsIndex: index,
                top: previewOptions.top,
                left: previewOptions.left,
                outerWidth: previewOptions.outerWidth,
                canDelete: true
            });
        } else {
            defaultsIndexMap[componentId] = index;
            this.model.defaultsIndex = index;
            this.copyToClipboard(this.model.componentDefaults[index]);
            //PopoverComponentVariantActions.hide();
        }
    },

    onDeleteDefaultsIndex: function(index){
        if(this.model.componentDefaults && this.model.componentDefaults.length > 1){
            this.model.componentDefaults.splice(index, 1);
            if(index >= this.model.componentDefaults.length){
                this.model.defaultsIndex = this.model.componentDefaults.length - 1;
            } else {
                this.model.defaultsIndex = index;
            }
            defaultsIndexMap[this.model.selectedComponentId] = this.model.defaultsIndex;
            this.copyToClipboard(this.model.componentDefaults[this.model.defaultsIndex]);

            Server.invoke('saveAllComponentDefaults',
                {
                    defaults: this.model.componentDefaults,
                    componentName: this.model.selectedComponentId
                },
                function(err){
                    console.error(JSON.stringify(err));
                },
                function(response){
                    // do nothing
                }
            );

            this.trigger(this.model);
        }
    },

    onDeselectComponentItem: function(){
        this.model.selectedComponentId = null;
        //PopoverComponentVariantActions.hide();
        this.trigger(this.model);
    },

    copyToClipboard: function(options){
        DeskPageFrameActions.startClipboardForOptions({ options:{
            type: options.type,
            props: options.props || {},
            children: options.children || [],
            text: options.text
        }});
        this.trigger(this.model);
    }
});

module.exports = PanelAvailableComponentsStore;
