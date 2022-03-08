//home模块的小仓库

import { reqCategoryList, reqBannerList, reqFloorList } from "@/api";

//state：仓库存储数据的地方
//mutations：修改state的唯一手段
//actions：可以书写自己的逻辑，可以处理异步
//getter：可以理解为计算属性，让组件获取仓库数据更加方便
const state = {
    //state默认初始值不要瞎写 - 看看服务器中（返回）的真实数据是什么：真实数据是数组，那就准备空[]，真实数据是对象，准备空{}
    categoryList: [],
    //轮播图数据
    bannerList: [],
    floorList: []
};
//mutation是修改state的唯一方法
const mutations = {
    CATEGORYLIST(state, categoryList) {
        //state的数据 = 服务器返回的数据
        state.categoryList = categoryList;
    },
    //state传的是，仓库store里面的数据-上面的state，bannerList传的是下面commit中的result.data
    BANNERLIST(state, bannerList) {
        //state的数据 = 服务器返回的数据
        state.bannerList = bannerList;
    },
    FLOORLIST(state, floorList) {
        state.floorList = floorList;
    }
};
const actions = {
    //通过API里面的接口函数调用，向服务器发请求，获取服务器的数据
    async categoryList({ commit }) {
        //要拿到promise成功的调用 - 用await - await等于.then(resolve=>{})
        let result = await reqCategoryList();
        if (result.code == 200) {
            commit('CATEGORYLIST', result.data);

        }
    },
    //获取首页轮播图数据 - banner
    async bannerList({ commit }) {
        let result = await reqBannerList();
        if (result.code == 200) {
            commit('BANNERLIST', result.data);
        }
    },
    //获取floor模块数据
    async FloorList({ commit }) {
        let result = await reqFloorList();
        if (result.code == 200) {
            //提交mutation
            commit('FLOORLIST', result.data)
        }

    }
};
const getters = {};

//对外暴露
export default {
    state,
    mutations,
    actions,
    getters
}