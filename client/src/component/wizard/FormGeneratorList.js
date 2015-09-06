'use strict';

var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;
var Badge = ReactBootstrap.Badge;
var PanelGroup = ReactBootstrap.PanelGroup;
var TabbedArea = ReactBootstrap.TabbedArea;
var TabPane = ReactBootstrap.TabPane;
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;

var FormGeneratorList = React.createClass({


    _handleBackStep: function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onBackStep) {
            this.props.onBackStep(this.getOptions());
        }
    },

    _handleSubmitStep: function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.onSubmitStep) {
            var generatorName = e.currentTarget.attributes['data-generator-name'].value;
            this.props.onSubmitStep({
                generatorName: generatorName
            });
        }
    },

    getOptions: function () {
        return {
        }
    },

    getInitialState: function () {
        return {
        }
    },

    getDefaultProps: function () {
        return {
            onSubmitStep: null,
            onBackStep: null
        };
    },

    componentDidMount: function () {
    },

    componentWillUnmount: function () {
    },

    render: function () {
        var generatorItems = [];
        if(this.props.generatorList && this.props.generatorList.length > 0){
            this.props.generatorList.map(function(generator, index){
                generatorItems.push(
                    <ListGroupItem key={'generator' + generator.config.name + index}
                                   style={{position: 'relative', cursor: 'pointer'}}
                                   data-generator-name={generator.config.name}
                                   onClick={this._handleSubmitStep}>
                        <span>{generator.config.description}</span>
                    </ListGroupItem>
                );
            }.bind(this));
        }
        return (
            <div style={this.props.formStyle}>
                <h5 className='text-center'>Select appropriate generators' pack</h5>
                <table style={{width: '100%'}}>
                    <tr>
                        <td style={{width: '20%'}}></td>
                        <td>
                            <div style={{ maxHeight: '22em', width: '100%', overflow: 'auto'}}>
                                <ListGroup fill>
                                    {generatorItems}
                                </ListGroup>
                            </div>
                        </td>
                        <td style={{width: '20%'}}></td>
                    </tr>
                </table>
                <div style={{display: 'table', textAlign: 'center', width: '100%', marginTop: '2em'}}>
                    <Button bsStyle='default' onClick={this._handleBackStep}>Back</Button>
                </div>
            </div>
        );
    }

});

module.exports = FormGeneratorList;
