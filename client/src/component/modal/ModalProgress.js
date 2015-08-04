'use strict';

var _ = require('underscore');
var React = require('react');
var Modal = require('react-bootstrap').Modal;
var ModalProgressStore = require('../../store/modal/ModalProgressStore.js');
var ModalProgressActions = require('../../action/modal/ModalProgressActions.js');

var ModalProgress = React.createClass({

    getInitialState: function () {
        return ModalProgressStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentDidMount: function() {
        this.unsubscribe = ModalProgressStore.listen(this.onModelChange);
        this._waitASecond();
    },

    componentWillUnmount: function() {
        this.unsubscribe();
        clearTimeout(this.timeoutProcessId);
    },


    getDefaultProps: function () {
        return {
            onHide: function(){/* do nothing */},
            text: 'Loading...'
        };
    },

    _waitASecond: function(){
        this.timeoutProcessId = setTimeout(function(){
            ModalProgressActions.secondsIncrement();
            this._waitASecond();
        }.bind(this), 1000);

    },

    render: function(){
        var messageContent = [];
        if(this.state.message){
            messageContent.push(
                <h4 key='message'>{this.state.message}</h4>
            );
        } else if(this.state.messageArray){
            _.each(this.state.messageArray, function(item, index){
                messageContent.push(
                    <p key={'message' + index} >{item}</p>
                )
            });
        }
        return (
            <Modal show={this.state.isModalOpen}
                   onHide={this.props.onHide}
                   dialogClassName='umy-modal-overlay'
                   backdrop={true}
                   bsSize='medium'
                   animation={true}>
                {/*<Modal.Header closeButton={false} aria-labelledby='contained-modal-title'>
                    <Modal.Title id='contained-modal-title'></Modal.Title>
                </Modal.Header>*/}
                <Modal.Body>
                    {messageContent}
                </Modal.Body>
                <Modal.Footer>
                    <p className='text-center'>{this.state.seconds + ' sec.'}</p>
                </Modal.Footer>
            </Modal>
        );
    }

});

module.exports = ModalProgress;
