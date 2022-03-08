//search模块的小仓库

import { reqSearchInfo } from "@/api";

const state = {
    searchInfo: {}
};
const mutations = {
    SAERCHINFO(state, searchInfo) {
        state.searchInfo = searchInfo
    }
};
const actions = {
    //获取search模块数据
    //params默认是{}
    async getSearchInfo({ commit }, params = {}) {
        let result = await reqSearchInfo(params);
        if (result.code == 200) {
            commit('SAERCHINFO', result.data)
        }
    }
};

//计算属性。getters在项目中，一般用于简化数据（不用一直写多层级，例：a.b.c.d）
const getters = {
    //形参state是当前仓库的state，不是大仓库的state（也就是这一文件的上面的state）
    goodsList(state) {
        //如果出了问题（网络），没有获取到数据，那返回undefined。不能返回undefined，所以给[]
        return state.searchInfo.goodsList || [];
    },
    trademarkList(state) {
        return state.searchInfo.trademarkList;
    },
    attrsList(state) {
        return state.searchInfo.attrsList;
    }
};

//对外暴露
export default {
    state,
    mutations,
    actions,
    getters
}