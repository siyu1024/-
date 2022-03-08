import { reqGoodInfo, reqAddOrUpdateShopCart } from "@/api"
//封装游客的临时身份的模块 - 生成一个随机的字符串，生成以后不能改变
import { getUUID } from '@/utils/uuid_token'

const state = {
    goodInfo: {},
    //游客临时身份
    uuid_token: getUUID()
}
//2.将获取的数据，存储到仓库state中（可以进行修改）
const mutations = {
    GETGOODINFO(state, goodInfo) {
        state.goodInfo = goodInfo
    }
}
//1.捞数据（发请求，获取数据）
const actions = {
    //action：发请求，获取产品信息、
    async getGoodInfo({ commit }, skuId) {
        let result = await reqGoodInfo(skuId)
        if (result.code == 200) {
            commit('GETGOODINFO', result.data)
        }
    },
    //另一个请求：将产品添加或更新到购物车
    //因为这个请求返回的就是‘成功’或‘失败’，所以不用三连环，也就是不用把数据存储到仓库中
    //两个参数可以用{}解构，这样就调用函数+传参的时候不用考虑顺序，而且前面可以加key。例如：xxx({skuId:xxx,skuNum:xxx}){}
    async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
        let result = await reqAddOrUpdateShopCart(skuId, skuNum)
        //reqAddOrUpdateShopCart（async）会返回一个promise，但这里还不知道成功还是失败，所以用result.data判断
        if (result.code == 200) {
            //请求成功（promise成功） - 返回的是成功的标记
            return 'success';
        } else {
            //请求失败（promise失败）-加入购物车失败 - 返回的是失败的标记
            return Promise.reject(new Error('fail'))
        }
    }
}
//2.5.(选择性的)可以简化数据，不用写很多.
const getters = {
    //简化导航路径
    categoryView(state) {
        //goodInfo初始值是{}，{}的属性（categoryView）是undefined。所以为了避免categoryView是undefined的情况（会有报错），给默认值{}。
        return state.goodInfo.categoryView || {}
    },
    //简化产品信息数据
    skuInfo(state) {
        return state.goodInfo.skuInfo || {}
    },
    //简化产品售卖属性
    spuSaleAttrList(state) {
        return state.goodInfo.spuSaleAttrList || []
    }
}

export default { state, actions, mutations, getters }

//对外暴露之后，需要在大仓库引入

//3.vuex配置完之后，要去组件那里派发action（才能获取数据）
//要在detail页面挂载的时候获取数据，也就是派发action。所以在detail组件的mounted中设置。