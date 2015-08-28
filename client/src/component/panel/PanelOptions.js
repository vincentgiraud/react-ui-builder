'use strict';

var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var PanelOptionsStore = require('../../store/panel/PanelOptionsStore.js');
var PanelOptionsActions = require('../../action/panel/PanelOptionsActions.js');
var OptionInput = require('../element/OptionInput.js');
var CollapsiblePlusOptionInput = require('../element/CollapsiblePlusOptionInput.js');

var Panel = ReactBootstrap.Panel;
var PanelGroup = ReactBootstrap.PanelGroup;

var PanelOptions = React.createClass({


    getInitialState: function() {
        return PanelOptionsStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentDidMount: function() {
        this.unsubscribe = PanelOptionsStore.listen(this.onModelChange);
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },

    getDefaultProps: function() {
        return {};
    },

    handleAddNewProp: function(options){
        if(options.path && /^[a-zA-Z0-9.]+$/.test(options.path)){
            var valueObject = {};
            if(/^[0-9.]+$/.test(options.value)){
                _.set(valueObject, options.path, parseFloat(options.value));
            } else if(options.value === "true"){
                _.set(valueObject, options.path, true);
            } else if(options.value === "false"){
                _.set(valueObject, options.path, false);
            } else {
                _.set(valueObject, options.path, '' + options.value);
            }
            PanelOptionsActions.changeOptions(valueObject);
        }
    },

    render: function() {
        var style = {
            width: '100%',
            paddingTop: '5px',
            paddingRight: '5px'
        };
        var panelContent = null;
        if(this.state.props){

            var optionInputs = [];

            var props = this.state.props;

            _.forOwn(props, function(value, prop){
                if(_.isObject(value)){
                    _.forOwn(value, function(subValue, subProp){
                        if(!_.isObject(subValue)){
                            var valueObject = {};
                            var pathTo = prop + '.' + subProp;
                            _.set(valueObject, pathTo, subValue);
                            optionInputs.push(
                                <OptionInput
                                    key={pathTo}
                                    style={{marginTop: '0.5em', padding: '0 1em 0 1em'}}
                                    valueObject={valueObject}
                                    path={pathTo}
                                    focused={pathTo === this.state.focusedElementId}
                                    onDeleteValue={PanelOptionsActions.deleteOptions}
                                    onSetFocus={PanelOptionsActions.setFocusTo}
                                    onChangeValue={PanelOptionsActions.changeOptions}/>
                            );
                        }
                    }.bind(this));
                } else {
                    var valueObject = {};
                    var pathTo = prop;
                    _.set(valueObject, pathTo, value);
                    optionInputs.push(
                        <OptionInput
                            key={pathTo}
                            style={{marginTop: '0.5em', padding: '0 1em 0 1em'}}
                            valueObject={valueObject}
                            path={pathTo}
                            focused={pathTo === this.state.focusedElementId}
                            onDeleteValue={PanelOptionsActions.deleteOptions}
                            onSetFocus={PanelOptionsActions.setFocusTo}
                            onChangeValue={PanelOptionsActions.changeOptions}/>
                    );
                }
            }.bind(this));

            panelContent = (
                <div style={style}>
                    <div style={{position: 'relative'}}>
                        <div style={{width: '100%', overflow: 'auto'}}>
                            <pre style={{fontSize: '10px'}}>{JSON.stringify(this.state.satinizedProps, null, 2)}</pre>
                        </div>
                        <CollapsiblePlusOptionInput
                            style={{position: 'absolute', top: 'calc(100% - 1.8em)', width: '100%', zIndex: '1030'}}
                            onCommit={this.handleAddNewProp}/>
                    </div>
                    {optionInputs}
                </div>
            );
        } else {
            //<div style={{ padding: '0.5em 0.5em 1.5em 0.5em' }}>
            //
            //</div>
            panelContent = (
                <div style={style}>
                    <h4 className='text-center'>Nothing is selected</h4>
                </div>
            );
        }
        return panelContent;
    }

});

module.exports = PanelOptions;