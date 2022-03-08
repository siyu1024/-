//登录 & 注册 都在这里写
import { reqGetCode, reqUserRegister, reqUserLogin, reqUserInfo, reqLogout } from '@/api'
import { setToken, getToken, removeToken } from '@/utils/token'

const state = {
    code: '',
    // token: getToken(),
    token: localStorage.getItem('TOKEN'),
    userInfo: {}
}
const mutations = {
    GETCODE(state, code) {
        state.code = code
    },
    USERLOGIN(state, token) {
        state.token = token
    },
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo
    },
    LOGOUT(state) {
        state.token = ''
        state.userInfo = ''
        removeToken()
    }
}
const actions = {
    async getCode({ commit }, phone) {
        let result = await reqGetCode(phone)
        if (result.code == 200) {
            commit('GETCODE', result.data)
            return 'success'
        } else {
            return Promise.reject(new Error('fail'))
        }
    },
    //data可以换成其他的单词
    async userRegister({ commit }, data) {
        let result = await reqUserRegister(data)
        if (result.code == 200) {
            return 'success'
        } else {
            return Promise.reject(new Error('fail'))
        }
    },
    async userLogin({ commit }, data) {
        let result = await reqUserLogin(data);
        //服务器下发的token是用户的唯一标识符。
        //将来会经常用token找服务器要用户信息，并进行展示。（例：用token拿用户名，并展示在页面上。）
        if (result.code == 200) {
            commit('USERLOGIN', result.data.token);
            setToken(result.data.token);
            return 'success'
        } else {
            return Promise.reject(new Error('fail'))
        }
    },
    async getUserInfo({ commit }) {
        let result = await reqUserInfo();
        if (result.code == 200) {
            commit('GETUSERINFO', result.data)
            return 'success'
        } else {
            return Promise.reject(new Error('fail'))
        }
    },
    async logout({ commit }) {
        //这个是发请求给后端，让他们清除token
        let result = await reqLogout()
        if (result.code == 200) {
            //这是前端要做的事情，也要清除一些数据。在mutation处理state数据。在action里不能处理state。
            commit('LOGOUT');
            return 'success'
        } else {
            return Promise.reject(new Error('fail'))
        }
    }
}
const getters = {}

export default {
    state,
    mutations,
    actions,
    getters
}