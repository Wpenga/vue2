const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

})
module.exports = {
  devServer: {
    // host: "localhost",  //指定要使用的 host
    port: 8080,   //指定端口号以侦听
    // hotOnly: false, //启用热模块替换，而无需页面刷新作为构建失败时的回退。
  },
};