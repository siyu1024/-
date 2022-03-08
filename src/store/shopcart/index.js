import { reqCartList, reqDeleteCart, reqChangeChecked } from "@/api";

const state = {
    cartList: []
};
const mutations = {
    GETCARTLIST(state, cartList) {
        state.cartList = cartList
    }
};
const actions = {
    async getCartList({ commit }) {
        let result = await reqCartList();
        if (result.code == 200) {
            commit('GETCARTLIST', result.data)
        }
    },
    async deleteCart({ commit }, skuId) {
        let result = await reqDeleteCart(skuId);
        //返回的数据没有data，所以不用三连环。
        //但是组件那里需要知道成功还是失败。成功了就刷新页面，失败了就弹出信息。所以这个函数返回promise对象。
        if (result.code == 200) {
            return 'success'
        } else {
            return Promise.reject(new Error('fail'));
        }
    },
    deleteCheckedCart({ dispatch, getters }) {
        //context:小仓库。commit（提交mutation修改state），getters（计算属性），dispatch（派发action），state（当前仓库数据）都在这里面。
        //获取购物车的全部商品-数组-所以用forEach
        let promiseAll = [];
        getters.cartList.cartInfoList.forEach(item => {
            //如果dispatch成功的话，返回的是成功的promise
            let promise = item.isChecked == 1 ? dispatch('deleteCart', item.skuId) : '';
            promiseAll.push(promise);
        });
        //Promise.all：只有全部的p1|p2|p3...都成功，范湖结果为成功。至少有一个失败结果，就是失败结果。（在这里，''算是什么都没有，也就是说''不算失败）
        return Promise.all(promiseAll)
    },
    async changeChecked({ commit }, { skuId, isChecked }) {
        let result = await reqChangeChecked(skuId, isChecked);
        //返回的数据没有data，所以不用三连环。
        //但是组件那里需要知道成功还是失败。成功了就刷新页面，失败了就弹出信息。所以这个函数返回promise对象。
        if (result.code == 200) {
            return 'success';
        } else {
            return Promise.reject(new Error('fail'))
        }
    },
    changeAllChecked({ dispatch, state }, isChecked) {
        let promiseAll = []
        state.cartList[0].cartInfoList.forEach(item => {
            let promise = dispatch('changeChecked', { skuId: item.skuId, isChecked })
            promiseAll.push(promise)
        })
        return Promise.all(promiseAll)
    }
};
const getters = {
    cartList(state) {
        return state.cartList[0] || {}
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}