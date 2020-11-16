import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types'
const str = window.localStorage
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    user: {},
    // token: null, // 这里难道不从缓存中取到吗？？？不写getter？？？
    // token: null,
    token: 1,
    title: '',

    // address: '',
    // isLogin: 0,
    isLogin: str.getItem('isLogin') ? str.getItem('isLogin') : '',
    address: str.getItem('address') ? str.getItem('address') : '',
    // 关于管理元权限问题
    // userLimit: 0
    userLimit: str.getItem('userLimit') ? str.getItem('userLimit') : ''
  },
  mutations: {
    [types.LOGIN]: (state, token) => {
      localStorage.token = token
      state.token = token
    },
    [types.LOGOUT]: (state) => {
      localStorage.removeItem('token')
      state.token = null
    },
    [types.TITLE]: (state, title) => {
      state.title = title
    },

    setAddress(state, address) {
      state.address = address
      str.setItem('address', address)
    },
    setUserLimit(state, userLimit) {
      state.userLimit = userLimit
      str.setItem('userLimit', userLimit)
    },
    changeLogin(state, login) {
      state.isLogin = login
      str.setItem('isLogin', login)
    }
  },
  actions: {

  },
  getters: {
    // address: state => state.address,
    address: state => str.getItem('address'),
    // userLimit: state => state.userLimit
    userLimit: state => str.getItem('userLimit'),
    // isLogin: state => str.getItem('isLogin')
    isLogin: state => str.getItem('isLogin')
  }
})