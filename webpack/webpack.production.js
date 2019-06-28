const merge = require('webpack-merge');

const commonConfig = require('./webpack.common');

module.exports = merge.smart(commonConfig, {

    mode: 'production'

})