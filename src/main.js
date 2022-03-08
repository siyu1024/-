//入口文件

import Vue from 'vue'
import App from './App.vue'

//1.引入组件：三级联动组件 - 全局组件（注册一次，使用多次）
import TypeNav from '@/components/TypeNav'
import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'

//2.注册组件：第一个参数：全局组件名字；第二个参数：哪一个组件
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carousel.name, Carousel)
Vue.component(Pagination.name, Pagination)

//1. 引入element-ui组件库的部分组件（不是全部引入，是按需引入）
import { MessageBox } from 'element-ui'

//2. 注册element-ui组件 - 查看官方文档
//有Vue.component(Button.name, Button);这种注册方式，也有下面这种挂载在原型上的。具体的请看文档。
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;

//引入路由
import router from '@/router'

//引入仓库
import store from '@/store'

//引入mockServe.js - mock数据
import '@/mock/mokeServe'

//引入swiper样式
import 'swiper/css/swiper.css'

//引入所有的请求接口
//以不使用vuex的方法来发请求 - 直接在组件发请求，并管理数据
import * as API from '@/api'

//引入懒加载 + 表单验证插件(不用暴露，因为只需要执行里面的代码就行)
//其实把这两个文件里的代码都放到这个入口文件中，但是因为代码太多了，所以分装一下。
import '@/plugins/Lazyload'
import '@/plugins/Validate'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  //全局事件总线$bus配置 - this就是vm
  beforeCreate() {
    Vue.prototype.$bus = this;
    //以不使用vuex的方法来发请求。
    Vue.prototype.$API = API;
  },
  //注册路由（可简写）
  router: router,
  //注册仓库（简写形式） - 组件实例身上多了一个$store
  store
}).$mount('#app')
