const path = require('path');

const merge = require('webpack-merge');

const commonConfig = require('./webpack.common');

const BASE_DIR = path.dirname(path.dirname(__filename));

const SRC_DIR = path.join(BASE_DIR, 'src');
const DIST_DIR = path.join(BASE_DIR, 'dist');

module.exports = merge.smart(commonConfig, {

    mode: 'development',

    devtool: 'source-map',

    devServer: {

        port: '8080',

        open: true,

        writeToDisk: true

    }

});
