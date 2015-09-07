var React = require('react');
var marked = require('marked');
var ReactBootstrap = require('react-bootstrap');
var Panel = ReactBootstrap.Panel;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var Button = ReactBootstrap.Button;

var ApplicationActions = require('../../action/application/ApplicationActions.js');

var ProjectThumbnail = React.createClass({


    getDefaultProps: function() {
        return {
            projectName: 'Unknown',
            description: 'NONE',
            countDownload: 0
        };
    },

    render: function() {
        if(this.props.isEmpty){
            return (
                <div></div>
            );
        } else {
            var projectName = this.props.projectName;
            if(projectName && projectName.length > 50){
                projectName = projectName.substr(0, 50) + '...';
            }
            var innerHtml = marked(this.props.description);
            return (
                <Panel {...this.props}>
                    <div style={{display: 'table', width: '100%'}}>
                        <div style={{display: 'table-row'}}>
                            <div style={{display: 'table-cell'}}>
                                <h4 className={'text-danger'} style={{marginTop: '5px'}}>
                            <span style={{display: 'inline'}} >
                                {projectName}
                            </span>
                                </h4>
                            </div>
                            <div style={{display: 'table-cell', width: '50%', verticalAlign: 'top', textAlign: "right", paddingLeft: '0.5em', paddingRight: '0.5em', paddingTop: '0.5em', paddingBottom: '0.5em'} }>
                                <a href={'http://helmetrex.com/Preview.html?projectId=' + this.props.id + '&projectName=' +  this.props.projectName}
                                   target="blank"
                                   style={{marginLeft: '1em'}}>
                                    <span className='fa fa-external-link fa-fw'></span>&nbsp;Preview
                                </a>
                                <a href='#' style={{marginLeft: '1em'}} onClick={this._handleClone}>
                                    <span >Clone</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <p>
                        <span>{this.props.countDownload}</span>
                        <small style={{ marginLeft: '0.5em' }} className={ 'text-muted'}>downloads</small>
                        <small className='text-muted'>{'  |  Author: ' + this.props.userProfile.login}</small>
                        <small className='text-muted'>{'  |  License: ' + this.props.license}</small>
                    </p>
                    <hr style={{marginTop: '5px',    marginBottom: '5px'}}></hr>
                    <div style={{height: '20em', overflow: 'auto'}}>
                        <p dangerouslySetInnerHTML={ { __html: innerHtml}}></p>
                    </div>
                </Panel>

            );
        }
    },

    //_handlePreview: function(e){
    //    e.preventDefault();
    //    e.stopPropagation();
    //    ApplicationActions.previewProject(this.props.projectId);
    //},

    _handleClone: function(e){
        e.preventDefault();
        e.stopPropagation();
        ApplicationActions.startDownloadProject(this.props.projectId);
    }

});

module.exports = ProjectThumbnail;