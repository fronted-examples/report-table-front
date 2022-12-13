<template>
  <div>
    内容
    <input id="text"
           type="text"
           style="width:500px" />
    <button @click="send">发送消息</button>
    <button @click="connect">建立连接</button>
    <button @click="disconnect">释放连接</button>
    <div id="message"></div>
  </div>
</template>

<script>
import SockJS from 'sockjs-client/dist/sockjs.min.js'
import Stomp from 'stompjs'

export default {
  data () {
    return {
      stompClient: null
    }
  },
  methods: {
    connect () {
      var socket = new SockJS('http://localhost:1112/api') //连接上端点(基站)
      this.stompClient = Stomp.over(socket)           //用stom进行包装，规范协议
      this.stompClient.connect({}, (frame) => {
        this.$message.success('连接成功')
        this.stompClient.subscribe('/topic/game_rank', (result) => {
          console.info("result=" + result)
          this.showContent(JSON.parse(result.body))
        })
      }, err => {
        this.$message.error('连接失败: ' + err)
      })
    },
    send () {
      var message = document.getElementById('text').value
      this.stompClient.send("/app/v2/chat", {}, JSON.stringify({ 'content': message }))
    },
    //显示内容
    showContent (body) {
      console.log(body)
      document.getElementById('message').innerHTML += body.content + "," + body.time + '<br/>'
    },
    disconnect () {
      if (this.stompClient !== null) {
        this.stompClient.disconnect()
        this.$message.success('释放连接成功')
      } else {
        this.$message.error('释放连接失败')
      }
    }
  }
}
</script>
