const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BASE_DIR = path.dirname(path.dirname(__filename));

const SRC_DIR = path.join(BASE_DIR, 'src');
const DIST_DIR = path.join(BASE_DIR, 'dist');


module.exports = {
    entry: [
        path.join(SRC_DIR, 'index.tsx')
    ],

    output: {
        path: DIST_DIR,
        filename: 'app.min.[contenthash].js'
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: '/node_modules/'
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(),

        new HtmlWebpackPlugin({
            filename: path.join(BASE_DIR, 'index.html'),

            template: path.join(SRC_DIR, 'index.template.html'),
            title: 'Sunit Deshpande'
        }),
    ],

    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor.",
                    chunks: "initial"
                }
            }
        }
    }
}
