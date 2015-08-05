'use strict';

var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Panel = ReactBootstrap.Panel;
var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;


var OverlayButtons = React.createClass({

    componentDidMount: function(){

    },

    componentDidUpdate: function(){

    },

    render: function(){
        var buttons = [];
        for (var i = 0; i < this.props.buttons.length; i++) {
            var buttonClassName = 'btn btn-info';
            if (this.props.buttons[i].btnClass) {
                buttonClassName += this.props.buttons[i].btnClass;
            }
            var inners = [];
            if (this.props.buttons[i].icon) {
                inners.push(<span key={'buttonIcon' + i} className={'fa fa-fw ' + this.props.buttons[i].icon}></span>);
            }
            if (this.props.buttons[i].label) {
                inners.push(<span key={'buttonLabel' + i}>{this.props.buttons[i].label}</span>);
            }
            var className = 'btn ' + (this.props.buttons[i].btnClass ? ' ' + this.props.buttons[i].btnClass : '');
            if(this.props.buttons[i].menu && this.props.buttons[i].menu.length > 0){
                var menuItems = [];
                this.props.buttons[i].menu.map(function(menuItem, index){
                    var func = (function(callback){
                        return function(e){
                            if(callback){
                                callback(e);
                            }
                        }
                    }(menuItem.onClick));
                    menuItems.push(
                        <li key={'menuItem' + index}><a style={{cursor: 'pointer'}} onClick={func}>{menuItem.label}</a></li>
                    );
                });
                buttons.push(
                    <div key={'button' + i} className="btn-group btn-group-xs" role="group">
                        <button type="button"
                                className={className + " dropdown-toggle"}
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false">
                            {inners}
                            <span className="fa fa-fw fa-caret-down"></span>
                        </button>
                        <ul className="dropdown-menu">
                            {menuItems}
                        </ul>
                    </div>
                );
            } else {
                var onClick = (function (callback) {
                    return function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (callback) {
                            callback(e);
                        }
                    }
                }(this.props.buttons[i].onClick));
                buttons.push(
                    <button key={'button' + i}
                            type='button'
                            style={{display: 'table-cell'}}
                            className={className}
                            onClick={onClick}>
                        {inners}
                    </button>
                );
            }
        }

        return (
            <div style={{position: 'absolute', left: 0, top: '-2.1em', display: 'table', width: '100%', zIndex: 1030}}>
                <div className='btn-group btn-group-xs' role='group' style={{display: 'table-row', width: '100%', whiteSpace: 'nowrap'}}>
                    <button style={{display: 'table-cell'}} type='button' className='btn btn-warning' onClick={this._handleClose}>
                        <span className='fa fa-times fa-fw'></span>
                    </button>
                    {buttons}
                </div>
            </div>
        );
    },

    _handleClose: function(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.onClose(e);
    }

});

module.exports = OverlayButtons;
