import { AUTH_PARAMS, AUTH_LOGIN_PARAMS } from '@/utils/authUtil'

export default {
  data: function () {
    return {
      func: null,
      // $auth_params会把属性放到$data中，对应组件不能直接使用this.$auth_params获取数据
      auth_params: AUTH_PARAMS,
      auth_login_params: AUTH_LOGIN_PARAMS
    }
  },
  beforeDestroy () {
    this.$destroyMessage(this.func)
  },
  methods: {
    /**
     * 注册窗口通信事件
     */
    $registerMessage: function (func) {
      this.func = func
      window.addEventListener('message', func)
    },
    /**
     * 销毁窗口通信事件
     */
    $destroyMessage: function (func) {
      window.removeEventListener('message', func)
    },
    /**
     * 窗口间发消息
     * postMessage最多接收两个参数，
     * 一个是 MessageEvent, 另一个是window.location.origin
     */
    $sendMessage: function (message, href, type) {
      // window.opener.postMessage([message, type], href)
      const params = {
        message,
        type: type ? type : 'success'
      }

      window.opener.postMessage(params, href)
    }
  }
}
