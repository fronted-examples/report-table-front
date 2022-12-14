// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue"
import App from "./App"
import router from "./router"
import store from './store'

import gojs from "gojs"

import CodeMirror from "vue-codemirror"

import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"

import Templates from "@/templates/index"

import IndexMixin from './mixins/index'

import "@/assets/css/index.scss"

Vue.config.productionTip = false


Vue.mixin(IndexMixin)

Vue.use(ElementUI)
Vue.use(CodeMirror)
Vue.use(Templates)

Vue.prototype.go = gojs

//自定义指令
Vue.directive("has", {
  inserted: function (el, binding) {
    if (!permissionJudge(binding.value)) {
      el.parentNode.removeChild(el)
    }

    function permissionJudge (value) {
      if (value == "ignore") {
        return true
      }
      // 此处store.getters.getMenuBtnList代表vuex中储存的按钮菜单数据
      let apis = localStorage.getItem("apiList")
      let list = apis.split(",")
      if (list != null && list.length > 0) {
        for (let item of list) {
          if (item === value) {
            return true
          }
        }
      }

      return false
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
})
