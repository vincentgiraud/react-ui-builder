Description
-----------

[![Join the chat at https://gitter.im/ipselon/react-ui-builder](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ipselon/react-ui-builder?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This tool is a visual builder of React JS components for your web application. 
In builder you can easily combine available components with each other, and see how they look and feel right on a web page.
Then you can generate a source code of new component from the combination. Moreover, you can generate Reflux actions/store for your component.

Additionaly there is a gallery of ready to use components which you can preview and download.

Before you continue reading, please, watch this [Short Tutorial](https://www.youtube.com/watch?v=yycaq9qv7us&feature=youtu.be),
or watch this more advanced [Long Tutorial](https://www.youtube.com/watch?v=5nqOFSjXKPI)

Also there is [on-line demo version](http://helmetrex.com/react-ui-builder/)

React UI Builder needs support
------------------------------
If you think that it's worth to pledge small amount of money to development of the builder,
please become our patron, visit: [the page on Patreon](https://www.patreon.com/ipselon?ty=h)

Find our patrons [here](https://github.com/ipselon/react-ui-builder/blob/master/PATRONS.md) (3)

Features
--------

* A gallery of boilerplates with reusable components and their predefined variants.
* Generate source code for new component from any combination of other components.
* Edit source code of the project in other IDEs, builder will reload changes automatically.
* Generate Flux/Reflux actions/store for components.
* Include and use third-party components in builder.
* Publish own projects into the gallery.

Installation
------------

    npm install react-ui-builder -g
    
For upgrading of version it is better to uninstall and then install:
 
    npm uninstall react-ui-builder -g


Running
-------

Builder runs as a webserver.

    react-ui-builder

Usage
-----

  1. Go to **http://localhost:2222/builder** in browser. 

  2. Browse gallery of published projects. There are a limited amount of completed projects so far, 
but we intensely working on a feature where any user will be available to publish project.

  3. Clone project you liked by specifying __absolute__ path to local folder where you want to see the source code of the project. This folder should __exist__ and be __empty__.

  4. Cloning and preparing of the project will take some time. 
Most time will be spent by npm installer, builder starts the installation of dependent npm modules automatically after project is downloaded.

  5. Now you can compose components on page, consider page as a desk where you combine components with each other. 

Roadmap
-------

* Developer will be able to add quick notes for each component in order to use them while setting the properties to component.
* Gallery will provide comfortable viewing of the notes for components (see previous item).
* Developer should be able to add Readme to the project boilerplate in the gallery.
* Developer should be able to create projects in the builder from existing source code, and not only from gallery.
* Enhancing code generation:
  * the source code in ES6 format
  * generate event handler functions for component
  * copy component's source code
  * delete component's source code
  * import component's source code

Documentation
-------------

To get familiar with the builder's interface and how it works see [Documentation](https://github.com/ipselon/react-ui-builder/tree/master/docs)
