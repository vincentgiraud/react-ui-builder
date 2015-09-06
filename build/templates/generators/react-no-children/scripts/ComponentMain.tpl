<%  function processChild(model){
        var result = '<' + model.type + ' ' + processProps(model.props) + '>';
        if(model.children && model.children.length > 0) {
            _.forEach(model.children, function(child) {
                result += processChild(child);
            });
        } else if(model.text && model.text.length > 0){
            result += model.text;
        }
        result += '</' + model.type + '>';
        return result;
    };

    function processStyle(styleObject){
        var result = '';
        if(styleObject && !_.isEmpty(styleObject)){
            _.forOwn(styleObject, function(value, prop){
                if(_.isString(value) && value.length > 0){
                    result += ' ' + prop + ": '" + value + "',";
                } else if(_.isBoolean(value) || _.isNumber(value)){
                    result += ' ' + prop + ": " + value + ",";
                }
            });
            result = result.substr(0, result.length - 1);
        }
        return result;
    }

    function processProps(props){

        var result = '';
        if(props && !_.isEmpty(props)){
            _.forOwn(props, function(value, prop){
                if(_.isString(value) && value.length > 0){
                    result += prop + "={'" + value + "'} ";
                } else if(_.isBoolean(value) || _.isNumber(value)){
                    result += prop + "={" + value + "} ";
                } else if(_.isObject(value)){
                    if(prop === 'style'){
                        result += prop + "={{ " + processStyle(value) + " }} ";
                    } else if(value['type']){
                        result += prop +"={ " + processChild(value) + " }";
                    }
                }
            });
        }
        return result;
    };

    function processDefaultProps(props){
        var result = '';
        if(props && !_.isEmpty(props)){
            _.forOwn(props, function(value, prop){
                if(result.length > 0){
                    result += ", ";
                }
                if(_.isString(value) && value.length > 0){
                    result += prop + ": '" + value + "'";
                } else if(_.isBoolean(value) || _.isNumber(value)){
                    result += prop + ": " + value;
                } else if(_.isObject(value)){
                    if(prop === 'style'){
                        result += prop + ": { " + processStyle(value) + " }";
                    } else if(value['type']){
                        result += prop +": ( " + processChild(value) + " )";
                    }
                }
            });
        }
    return result;
};%>
'use strict';

var React = require('react');
<% _.forEach(component.imports, function(item, index) { %>
var <%=item.name%> = require('<%=item.relativeSource%>')<%if(item.member){%>.<%=item.member%><%}%>;
<% }); %>
var <%=component.componentName%> = React.createClass({

    getDefaultProps: function () {
        return {<%= processDefaultProps(component.model.props) %>};
    },

    render: function(){
        return (
            <<%=component.model.type%> {...this.props} >
                {this.props.children}
<%         if(component.model.text && component.model.text.length > 0){%>
                <%= component.model.text %>
<%         } %>
           </<%= component.model.type %>>
        );
    }
});

module.exports = <%=component.componentName%>;
