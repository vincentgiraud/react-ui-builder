var _ = require('lodash');
var React = require('react/addons');
var components = require('./index.js');


function get(onError, onSuccess){
    $.ajax({
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "model.json"
    }).always(function(response, textStatus){
        //console.log("%o, %o, %o", response, textStatus, response.result);
        if(textStatus === 'success'){
            onSuccess(response);
        }  else {
            if(onError){
                onError("Internal Server Error: " + textStatus);
            }
        }
    });
}

var PageForDesk = React.createClass({

    getInitialState: function(){
        if(this.props.dataModel){
            return this.props.dataModel;
        } else{
            return null;
        }
    },

    componentDidMount: function(){
        window.endpoint.Page = this;

        if(window.location.pathname){
            var pathArray = window.location.pathname.split('/');
            if(pathArray.length > 0){
                var pageNameArray = pathArray[pathArray.length - 1].split('.');

            }
            if(pageNameArray[0] !== 'PageForDesk'){
                get(
                    function(error){
                        console.log(error);
                        this.setState(null);
                        if(window.endpoint.onComponentDidMount){
                            window.endpoint.onComponentDidMount();
                        }
                    }.bind(this),
                    function(response){
                        var pageModel = null;
                        if(response && response.pages){
                            response.pages.map(function(page){
                                if(page.pageName === pageNameArray[0]){
                                    pageModel = page;
                                }
                            });
                        }
                        this.setState(pageModel);
                        if(window.endpoint.onComponentDidMount){
                            window.endpoint.onComponentDidMount();
                        }
                    }.bind(this)
                );
            }
        }
    },

    componentWillUnmount: function(){
        window.endpoint.Page = null;
        if(window.endpoint.onComponentWillUnmount){
            window.endpoint.onComponentWillUnmount();
        }
    },

    componentDidUpdate: function(prevProps, prevState){
        if(window.endpoint.onComponentDidUpdate){
            window.endpoint.onComponentDidUpdate();
        }
    },

    componentWillUpdate: function(nextProps, nextState){
        if(window.endpoint.onComponentWillUpdate){
            window.endpoint.onComponentWillUpdate();
        }
    },

    shouldComponentUpdate: function(nextProps, nextState){
        return true;
    },

    findDOMNodeInPage: function(component){
        return React.findDOMNode(component);
    },

    render: function(){
        var elementTree = !_.isEmpty(this.state) ?
            this.createElements(this.state) :
            (<h4 style={{textAlign: 'center'}}>There are runtime errors during rendering of the page. Please see console output. React doesn't handle runtime errors.</h4>);
        return (
            <div>
                {elementTree}
            </div>
        );
    },

    createElements: function(model){

        var self = this;
        var elements = [];
        _.map(model.children, function(child, index){
            elements.push(self.createElement(child, index));
        });
        return elements;
    },

    createElement: function(options, ref){

        var type = 'div';
        if(options.type){
            type = this.findComponent(components, options.type, 0);
            if(!type){
                type = options.type;
            } else if(!_.isObject(type)){
                console.error('Element type: ' + options.type + ' is not object. Please check your index.js file');
                type = 'div';
            }
        }

        var props = _.extend({}, options.props);
        props.key = ref;

        var self = this;
        if(_.isObject(type)){
            _.forOwn(props, function(prop, propName){
                if(prop && _.isObject(prop) && prop.type){
                    props[propName] = self.createElement(prop, 0);
                }
            });
        }

        var nestedElements = null;
        if(options.children && options.children.length > 0){
            var children = [];
            _.map(options.children, function(childOptions){
                children.push(self.createElement(childOptions, ++ref));
            });
            nestedElements = children;
        } else if(options.text) {
            nestedElements = options.text;
        }
        var result = null;
        try{
            result = React.createElement(type, props, nestedElements);
        } catch(e){
            console.error('Element type: ' + options.type + ' is not valid React Element. Please check your index.js file');
        }
        return result;
    },

    findComponent: function(index, componentName, level){
        var result;
        if(index && _.isObject(index) && level <= 1){
            level++;
            _.forOwn(index, function(value, key){
                if(!result){
                    if(key === componentName){
                        result = value;
                    } else if(value && _.isObject(value)){
                        result = this.findComponent(value, componentName, level);
                    }
                }
            }, this);
        }
        return result;
    }

});

if(!window.endpoint.renderPageToString){
    window.endpoint.renderPageToString = (function(){
        return function(dataModel){
            return React.renderToString(<PageForDesk dataModel={dataModel}/>);
        }
    }());
}

React.render(<PageForDesk/>, document.getElementById('content'));
