const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BASE_DIR = path.dirname(__dirname);
const SRC_DIR = path.join(BASE_DIR, 'src');
const DIST_DIR = path.join(BASE_DIR, 'dist');

module.exports = {

    entry: path.join(SRC_DIR, 'index.tsx'),

    output: {
        filename: 'app.[hash].js',
        path: DIST_DIR
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },

    resolve: {
        extensions: [ '.tsx', '.ts', '.jsx', '.js']
    },

    plugins: [
        new CleanWebpackPlugin(),

        // Generate index.html for github pages
        new HtmlWebpackPlugin({
            filename: path.join(BASE_DIR, 'index.html'),
            template: path.join(SRC_DIR, 'index.template.html')
        })
    ],

    optimization: {
        splitChunks: {
            chunks: "initial"
        }
    }
}