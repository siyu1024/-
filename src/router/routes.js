//引入一级路由组件
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade'
import Pay from '@/pages/Pay'
import PaySuccess from '@/pages/PaySuccess'
import Center from '@/pages/Center'

//引入二级路由组件
import MyOrder from '@/pages/Center/myOrder'
import GroupOrder from '@/pages/Center/groupOrder'


//配置路由
export default [
    {
        path: '/home',
        component: Home,
        meta: { show: true }
    },
    {
        name: 'search',
        //params占位(:keyword)后面加一个？，意思就是params可传可不传
        path: '/search/:keyword?',
        component: Search,
        meta: { show: true }
    },
    {
        path: '/login',
        component: Login,
        meta: { show: false }
    },
    {
        path: '/register',
        component: Register,
        meta: { show: false }
    },
    {
        // 带params参数
        path: '/detail/:skuId',
        component: Detail,
        meta: { show: true }
    },
    {
        // 带params参数
        name: 'addcartsuccess',
        path: '/addcartsuccess',
        component: AddCartSuccess,
        meta: { show: true }
    },
    {
        path: '/shopcart',
        component: ShopCart,
        meta: { show: true }
    },
    {
        path: '/trade',
        component: Trade,
        meta: { show: true },
        //独享路由守卫
        //1.如果想要进（enter）/trade的话
        beforeEnter: (to, from, next) => {
            //2.一定要从/shopcart页面过来
            if (from.path == '/shopcart') {
                next()
            } else {
                //3.而从其他的路由组件来，或者直接在地址栏输入地址等方法，不能通行。
                //不能跳转，也就是停留在原来的页面
                next(false)
            }
        }
    },
    {
        path: '/pay',
        component: Pay,
        meta: { show: true },
        beforeEnter: (to, from, next) => {
            if (from.path == '/trade') {
                next()
            } else {
                next(false)
            }
        }
    },
    {
        path: '/paysuccess',
        component: PaySuccess,
        meta: { show: true }
        //这个部分用组件路由实现了 - 去看PaySuuccess组件吧！
        // beforeEnter: (to, from, next) => {
        //     if (from.path == '/pay') {
        //         next()
        //     } else {
        //         next(false)
        //     }
        // }
    },
    {
        path: '/center',
        component: Center,
        meta: { show: true },
        //二级路由组件
        children: [
            {
                //耳机路由不用写/。如果想写/，那就应该从一级路由开始写全
                path: 'myorder',
                component: MyOrder
            },
            {
                path: 'GroupOrder',
                component: GroupOrder
            },
            //重定向：如果进入了我的中心(center)，那自动显示我的订单(myOrder)子组件（路由）。
            {
                path: '/center',
                redirect: '/center/myorder'
            }
        ]
    },
    //重定向，在项目跑起来的时候，访问/时，立马让他定向到首页
    {
        path: '*',
        redirect: '/home'
    }
]


//路由懒加载【高效】：
//当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就会更加高效。
//【我的理解：本来是一开始就加载所有的路由，比如import Home from '@/pages/Home'。懒加载是把import过程变为一个函数，当用户跳转到那个地方的时候会执行函数，import这个路由】
//【在这个项目中没有用路由懒加载，但是以后可以用。具体的参考文档：https://router.vuejs.org/zh/guide/advanced/lazy-loading.html】