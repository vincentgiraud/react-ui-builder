var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Input = ReactBootstrap.Input;
var Button = ReactBootstrap.Button;


var TextStyleProperty = React.createClass({
    
    getInitialState: function(){
        var isDisabled = this.props.inputValue ? false : true;
        return {
            value: this.props.inputValue,
            isDisabled: isDisabled
        };
    },

    _handleDisabled: function(e){
        e.stopPropagation();
        if(!this.state.isDisabled){
            if(this.props.onRemoveValue){
                this.props.onRemoveValue({
                    target: {
                        name: this.props.label
                    }
                })
            } else {
                this.setState({
                    isDisabled: !this.state.isDisabled
                });
            }
        } else {
            this._handleBlur();
        }
    },
    
    _handleChangeValue: function(e){
        this.setState({
            value: this.refs.inputElement.getValue()
        })
    },

    _handleBlur: function(){
        if(this.props.onChangeValue){
            this.props.onChangeValue({
                target: {
                    name: this.props.label,
                    value: this.state.value
                }
            });
        }
    },

    render: function() {
        return (
            <Input 
                ref='inputElement'
                value={this.state.value}
                type={ 'text'} 
                label={ this.props.label} 
                placeholder={ 'Enter value'} 
                buttonBefore={
                              <input type='checkbox'
                                   checked={!this.state.isDisabled}
                                   onChange={this._handleDisabled} />
                            }
                onChange={this._handleChangeValue}
                onBlur={this._handleBlur} >
            </Input>
        );
    }

});

module.exports = TextStyleProperty;