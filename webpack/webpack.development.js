const path = require('path');
const merge = require('webpack-merge');

const commonConfig = require('./webpack.common');

const BASE_DIR = path.dirname(__dirname);
const SRC_DIR = path.join(BASE_DIR, 'src');
const DIST_DIR = path.join(BASE_DIR, 'dist');

module.exports = merge.smart(commonConfig, {

    mode: 'development',

    devtool: 'source-map',

    devServer: {
        open: true,

        publicPath: DIST_DIR,

        // Write file after clean webpack plugin
        writeToDisk: true
    }

})