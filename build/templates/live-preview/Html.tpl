<!DOCTYPE html>
<html style="width: 100%; height: 100%;" xmlns="http://www.w3.org/1999/html">
    <head lang="en">
        <meta charset="UTF-8">
        <title><%=pageName></title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="x-ua-compatible" content="IE=10">
        <script src="../assets/js/jquery-2.1.3.min.js"></script>

        <script>
            window.endpoint = {
                Window: window,
                Page: null,
                onComponentDidMount: null,
                onComponentWillUnmount: null,
                onComponentDidUpdate: null,
                onComponentWillUpdate: null,
                replaceState: function(pageModel){
                    if(this.Page){
                        this.Page.setState(pageModel);
                    }
                }
            };
        </script>
    </head>
    <body>
        <div id="content"></div>
        <script src="../bundle.js"></script>
    </body>
</html>