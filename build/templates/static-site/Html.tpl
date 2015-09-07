<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
    <head lang="en">
        <meta charset="UTF-8">
        <title><%=pageTitle || pageName%></title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="x-ua-compatible" content="IE=10">
        <% if(pageMetaInfo && pageMetaInfo.length > 0){ _.forEach(pageMetaInfo, function(item, index) { %>
        <meta <%_.forOwn(item, function(value, prop){%> <%=prop%>="<%=value%>" <%});%>/>
        <% });} %>
        <link rel="stylesheet" href="styles.css"/>
        <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
    </head>
    <body>
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-67280620-1', 'auto');
          ga('send', 'pageview');

        </script>
        <div id="content">
        <%=htmlContent%>
        </div>
        <script src="commons.js"></script>
        <script src="<%=pageName%>.bundle.js"></script>
    </body>
</html>