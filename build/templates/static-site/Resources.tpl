<% _.forEach(requires, function(item, index) { %>
require('<%=item.relativeSource%>');
<% }); %>
