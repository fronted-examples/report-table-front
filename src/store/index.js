import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from "vuex-persistedstate"

import user from './user/index'
import app from './app/index'

Vue.use(Vuex)

// 用户信息持久化
const userPersistedState = createPersistedState({
  key: 'user',
  storage: window.sessionStorage, // 修改存储的状态
  paths: ['user'] // 存储的指定的模块的名字（存储某个模块对象）
})

const appPersistedState = createPersistedState({
  key: 'app',
  storage: window.sessionStorage, // 修改存储的状态
  paths: ['app'] // 存储的指定的模块的名字（存储某个模块对象）
})

const store = new Vuex.Store({
  modules: {
    user,
    app
  },
  plugins: [userPersistedState, appPersistedState] // 状态持久化
})

export default store
