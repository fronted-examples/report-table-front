<script>
// 第三方登录获取token，并通知登录页进行接下来的操作
import { getToken, getSession } from '@/apis/index'

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
      this.authorizeLogin()
    }

    if (this.state === "sso") {
      this.ssoLogin()
    }
  },
  // 手动调用render函数，不渲染任何元素
  render: function (h) {
    return (null)
  },
  methods: {
    toOther () {
      console.log('router: ', this.$route)
    },
    /**
     * 第三方授权登录
     */
    authorizeLogin: function () {
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
    },
    ssoLogin () {
      getSession().then((res) => {
        console.log('获取session: ', res)
        window.close()
        this.$sendMessage(res, window.location.origin)
      })
    }
  }
}
</script>
