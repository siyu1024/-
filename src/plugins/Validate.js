//这个插件的具体使用可以自己看官方文档。

import Vue from 'vue'

//1.引入插件(表单验证插件)
import VeeValidate from 'vee-validate'
//中文提示信息
import zh_CN from 'vee-validate/dist/locale/zh_CN'

//2.注册插件
Vue.use(VeeValidate)

//表单验证，配置
VeeValidate.Validator.localize('zh_CN', {
    //修改内置规则的message，让确认密码和密码相同
    messages: {
        ...zh_CN.messages,
        is: (field) => `${field}必须与密码相同`
    },
    //需要校验那些字段
    attributes: {
        phone: '手机号',
        code: '验证码',
        password: '密码',
        password2: '确认密码',
        agree: '协议'
    }
})

//自定义校验规则
VeeValidate.Validator.extend('tongyi', {
    validate: value => {
        return value
    },
    getMessage: field => field + '必须同意'
})