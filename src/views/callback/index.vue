<template>
  <div>
    callback
  </div>
</template>

<script>
import { getToken } from '@/apis/index'

export default {
  data: function () {
    return {
      a: ""
    }
  },
  mounted () {
    this.code = this.$route.query.code
    this.state = this.$route.query.state

    if (this.code) {
      this.ssoLogin()
    }
  },
  methods: {
    toOther () {
      console.log('router: ', this.$route)
    },
    /**
     * 第三方授权登录
     */
    ssoLogin: function () {
      const params = {
        code: this.code,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:8080/callback",
        scope: "custom",
        client_id: "client3",
        client_secret: "123456"
      }
      getToken(params).then((res) => {
        window.close()
        console.log('res: ', res)
        this.$sendMessage(res, window.location.origin)
      })
    }
  }
}
</script>