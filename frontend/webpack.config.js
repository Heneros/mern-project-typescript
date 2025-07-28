const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');

const mode = process.env.NODE_ENV || 'development';
const isProd = mode === 'production';

module.exports = {
    mode,
    cache: false,
    entry: './src/index.tsx',
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, '../dist/frontend'),
        publicPath: '/',
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            minify: isProd,
        }),
        new Dotenv({
            path: path.resolve(__dirname, '../.env'),
            systemvars: true,
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        
                        options: {
                       
                            transpileOnly: true,
      configFile: path.resolve(__dirname, 'tsconfig.json').replace(/\\/g, '/')
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jp?g|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[name][ext]',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            'app': path.resolve(__dirname, 'src/app'),
            'entities': path.resolve(__dirname, 'src/entities'),
            'features': path.resolve(__dirname, 'src/features'),
            'pages': path.resolve(__dirname, 'src/pages'),
            'shared': path.resolve(__dirname, 'src/shared'),
            'widgets': path.resolve(__dirname, 'src/widgets'),
            'components': path.resolve(__dirname, 'src/components'),
        },
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        hot: true,
        watchFiles: ['src/**/*'],
        historyApiFallback: true,
        port: 3000,
    },
    devtool: isProd ? 'source-map' : 'eval-source-map',
};