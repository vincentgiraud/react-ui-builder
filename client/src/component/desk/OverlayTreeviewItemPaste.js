'use strict';

var React = require('react');
var OverlayButtons = require('./OverlayButtons.js');
var DeskPageFrameActions = require('../../action/desk/DeskPageFrameActions.js');

var OverlayTreeviewItemPaste = React.createClass({

    componentDidMount: function(){

    },

    componentDidUpdate: function(){

    },

    render: function(){
        var overlayModel = {
            onClose: DeskPageFrameActions.deselectComponent,
            buttons: [
                {
                    label: 'Before',
                    btnClass: 'btn-info',
                    onClick: (function () {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            DeskPageFrameActions.addBefore();
                        }
                    })()
                },
                {
                    label: 'First',
                    btnClass: 'btn-info',
                    onClick: (function () {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            DeskPageFrameActions.insertFirst();
                        }
                    })()
                },
                {
                    label: 'Wrap',
                    btnClass: 'btn-info',
                    onClick: (function () {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            DeskPageFrameActions.wrap();
                        }
                    })()
                },
                {
                    label: 'Replace',
                    btnClass: 'btn-info',
                    onClick: (function () {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            DeskPageFrameActions.replace();
                        }
                    })()
                },
                {
                    label: 'Last',
                    btnClass: 'btn-info',
                    onClick: (function () {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            DeskPageFrameActions.insertLast();
                        }
                    })()
                },
                {
                    label: 'After',
                    btnClass: 'btn-info',
                    onClick: (function () {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            DeskPageFrameActions.addAfter();
                        }
                    })()
                },
                {
                    label: 'Cancel',
                    btnClass: 'btn-warning',
                    onClick: (function () {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            DeskPageFrameActions.stopClipboardForOptions();
                        }
                    })()
                }
            ]
        };
        return (
            <OverlayButtons {...overlayModel} />
        );
    }


});

module.exports = OverlayTreeviewItemPaste;
