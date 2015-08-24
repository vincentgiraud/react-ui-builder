'use strict';

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Select = require('react-select');
var Repository = require('../../api/Repository.js');

var SelectComponentName = React.createClass({

    getInitialState: function(){

        var components = [];
        var tree = Repository.getComponentsTree();
        _.forOwn(tree, function(group, groupName) {
            if (_.isObject(group)) {
                _.forOwn(group, function (componentTypeValue, componentId) {
                    components.push(
                        {value: componentId, label: componentId}
                    )
               });
            }
        });

        return {
            listValue: components
        }
    },

    componentDidMount: function(){
        var $element = $(React.findDOMNode(this.refs.selectElement)).find('input');
        $element.on('keydown', this.handleOnKeyDown);
        $element.focus();
    },

    handleClose: function(e){
        e.stopPropagation();
        e.preventDefault();
        if(this.props.onClose){
            this.props.onClose();
        }
    },

    handleChange: function(val){
        if(this.props.onChangeValue){
            this.props.onChangeValue(val);
        }
    },

    handleOnKeyDown: function(e){
        if(e.keyCode == 27){
            this.handleClose(e);
        }
    },

    render: function() {
        return (
            <div {...this.props}>
                <div style={{display: 'table', width: '100%'}}>
                    <div style={{display: 'table-row'}}>
                        <div style={{display: 'table-cell', textAlign: 'left', verticalAlign: 'middle'}}>
                            <button className="btn btn-default btn-warning" style={{height: '2.4em'}} onClick={this.handleClose}>
                                <span className="fa fa-times"></span>
                            </button>
                        </div>
                        <div style={{display: 'table-cell', width: '100%', verticalAlign: 'middle'}}>
                            <Select
                                ref='selectElement'
                                options={this.state.listValue}
                                clearable={false}
                                placeholder='Select component...'
                                value=''
                                onChange={this.handleChange} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = SelectComponentName;
