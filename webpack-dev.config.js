var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = [
    {
        name: "browser",
        entry: {
            main: './client/src/main.js'
        },
        output: {
            path: './build/html',
            filename: 'builder-bundle.js'
        },
        //devtool: "eval",
        debug: true,
        module: {
            loaders: [
                { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
                { test: /\.css$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
                { test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)([\?]?.*)$/, exclude: /node_modules/, loader: 'url-loader' }
            ]
        },
        plugins: [
            new ExtractTextPlugin("styles.css")
        ],
        externals: {
            // require("jquery") is external and available
            //  on the global var jQuery
            "jquery": "jQuery"
        }
    }
    //,
    //{
    //    name: "server",
    //    entry: {
    //        api: './server/src/refactor/api.js'
    //    },
    //    module: {
    //        loaders: [
    //            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    //        ]
    //    },
    //    output: {
    //        path: './build/lib',
    //        filename: '[name].js',
    //        libraryTarget: 'commonjs2'
    //    },
    //    externals: /^[a-z\-0-9_]+$/
    //}
];

