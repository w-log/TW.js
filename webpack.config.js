const webpack = require('webpack'),
    path = require('path'),
    fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const isDevelopment = process.env.NODE_ENV === 'development';

const distPath = path.join(__dirname, '/dist');
const srcPath = path.join(__dirname, '/src');


const requiredDirectorys = ['font', 'scss', 'js', 'assets'];
requiredDirectorys.forEach(dirName => {
    const dirPath = path.join(srcPath, dirName);
    !fs.existsSync(dirPath) && fs.mkdirSync(dirPath);
});




const htmlFiles = fs.readdirSync(srcPath).filter(fileName => path.extname(fileName) === '.html' && fileName.indexOf('header') === -1);

const plugins = [];
htmlFiles.forEach(fileName => {
    plugins.push(new HtmlWebpackPlugin({
        filename: fileName,
        template: path.join(srcPath, fileName)
    }));
});



plugins.push(
  new MiniCssExtractPlugin({
    filename: process.env.NODE_ENV === 'production' ? '[name].min.css' : '[name].[contenthash].css',
  }),
  new FriendlyErrorsWebpackPlugin()
);

if(!isDevelopment) {
  plugins.push(
    new CleanWebpackPlugin(distPath)
  )
}
plugins.push(new webpack.DefinePlugin({
    app: {
        environment: JSON.stringify(process.env.APP_ENVIRONMENT || 'development')
    }
}));


const config = {
    mode: isDevelopment ? 'development' : 'production',
    entry: {
        tw: path.join(srcPath, '/index.js'),
        page: path.join(srcPath, '/page/index.js'),
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin(),
        new OptimizeCSSAssetsPlugin({})
      ],
    },
    output: {
        path: distPath,
        publicPath: '',
        filename: '[name].min.js'
    },
    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /\.html$/,
                include: [path.join(srcPath, '/include_html'), path.join(srcPath, '/componentcode')],
                loader: 'html-loader'
            },
            {
                test: /\.(scss|css)$/,
                use: [
                  {
                    loader: MiniCssExtractPlugin.loader
                  },
                  {
                   loader: 'css-loader',
                   options: {
                     url: true,
                     sourceMap: true
                   }
                  }, 'sass-loader'
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1,
                        name: isDevelopment ? '' :'assets/font/[name].[ext]',
                    }
                }]
            },
            {
                test: /\.(gif|png|jpe?g|svg|ico)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1,
                        name: 'assets/imgs/[name].[ext]'
                    }
                }]
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.html', '.css', 'scss'],
        alias: {
          '@': srcPath,
        }
    },
    devServer: {
        contentBase: srcPath
    },
    plugins: plugins
};
console.log('curreunt mode : ', process.env.NODE_ENV + ' mode');

module.exports = config;
