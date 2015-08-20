'use strict';

var validator = require('validator');
var React = require('react');
var marked = require('marked');
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
var AceEditor = require('../element/AceEditor.js');
var ModalPageInfoEditorStore = require('../../store/modal/ModalPageInfoEditorStore.js');
var ModalPageInfoEditorActions = require('../../action/modal/ModalPageInfoEditorActions.js');

var ModalPageInfoEditor = React.createClass({

    _handleClose: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalPageInfoEditorActions.hideModal();
    },

    _handleSave: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalPageInfoEditorActions.saveProperties(
            {
                propsScript: this.refs.pagePropsEditor ? this.refs.pagePropsEditor.getSourceCode() : null,
                pageName: this.state.pageName,
                pageTitle: this.state.pageTitle
            }
        );
    },

    validationStatePageName: function(){
        if(this.state.pageName && this.state.pageName.length > 0 && validator.isAlphanumeric(this.state.pageName)){
            return 'has-success';
        } else {
            return 'has-error';
        }
    },

    handlePageNameChange: function(){
        this.setState({
            pageName: React.findDOMNode(this.refs.pageNameInput).value
        });
    },

    handlePageTitleChange: function(){
        this.setState({
            pageTitle: React.findDOMNode(this.refs.pageTitleInput).value
        });
    },

    getInitialState: function () {
        return ModalPageInfoEditorStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentDidMount: function() {
        this.unsubscribe = ModalPageInfoEditorStore.listen(this.onModelChange);
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },

    getDefaultProps: function () {
        return {
            onHide: ModalPageInfoEditorActions.hideModal
        };
    },

    render: function(){
        var containerStyle={
            marginTop: '1em',
            width: '100%'
        };
        var tabPanes = [];
        var alerts = [];

        if(this.state.errors && this.state.errors.length > 0){
            for(var i = 0; i < this.state.errors.length; i++){
                var stringError = JSON.stringify(this.state.errors[i]);
                alerts.push(
                    <p className='text-danger' key={'serror' + i}><strong>{stringError}</strong></p>
                );
            }
        }

        tabPanes.push(
            <TabPane key={tabPanes.length + 1} eventKey={tabPanes.length + 1} tab='Page info'>

                <table style={{width: '100%', height: '400px'}}>
                    <tr>
                        <td style={{width: '20%'}}></td>
                        <td style={{height: '100%', verticalAlign: 'middle'}}>
                            <div className={'form-group ' + this.validationStatePageName()}>
                                <label htmlFor='pageNameElement'>Page name:</label>
                                <input id='pageNameElement'
                                       ref='pageNameInput'
                                       className="form-control input-sm"
                                       type="text"
                                       placeholder='Page name'
                                       value={this.state.pageName}
                                       onChange={this.handlePageNameChange}
                                    />
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor='pageTitleElement'>Page title:</label>
                                <input id='pageTitleElement'
                                       ref='pageTitleInput'
                                       className="form-control input-sm"
                                       type="text"
                                       placeholder='Page title'
                                       value={this.state.pageTitle}
                                       onChange={this.handlePageTitleChange}
                                    />
                            </div>
                        </td>
                        <td style={{width: '20%'}}></td>
                    </tr>
                </table>
            </TabPane>
        );

        tabPanes.push(
            <TabPane key={tabPanes.length + 1} eventKey={tabPanes.length + 1} tab='Meta info'>
                <AceEditor
                    ref='pagePropsEditor'
                    sourceCode={this.state.propsScript}
                    style={{marginTop: '1em', height: '400px', width: '100%'}}/>

            </TabPane>
        );

        if(this.state.documentMarkdown){
            tabPanes.push(
                <TabPane key={tabPanes.length + 1} eventKey={tabPanes.length + 1} tab='Read Me'>
                    <div style={{height: '400px', marginTop: '1em', width: '100%', overflow: 'auto'}}>
                        <div style={{width: '100%', padding: '0 2em 0 2em'}}>
                            <div dangerouslySetInnerHTML={{__html: marked(this.state.documentMarkdown)}} >
                            </div>
                        </div>
                    </div>
                </TabPane>
            );
        }

        return (
            <Modal show={this.state.isModalOpen}
                   onHide={this.props.onHide}
                   dialogClassName='umy-modal-overlay'
                   backdrop={true}
                   keyboard={true}
                   bsSize='medium'
                   ref='dialog'
                   animation={true}>
                {/*<Modal.Header closeButton={false} aria-labelledby='contained-modal-title'>
                 <Modal.Title id='contained-modal-title'></Modal.Title>
                 </Modal.Header>*/}
                <Modal.Body>
                    {alerts}
                    <TabbedArea defaultActiveKey={1}>
                        {tabPanes}
                    </TabbedArea>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this._handleClose}>Cancel</Button>
                    <Button onClick={this._handleSave} bsStyle="primary">Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }

});

module.exports = ModalPageInfoEditor;
