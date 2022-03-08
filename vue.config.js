module.exports = {
    //打包（npm run build）的时候如果不需要map文件，就设置下面这个代码(项目体积会变小)
    //map文件的作用就是：打包之后是压缩的文件，所以如果有报错就看不了是哪里报错。而有map文件，就可以帮你定位哪里报了错。
    productionSourceMap: false,
    // 关闭eslint
    lintOnSave: false,
    //代理跨域
    //跨域：协议，域名，端口号不同的请求 - 解决方法：JSONP，CROS，代理服务器（面试常问）
    devServer: {
        proxy: {
            '/api': {
                target: 'http://39.98.123.211'
                // pathRewrite: { '^/api': '' },
            }
        }
    }
}