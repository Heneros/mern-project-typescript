const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/, 
                use: ['css-loader'], 
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            app: path.resolve(__dirname, 'src/app'),
            entities: path.resolve(__dirname, 'src/entities'),
            features: path.resolve(__dirname, 'src/features'),
            pages: path.resolve(__dirname, 'src/pages'),
            shared: path.resolve(__dirname, 'src/shared'),
            widgets: path.resolve(__dirname, 'src/widgets'),
        }
    },
};
