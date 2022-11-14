// import store from '@/store/index'

// const userId = store.state.user ? store.state.user.userInfo ? store.state.user.userInfo.id : null : null

// socket主要对象
var socket = {
  webSocket: null,
  // 固定的WebSocket地址：此处是从env文件中读取socket地址，可以自行从其他config文件中读取或直接写死
  // 如需使用动态WebSocket地址，请自行作ajax通讯后扩展
  ws_url: `${process.env.VUE_APP_API_SOCKET_URL}/${1}`,
  // 开启标识
  socket_open: false,
  // 心跳timer
  hearbeat_timer: null,
  // 心跳发送频率
  hearbeat_interval: 5000,

  // 是否自动重连
  is_reonnect: true,
  // 重连次数
  reconnect_count: 3,
  // 已发起重连次数
  reconnect_current: 1,
  // 重连timer
  reconnect_timer: null,
  // 重连频率
  reconnect_interval: 3000,

  /**
   * 初始化连接
   */
  init: () => {
    if (!('WebSocket' in window)) {
      console.log('浏览器不支持WebSocket')
      return null
    }

    // 已经创建过连接不再重复创建
    if (socket.webSocket) {
      return socket.webSocket
    }

    // 销毁ws。不销毁，会触发类似心跳，一直给后端发数据
    socket.wsDestroy()

    // 初始化ws
    socket.webSocket = new WebSocket(socket.ws_url)

    // ws连接建立时触发
    socket.webSocket.addEventListener('open', socket.wsOpenHanler)
    // ws服务端给客户端推送消息
    socket.webSocket.addEventListener('message', socket.wsMessageHanler)
    // ws通信发生错误时触发
    socket.webSocket.addEventListener('error', socket.wsErrorHanler)
    // ws关闭时触发
    socket.webSocket.addEventListener('close', socket.wsCloseHanler)
  },
  wsOpenHanler (event) {
    console.log('ws建立连接成功')
  },
  wsMessageHanler (e) {
    console.log('wsMessageHanler')
    console.log(e)
    // const redata = JSON.parse(e.data)
    // console.log(redata)
  },
  /**
   * ws通信发生错误
   */
  wsErrorHanler (event) {
    console.log(event, '通信发生错误')
    socket.init()
  },
  /**
   * ws关闭
   */
  wsCloseHanler (event) {
    console.log(event, 'ws关闭')
    socket.init()
  },
  /**
   * 前端主动向后端发送消息
   * @param {*} data 发送数据
   * @param {*} callback 发送后的自定义回调函数
   */
  send: (data, callback = null) => {
    // 开启状态直接发送
    // 检查ws连接状态,readyState值为0表示尚未连接，1表示建立连接，2正在关闭连接，3已经关闭或无法打开
    if (socket.webSocket.readyState === socket.webSocket.OPEN) {
      socket.webSocket.send(data)
    } else if (socket.webSocket.readyState === socket.webSocket.CONNECTING) {
      // 正在开启状态，则等待1s后重新调用
      setTimeout(function () {
        socket.send(data, callback)
      }, 1000)
    } else {
      // 未开启，则等待1s后重新调用
      socket.init()
      setTimeout(function () {
        socket.send(data, callback)
      }, 1000)
    }
  },
  /**
   * 销毁ws
   */
  wsDestroy () {
    if (socket.webSocket !== null) {
      socket.webSocket.removeEventListener('open', this.wsOpenHanler)
      socket.webSocket.removeEventListener('message', this.wsMessageHanler)
      socket.webSocket.removeEventListener('error', this.wsErrorHanler)
      socket.webSocket.removeEventListener('close', this.wsCloseHanler)
      socket.webSocket.close()
      socket.webSocket = null
      clearInterval(socket.hearbeat_timer)
    }
  },

  /**
   * 心跳
   * 前端每隔一段时间自动向后端发送消息
   */
  heartbeat: (data) => {
    console.log('socket', 'ping')
    if (socket.hearbeat_timer) {
      clearInterval(socket.hearbeat_timer)
    }

    socket.hearbeat_timer = setInterval(() => {
      socket.send(data)
    }, socket.hearbeat_interval)
  },

  /**
   * 主动关闭连接
   */
  close: () => {
    console.log('主动断开连接')
    clearInterval(socket.hearbeat_interval)
    socket.is_reonnect = false
    socket.webSocket.close()
  },

  /**
   * 重新连接
   */
  reconnect: () => {
    console.log('发起重新连接', socket.reconnect_current)

    if (socket.webSocket && socket.socket_open) {
      socket.webSocket.close()
    }

    socket.init()
  }
}

// 导出socket对象
export {
  socket
}
