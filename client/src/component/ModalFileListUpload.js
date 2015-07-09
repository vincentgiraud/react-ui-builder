'use strict';

var _ = require('underscore');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var Panel = ReactBootstrap.Panel;
var Alert = ReactBootstrap.Alert;
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var InputValue = require('./element/InputValue.js');
var ProjectNameInput = require('./element/ProjectNameInput.js');
var ProjectDescriptionInput = require('./element/ProjectDescriptionInput.js');
var CollapsibleHorizontalDivider = require('./element/CollapsibleHorizontalDivider.js');

var ModalFileListUploadTriggerActions = require('../action/ModalFileListUploadTriggerActions.js');
var ApplicationActions = require('../action/ApplicationActions.js');

var ModalFileListUpload = React.createClass({

    getInitialState: function(){
        return {
            dataList: this.props.dataList,
            projectName: this.props.projectName,
            projectDescription: this.props.projectDescription,
            projectLicense: this.props.projectLicense
        }
    },

    getDefaultProps: function () {
        return {
            onRequestHide: null
        };
    },

    componentDidMount: function(){
        var $domNode = $(React.findDOMNode(this));
        $domNode.css({
            'z-index': 1060
        });
        $domNode.find('.modal-dialog').addClass('modal-lg');
    },

    componentWillUnmount: function(){
    },

    _handleUploadFiles: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalFileListUploadTriggerActions.uploadFiles(
            {
                files: this.state.dataList,
                projectName: this.refs.projectNameInput.getValue(),
                projectDescription: this.refs.projectDescriptionInput.getValue(),
                projectLicense: this.refs.licenseInput.getValue()
            }
        );
    },

    _handleClose: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalFileListUploadTriggerActions.hideModal();
    },

    _handleItemChange: function(e){
        var newState = {
            dataList: this.state.dataList
        };
        newState.dataList[e.currentTarget.value].checked = e.currentTarget.checked;
        this.setState(newState);
    },

    _handleLoginForm: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalFileListUploadTriggerActions.hideModal();
        ApplicationActions.goToSignInForm();
    },

    render: function(){

        var alerts = [];
        if(this.props.errors && this.props.errors){
            this.props.errors.map(function(error, index){
                alerts.push(
                    <p className='text-danger' key={'error' + index}><strong>{JSON.stringify(error)}</strong></p>
                );
            });
            alerts.push(<hr/>);
        }
        var modalContent = null;
        var modalFooter = null;
        if(this.props.stage === 'chooseFiles'){
            modalContent = (
            <Grid fluid={true}>
                <Row>
                    <Col xs={7} md={7} sm={7} lg={7}>
                        <ProjectNameInput value={this.state.projectName} ref='projectNameInput'/>
                        <ProjectDescriptionInput value={this.state.projectDescription} ref='projectDescriptionInput'/>
                        <InputValue
                            ref='licenseInput'
                            type='text'
                            value={this.state.projectLicense}
                            label='License:' placeholder='MIT'/>
                        <CollapsibleHorizontalDivider title='Legal stuff'>
                            <div style={{padding: '0.5em'}}>
                                <p>Data published to the React UI Builder gallery is not part of React UI Builder itself,
                                    and is the sole property of the publisher.</p>
                                <p>Any data published to the React UI Builder gallery (including user account information)
                                    may be removed or modified at the sole discretion of the UMyProto Team administration.</p>
                            </div>
                        </CollapsibleHorizontalDivider>
                    </Col>
                    <Col xs={5} md={5} sm={5} lg={5}>
                        <p style={{borderBottom: '1px solid #cdcdcd', width: '100%'}}><strong>Files:</strong></p>
                        <div style={{maxHeight: '20em', overflow: 'auto'}}>
                            {this.state.dataList.map(function(item, index){
                                var label = null;
                                if(item.isDirectory){
                                    label = <div><span className='fa fa-folder fa-fw'></span>&nbsp;&nbsp;<strong>{item.name}</strong></div>;
                                } else {
                                    label = <div><span className='fa fa-file-o fa-fw'></span>&nbsp;&nbsp;{item.name}</div>;
                                }
                                return (
                                    <Input
                                        type="checkbox"
                                        key={'checkBoxItem' + index}
                                        checked={item.checked}
                                        label={label}
                                        value={index}
                                        disabled={item.mandatory}
                                        onChange={this._handleItemChange} />
                                );
                            }.bind(this))}
                        </div>
                    </Col>
                </Row>
            </Grid>
            );
            modalFooter = (
                <div className="modal-footer">
                    {alerts.length > 0 ? null : <Button onClick={this._handleUploadFiles} bsStyle="primary">Upload files</Button>}
                    <Button onClick={this._handleClose}>Cancel</Button>
                </div>
            );
        } else if(this.props.stage === 'uploadingFiles') {
            modalContent = (
                <h5>Uploading files please wait ...</h5>
            );
        } else if(this.props.stage === 'uploadingEnd'){
            modalContent = (
                <h5>Project is uploaded successfully. Please go to gallery to check.</h5>
            );
            modalFooter = (
                <div className="modal-footer">
                    <Button onClick={this._handleClose}>Close</Button>
                </div>
            );
        } else if(this.props.stage === 'serverConnectionError'){
            modalContent = (
                <h5>Error connection with server. If you are not authenticated, please sign in on &nbsp;
                    <a href='#' onClick={this._handleLoginForm}>this form</a>
                </h5>
            );
            modalFooter = (
                <div className="modal-footer">
                    <Button onClick={this._handleClose}>Close</Button>
                </div>
            );
        }

        return (
            <Modal {...this.props} title='Uploading project files to gallery' animation={true} backdrop={false}>
                <div className="modal-body">
                    {alerts}
                    {modalContent}
                </div>
                {modalFooter}
            </Modal>
        );
    }

});

module.exports = ModalFileListUpload;
