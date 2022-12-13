const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const cssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    // 设置环境模式
    mode: 'production',
    //指定入口,【相对路径】
    // 多入口
    entry: {
        index: './src/index.js',
        login: './src/login.js',
    },
    //指定出口
    output: {
        // 打包后文件的名字
        // 为打包后的文件创建hash值：代码一旦被修改，生成的文件名也会被修改，有助于强缓存的设置
        filename: '[name].[hash:8].js',
        //设置打包的路径【绝对路径】
        path: path.resolve(__dirname, './dist'),
    },
    //优化项
    optimization: {
        //设置压缩方式
        minimizer: [new cssMinimizerWebpackPlugin(), new TerserPlugin()],
    },
    plugins: [
        new htmlWebpackPlugin({
            // 指定页面模版
            template: './public/index.html',
            // 打包后的名字
            filename: 'index.html',
            // 是否压缩
            minify: false,
            // 指定导入的资源名称
            chunks: ['index'],
        }),
        new htmlWebpackPlugin({
            // 指定页面模版
            template: './public/login.html',
            // 打包后的名字
            filename: 'login .html',
            // 是否压缩
            minify: false,
            // 指定导入的资源名称
            chunks: ['login'],
        }),
        new CleanWebpackPlugin(),
        new miniCssExtractPlugin({
            //打包后css文件的名字
            filename: 'main.[hash:8].css',
        }),
    ],
    //dev-server
    devServer: {
        host: '127.0.0.1',
        port: 3000,
        open: true, //自动打开浏览器
        hot: true, //热更新
        compress: true, //开启gzip

        //跨域代理配置
        proxy: {
            //以/jian为前缀的请求的代理设置
            '/jian': {
                target: 'https://www.baidu.com', //真正的服务器地址
                //不加pathRewrite，请求/jian/list,真正的请求地址：https://www.baidu.com/jian/list
                //加pathRewrite，请求/jian/list,真正的请求地址：https://www.baidu.com/list
                pathRewrite: { '^/jian': '' },
                //修改请求头中的origin源信息
                changeOrigin: '',
                //支持websocket
                ws: true,
            },
            '/zhi': {},
        },
    },

    //loader加载器
    //从下往上，从右到左的顺序执行
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: [
                    // 'style-loader', //把css以内嵌式导入到页面
                    miniCssExtractPlugin.loader,
                    'css-loader', //处理特殊语法
                    //配合autoprefixer&browserlist给css属性设置前缀【作用：浏览器兼容】
                    'postcss-loader',
                    'less-loader', //less编译为css
                ],
            },
            {
                test: /\.js$/,
                use: ['babel-loader'],
                //设置编译的目录和忽略的文件
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpe?g)|gif$/i,
                type: 'javascript/auto',
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 50 * 1024, //小于50k的图片使用base64
                            esModule: false,
                            //没有base64的图片，编译后输出的路径和名称
                            name: 'images/[name].[hash:8].[ext]',
                        },
                    },
                ],
            },
        ],
    },

    //设置打包的最大资源大小
    performance: {
        maxAssetSize: 100 * 1024 * 1024,
        maxEntrypointSize: 100 * 1024 * 1024,
    },

    //解析器
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
};
