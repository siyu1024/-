import Vue from 'vue'
import Vuex from 'vuex'
//使用插件
Vue.use(Vuex);

//Vuex模块式开发
//引入小仓库
import home from './home'
import search from './search'
import detail from './detail'
import shopcart from './shopcart'
import user from './user'
import trade from './trade'

//对外暴露Store类的实例
export default new Vuex.Store({
    //Vuex模块式开发
    modules: {
        home,
        search,
        detail,
        shopcart,
        user,
        trade
    }
})