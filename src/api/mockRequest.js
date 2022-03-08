//对axios进行二次封装

import axios from 'axios'
//引入进度条
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'

//1.创建axios实例
const requests = axios.create({
    //配置对象
    //基础路径：发请求的时候，路径当中默认会出现/api
    baseURL: '/mock',
    //请求超时时间
    timeout: 5000
})

//请求拦截器：可以在发请求之前，做一些事情
requests.interceptors.request.use((config) => {
    //进度条开始
    nprogress.start();
    //config：配置对象
    return config;
})

//响应拦截器：服务器数据返回后（响应），做点事情
requests.interceptors.response.use((res) => {
    //进度条结束
    nprogress.done();
    //成功的回调函数
    return res.data;
}, (error) => {
    //失败的回调函数
    return Promise.reject(new Error('fail'));
})

//对外暴露
export default requests;