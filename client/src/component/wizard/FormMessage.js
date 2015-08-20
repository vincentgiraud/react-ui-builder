'use strict';

var React = require('react');

var FormMessage = React.createClass({


    render: function () {
        var messages = [];
        if(this.props.messages && this.props.messages.length > 0){
            this.props.messages.map(function(message){
                messages.push(
                    <h4>{message}</h4>
                );
            });
        }
        return (
            <div style={this.props.formStyle}>
                <table style={{width: '100%'}}>
                    <tr>
                        <td style={{width: '10%'}}></td>
                        <td>
                            {messages}
                        </td>
                        <td style={{width: '10%'}}></td>
                    </tr>
                    <tr>
                        <td colSpan='3' style={{height: '2em'}}></td>
                    </tr>
                </table>
            </div>
        );
    }

});

module.exports = FormMessage;
