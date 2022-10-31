<template>
  <el-card class="index-card"
           shadow="always">
    <h3 class="title"> 登录 </h3>
    <el-form :model="form">
      <el-form-item>
        <el-input v-model="form.username"
                  maxlength="30"
                  placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.userPwd"
                  maxlength="30"
                  placeholder="密码"
                  show-password></el-input>
      </el-form-item>
      <el-form-item>
        <div class="code-item">
          <el-input class="code-input"
                    v-model="form.authCode"
                    maxlength="30"
                    placeholder="验证码"
                    show-password></el-input>
          <el-button class="send-btn"
                     @click="sendCode">发送验证码</el-button>
        </div>
      </el-form-item>
      <el-button class="login-submit"
                 type="primary"
                 @click="submit">
        登录 </el-button>
      <el-button class="login-submit"
                 type="primary"
                 @click="logout">
        退出登录 </el-button>

      <div class="footer">
        <span class="opacity-btn"
              @click="authorLogin">
          <img class="btn-img"
               src="https://account.cnblogs.com/assets/img/oauth/GitHub.png" />
        </span>
      </div>
    </el-form>
  </el-card>
</template>

<script>
import { sendCode, sso, ssoLogout } from '@/apis/index'
import axios from 'axios'

export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: "",
        password: "",
        authCode: ""
      },
      sso: {
        url: "http://localhost:8001/author/oauth/authorize",
        redirect_uri: "http://localhost:8080/callback",
        client_id: "client3",
        response_type: "code",
        scope: "custom"
      }
    }
  },
  methods: {
    submit () {
      // sso()
      window.location.href = "http://localhost:1112/hello"
      // this.$router.push("/login")
      // if (this.form.username.length < 4) {
      //   ElMessage.warning("用户名长度至少 4 位")
      //   return
      // }
      // if (this.form.userPwd.length < 6) {
      //   ElMessage.warning("密码长度至少 6 位")
      //   return
      // }

      // // 直接向后端请求，后端传入参数为 null，需要通过 qs 进行对象解析传递
      // let loginData = {
      //   username: this.form.username,
      //   password: this.form.userPwd
      // }
      // axios.post('/api/login', qs.stringify(loginData))
      //   .then(response => {
      //     if (response.data.statusCode == 1000 && response.data.statusCode == 1001) {
      //       ElMessage.success("登录成功")
      //     } else {
      //       ElMessage.error(response.data.statusMsg)
      //     }
      //   })
      //   .catch(function (error) {
      //     ElMessage.error("未知错误")
      //     console.log(error)
      //   })
    },
    logout () {
      ssoLogout()
    },
    sendCode: function () {
      const params = {
        phone: "17321019208"
      }
      sendCode(params).then()
    },
    authorLogin () {
      let href = `${this.sso.url}?client_id=${this.sso.client_id}&redirect_uri=${this.sso.redirect_uri}&response_type=${this.sso.response_type}&scope=${this.sso.scope}`

      let otherWindow = window.open(href, "name", "height=454, width=525, top=250, left=200, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no, status=no")

      // 父子窗口通信
      this.$registerMessage(this.getMessage)
    },
    login: function () {
      const params = {
        grant_type: "password",
        scope: "custom",
        client_id: "client3",
        client_secret: "123456"
      }
      getToken(params).then((res) => {
        window.close()
        console.log('res: ', res)
        this.$router.push("/home")
      })
    },
    getMessage (message) {
      console.log('update: ', message.data)
      this.$router.push({
        name: "StatisticsYears"
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.index-card {
  width: 500px;
  height: 380px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  .title {
    font-size: 36px;
    font-family: '华文行楷';
    text-align: center;
    font-weight: bold;
    padding: 20px 0;
  }
  .code-item {
    display: flex;
    .code-input {
      width: 200px;
    }
    .send-btn {
      width: 150px;
      margin-left: 20px;
    }
  }
  .login-submit {
    width: 100%;
  }
  .footer {
    width: 100%;
    margin-top: 20px;
    box-sizing: border-box;
    padding: 0 45%;
    .opacity-btn {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      cursor: pointer;
      .btn-img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
