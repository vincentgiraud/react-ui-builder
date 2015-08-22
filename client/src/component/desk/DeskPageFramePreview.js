'use strict';

var React = require('react/addons');
var _ = require("lodash");
var Server = require('../../api/Server.js');
var Repository = require('../../api/Repository.js');

var DeskPageFramePreview = React.createClass({

    render: function() {
        return (<iframe {...this.props} />);
    },

    componentDidMount: function() {

        var projectModel = Repository.getCurrentProjectModel();

        Server.invoke('generateLivePreview',
            {
                projectModel: projectModel
            },
            function(errors){
                console.log(errors);
            }.bind(this),
            function(response){
                var domNode = React.findDOMNode(this);
                domNode.src = response + '/' + Repository.getCurrentPageName() + '.html';

            }.bind(this)
        );

    }



});

module.exports = DeskPageFramePreview;
