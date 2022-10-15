
export default {
  data: function () {
    return {
      func: null
    }
  },
  beforeDestroy () {
    this.$destoryMessage(this.func)
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
    $destoryMessage: function (func) {
      window.removeEventListener('message', func)
    },
    /**
     * 窗口间发消息
     */
    $sendMessage: function (message, href) {
      window.opener.postMessage(message, href)
    }
  }
}