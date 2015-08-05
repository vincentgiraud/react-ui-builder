'use strict';

var React = require('react');
var GlobalOverlayActions = require('../../action/element/GlobalOverlayActions.js');
var GlobalOverlayStore = require('../../store/element/GlobalOverlayStore.js');

var GlobalOverlay = React.createClass({

    componentDidMount(){
        this.unsubscribe = GlobalOverlayStore.listen(this.onModelChange);
        this._mountNode = document.createElement('div');
        this._mountNode.style['z-index'] = '9999';
        document.body.appendChild(this._mountNode);
        React.render(this._overlay, this._mountNode);
    },

    componentWillUnmount() {
        this.unsubscribe();
        React.unmountComponentAtNode(this._mountNode);
        this._mountNode = null;
    },

    componentDidUpdate(){
        if (this._mountNode) {
            React.render(this._overlay, this._mountNode);
        }
    },

    getInitialState: function () {
        return GlobalOverlayStore.model;
    },

    onModelChange: function (model) {
        this.setState(model);
    },

    render: function() {
        if(this.state.isShown){
            var style = {
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '4em',
                height: '4em',
                margin: '-2em 0 0 -2em',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: '#ffffff',
                borderRadius: '.3em',
                verticalAlign: 'middle',
                textAlign: 'center',
                padding: '0.7em'
            };
            this._overlay = (
                <div style={{position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', zIndex: '9999'}}>
                    <div style={{position: 'relative', width: '100%', height: '100%'}}>
                        <div style={style}>
                            <span style={{fontSize: '30px'}} className='fa fa-cog fa-spin'></span>
                        </div>
                    </div>
                </div>
            );
        } else {
            this._overlay = (
                <span></span>
            );
        }
        return (
            <span></span>
        );
    }

});

module.exports = GlobalOverlay;
