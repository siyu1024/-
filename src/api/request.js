//对axios进行二次封装

import axios from 'axios'
//引入进度条
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'

//在当前模块中引入store模块 - 获取uuid
import store from '@/store'

//1.创建axios实例
const requests = axios.create({
    //配置对象
    //基础路径：发请求的时候，路径当中默认会出现/api
    baseURL: '/api',
    //请求超时时间
    timeout: 5000
})

//请求拦截器：可以在发请求之前，做一些事情
//在请求拦截器这里，给请求头添加信息
requests.interceptors.request.use((config) => {
    //游客身份id
    //因为请求地址中不让带参数，但是我们需要传递游客身份信息，所以用请求头的方式传递uuid
    //如果(仓库里)有uuid_token的话，就带过去
    if (store.state.detail.uuid_token) {
        //给请求头添加字段（跟后台程序员商量好的）-给后台传递数据
        config.headers.userTempId = store.state.detail.uuid_token
    }
    //需要携带token给服务器（为了获取用户信息）
    //如果(仓库里)有token的话，就带过去
    if (store.state.user.token) {
        config.headers.token = store.state.user.token
    }
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