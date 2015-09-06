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
        module: {
            loaders: [
                { test: /\.js$/, exclude: /node_modules/, loader: 'babel?cacheDirectory' },
                { test: /\.css$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
                { test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)([\?]?.*)$/, exclude: /node_modules/, loader: 'url-loader' }
            ]
        },
        plugins: [
            new ExtractTextPlugin("styles.css"),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
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
    //        api: './server/src/api.js'
    //    },
    //    output: {
    //        path: './build/lib',
    //        filename: '[name].js',
    //        libraryTarget: 'commonjs2'
    //    },
    //    externals: /^[a-z\-0-9_]+$/,
    //    plugins: [
    //        new webpack.optimize.UglifyJsPlugin()
    //    ]
    //}
];

