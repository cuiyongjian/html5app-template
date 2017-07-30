var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var WebpackBrowserPlugin = require('webpack-browser-plugin')

var isProd = process.env.NODE_ENV == 'production'

module.exports = {
    entry: {
        app: path.resolve(__dirname, './src/index.js'), // webpack加载入口
        vendor: ['moment', 'lodash'] // 第三方库的入口声明，CommonChunkPlugin会把它们打包到vendor.js
    },
    output: {
        path: path.resolve(__dirname, 'dist'), // webpack输出目录
        filename: '[name]-[chunkhash].js', // 编译后文件名
    },
    devtool: 'source-map', // 开启sourcemap， 开发环境最好用eval-source-map
    devServer: {
        contentBase: '/', // 托管目录. 在publicPath未设置的情况下, webpack的bundle结果会创建在devServer域名根目录
        historyApiFallback: false, // h5的history模式，可以任何链接都返回index.html
        inline: true, // 实时刷新
        port: 9090,
        proxy:{ // 代理属性
            // 路由映射
            "/api":{
                target:'http://localhost:8000/', // 可以利用json-mock做个mock服务器
                pathRewrite: {"^/api":""}
            }
        }
    },
    module: {
        rules: [
            {
                test:/\.(jpg|png|gif)$/,
                use:{
                    loader:'url-loader',
                    options: {
                        limit: 8192
                  }
                }
            },
            {
                test:/\.(woff|woff2|eot|ttf|svg)$/,
                use:{
                    loader:'url-loader',
                    options: {
                        limit: 100000
                  }
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader', // 回退选项，抽不出来就弄到js bundle里
                    use: [{
                        loader: 'css-loader', // 抽取之前用css-loader处理css
                        options: {
                            minimize: isProd
                        }
                    }]
                }),
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'test')
                ]
                // use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                exclude: '/node_modules/',
                use: 'babel-loader'
            },
            {
                test: /\.styl$/,
                use:ExtractTextPlugin.extract({
                    fallback:'style-loader',
                    use:[
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: isProd
                            }
                        },
                        'stylus-loader'
                    ]
                })
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'html5app-template',
            template: path.resolve(__dirname, './src/index.html')
        }),
        new ExtractTextPlugin(isProd ? '[name]-[hash].min.css' : '[name]-[hash].css'),
        new webpack.ProvidePlugin({
            $m: 'moment' // 该插件可以把模块注入到你的模块中，你自己模块中就可以直接用$，不需自己require
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        })
    ],
    // 项目依赖的外部文件，如jQuery，这样配置之后，最后就不会把jquery打包到build.js里，而且仍然可以 var $=require('jquery') 这样用
    externals: {
        $: 'window.jQuery'
    }
}

// 环境变量特殊处理
// 这里由于比较简单，所以两种环境全部放到webpack.config.js里来处理了。如果是复杂情况，最佳实践应该是单独搞几个dev.config.js,prod.config.js,base.config.js。再在这里判断环境分别引入不同的配置。
// 就像felib-template中build.js所做的事情一样。
if (process.env.NODE_ENV == 'production') {
    module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}, {output: {comments: false}}))
    module.exports.output.filename = module.exports.output.filename.replace('.js', '.min.js')
    module.exports.devtool = 'source-map'
}

if (process.env.NODE_ENV == 'development') {
    // module.exports.plugins.push(new WebpackBrowserPlugin())
}


