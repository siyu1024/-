//配置路由的地方

//引入
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes'

//使用插件
Vue.use(VueRouter)

//引入仓库
import store from '@/store'

//配置路由
let router = new VueRouter({
    //routes:routes 简写形式
    routes,
    //vue-router - 滚动行为
    scrollBehavior(to, from, savedPosition) {
        // 代表的是滚动条在最上方（0px）
        return { y: 0 };
    }
})

//全局守卫，全局前置守卫 - 在路由跳转前进行判断
router.beforeEach(async (to, from, next) => {
    //to：可以获取你要去的路由的信息。from：你从哪里来的路由的信息。
    //next()：是一个函数，放行函数，通常加条件。next(/path)：放行到指定位置。next(false):回到from路由。

    //下面的next()是为了测试
    next();

    //只要用户登陆了，才会有token
    let token = store.state.user.token;
    let name = store.state.user.userInfo.name;
    if (token) {
        //如果用户登陆了，就去不了login界面。跳到首页。
        if (to.path == '/login' || to.path == '/register') {
            next('/home')
        } else {
            if (name) {
                //如果用户登陆了，且有userInfo，就放行
                next()
            } else {
                //如果没有用户名，那派发action，然后再跳转（放行）：
                try {
                    //获取用户信息，在首页进行展示
                    await store.dispatch('getUserInfo');
                    next();
                } catch (error) {
                    //dispatch('getUserInfo')这个步骤失败了，意思就是没有token - token失效了
                    //所以要清除token（前台的token），调用已有的函数
                    store.dispatch('logout')
                }
            }

        }
    } else {
        //如果用户没有登录（没有token）
        let toPath = to.path;
        //不能去trade，pay，paysuccess，center下的任何组件
        if (toPath == '/trade' || toPath.indexOf('/pay') !== -1 || toPath.indexOf('/center') !== -1) {
            //用户体验：比如说，用户先点击了【我的订单】，然后让用户登录，那登录完成之后应该重新展示刚刚用户想进去的【我的订单】页面。
            next('/login?redirect=' + toPath)
        } else {
            //其他路由都放行
            next()
        }
    }
})

export default router;