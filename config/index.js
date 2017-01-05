// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'typewrite',
    assetsPublicPath: 'http://static.auxo.test.huayu.nd/',// http://r.s1.e.99.com/   http://static.auxo.test.huayu.nd/  http://s13.e.99.com/
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    assetsSubDirectory: 'static',
    assetsPublicPath: 'http://localhost:8080/',
    proxyTable: {
        // '/__webpack_hmr':{
        //     target:'localhost:8080',
        //     changeOrigin:false,
        //     pathRewrite:{
        //         '^__webpack_hmr':'__webpack_hmr'
        //     }
        // }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
