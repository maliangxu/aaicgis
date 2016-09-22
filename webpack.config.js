//var path = require("path");
//var webpack = require('webpack');
//var node_modules_dir = path.resolve(__dirname, 'node_modules');

// process.env.NODE_ENV  product or dev

var config = {
    //devtool:false,
    /*entry: {
        //bundle: './assets/js'
        bundle: './source/shaldapsys/sub_page/nysjcj/js'
    },
    output: {
        path: './shaldapsys/sub_page/nysjcj/js',
        filename: '[name].js',
        publicPath: './js/'
    },*/
    entry: [
        './source/shaldapsys/sub_page/nysjcj/js/index.js',
        './source/shaldapsys/sub_page/nysjcj/js/Area.js',
        './source/shaldapsys/sub_page/nysjcj/js/list.js',
        './source/shaldapsys/sub_page/nysjcj/js/dialog.js',
        './source/shaldapsys/sub_page/nysjcj/js/storage.js',
        './source/shaldapsys/sub_page/nysjcj/js/toolbar.js',
        './source/shaldapsys/sub_page/nysjcj/js/aaicQuery.js',
        './source/shaldapsys/sub_page/nysjcj/js/dataEdit.js',
        './source/shaldapsys/sub_page/nysjcj/js/image.js',
        './source/shaldapsys/sub_page/nysjcj/js/location.js',
        './source/shaldapsys/sub_page/nysjcj/js/map.js',
        './source/shaldapsys/sub_page/nysjcj/js/property.js',
        './source/shaldapsys/sub_page/nysjcj/js/maploc.js',
        './source/shaldapsys/sub_page/nysjcj/js/tipwin.js',
        './source/shaldapsys/sub_page/nysjcj/js/data.js',
        './source/shaldapsys/sub_page/nysjcj/js/Eventful.js',
        './source/shaldapsys/sub_page/nysjcj/js/util.js'
    ],
    output: {
        path: './shaldapsys/sub_page/nysjcj',
        filename: 'bundle.js',
        publicPath: './nysjcj/'
    },
    externals: {
        'react': 'React'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
        {
            test: /\.js$/,
            loader: 'react-hot!babel-loader'
        },{
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        },{
            test: /\.(png|jpg)$/,
            loader: 'url?limit=40000'
        }]
    },
    //压缩 提前common文件
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     mangle: {
        //         except: ['import', '$', 'export']
        //     },
        //     compress: {
        //         warnings: false
        //     }
        // }),
        //new webpack.optimize.CommonsChunkPlugin('common.js'),
        //new webpack.HotModuleReplacementPlugin(),
        //new webpack.NoErrorsPlugin()
    ]
};
module.exports = config;
