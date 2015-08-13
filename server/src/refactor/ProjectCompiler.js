import _ from 'lodash';
import webpack from 'webpack';

class ProjectCompiler {

    compile(entryFilePath, outputDirPath, outputFileName, nodeModulesDir){
        return new Promise((resolve, reject) => {

            let compiler = webpack({
                name: "browser",
                entry: [entryFilePath],
                output: {
                    path: outputDirPath,
                    filename: outputFileName
                },
                debug: true,
                module: {
                    loaders: [
                        { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel?cacheDirectory' },
                        { test: /\.css$/, loader: "style-loader!css-loader" },
                        { test: /\.(eot|woff|ttf|svg|png|jpg)([\?]?.*)$/, loader: 'url-loader' }
                    ]
                },
                //resolveLoader: { root: path.join(__dirname, "node_modules") },
                resolveLoader: {
                    root: [nodeModulesDir]
                },
                externals: {
                    // require("jquery") is external and available
                    //  on the global var jQuery
                    "jquery": "jQuery"
                }
            });
            compiler.run( (err, stats) => {
                let jsonStats = stats.toJson({
                    hash: true
                });
                //console.log(jsonStats.hash);
                let lastWatcherHash = jsonStats.hash;
                //if(jsonStats.errors.length > 0)
                //    console.log(jsonStats.errors);
                //if(jsonStats.warnings.length > 0)
                //    console.log(jsonStats.warnings);
                //console.log(stats);
                if(err) {
                    reject(err);
                } else if(jsonStats.errors.length > 0){
                    let messages = [];
                    _.each(jsonStats.errors, (item) => {
                        let messageArray = item.split('\n');
                        //console.log('Error message: ' + messageArray);
                        messages.push(messageArray);
                    });
                    //console.log(jsonStats.errors);
                    reject(messages);
                } else {
                    resolve();
                }
            });

        });
    }

    watchCompiler(entryFilePath, outputDirPath, outputFileName, nodeModulesDir, callback) {

        return new Promise((resolve, reject) => {

            let compiler = webpack({
                name: "browser",
                entry: [entryFilePath],
                output: {
                    path: outputDirPath,
                    filename: outputFileName
                },
                debug: true,
                module: {
                    loaders: [
                        {test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel?cacheDirectory'},
                        {test: /\.css$/, loader: "style-loader!css-loader"},
                        {test: /\.(eot|woff|ttf|svg|png|jpg)([\?]?.*)$/, loader: 'url-loader'}
                    ]
                },
                //resolveLoader: { root: path.join(__dirname, "node_modules") },
                resolveLoader: {
                    root: [nodeModulesDir]
                },
                externals: {
                    // require("jquery") is external and available
                    //  on the global var jQuery
                    "jquery": "jQuery"
                }
            });

            let compiledProcessCount = 0;
            let processId = setTimeout( () => {
                this.watcher = compiler.watch(200, (err, stats) => {
                    var jsonStats = stats.toJson({
                        hash: true
                    });
                    //console.log(jsonStats.hash);
                    //if(jsonStats.errors.length > 0)
                    //    console.log(jsonStats.errors);
                    //if(jsonStats.warnings.length > 0)
                    //    console.log(jsonStats.warnings);
                    //console.log('compiled in ' + processId._idleStart);
                    if (err) {
                        //console.error(err);
                        callback([[err]]);
                    } else if (jsonStats.errors.length > 0) {
                        let messages = [];
                        _.each(jsonStats.errors, (item) => {
                            var messageArray = item.split('\n');
                            //console.log('Error message: ' + messageArray);
                            messages.push(messageArray);
                        });
                        //console.log(jsonStats.errors);
                        callback(messages);
                    } else {
                        if (this.lastWatcherHash !== jsonStats.hash) {
                            callback(null, {
                                compiledProcessCount: ++compiledProcessCount
                            });
                            //console.log("Called callback for socket.io emitter: " + compiledProcessCount);
                        }
                    }
                    this.lastWatcherHash = jsonStats.hash;
                });
            }, 1000);
            resolve();
        });

    }

    stopWatchCompiler() {
        return new Promise( (resolve, reject) => {
            if (this.watcher != null) {
                this.watcher.close();
                this.watcher = null;
                this.lastWatcherHash = null;
            }
            resolve();
        });
    }


}

export default ProjectCompiler;

