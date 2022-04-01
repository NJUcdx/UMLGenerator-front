const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}
// 项目的主要配置文件
module.exports = {
    publicPath:"./",
    devServer:{
      port:8123
    },
    // webpack 配置进行更细粒度的修改  https://cli.vuejs.org/zh/config/#chainwebpack
    chainWebpack: (config)=>{
        //修改文件引入自定义路径
        config.resolve.alias
            .set('@', resolve('src'))
            .set('@components', resolve('src/components'))
            .set('@views',resolve('src/views'))
            .set('@apis',resolve('src/apis'))
            .set('@utils',resolve('src/utils'))
            .set('@data',resolve('public/data'))
    }
}