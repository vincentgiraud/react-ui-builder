'use strict';

var Reflux = require('reflux');
var <%=modules.action.name%> = require('<%=modules.action.relativeFilePath%>');

var defaultModel = {
};

var <%=modules.store.name%> = Reflux.createStore({
    model: defaultModel,
    listenables: <%=modules.action.name%>,

    onTestAction: function() {
        this.trigger(this.model);
    }

});

module.exports = <%=modules.store.name%>;