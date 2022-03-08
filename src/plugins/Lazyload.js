import Vue from 'vue'

//1.引入插件
import VueLazyload from 'vue-lazyload'

//1.5.引入图片 - 图片和json文件，不用对外暴露，可以直接拿到
import lazy from '@/assets/lazyload.gif'

//2.注册插件 - 加一些配置项
Vue.use(VueLazyload, {
    //懒加载默认图片
    loading: lazy
});