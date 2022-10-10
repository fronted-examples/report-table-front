<template>
  <el-card class="index-card" shadow="always">
    <h3 class="title"> 登录 </h3>
    <el-form :model="form">
      <el-form-item>
        <el-input v-model="form.username"
                  maxlength="30"
                  placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.userPwd"
                  maxlength="30" placeholder="密码"
                  show-password></el-input>
      </el-form-item>
      <el-button class="login-submit"
                 type="primary" @click="submit">
        登录 </el-button>

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
import { getToken } from '@/apis/index'

export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: "",
        userPwd: ""
      }
    }
  },
  mounted: function () {
    this.code = this.$route.query.code
    this.state = this.$route.query.state
    this.getToken()
  },
  methods: {
    submit () {
      this.$router.push("/login")
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
    authorLogin () {
      window.location.href = "http://localhost:8001/author/oauth/authorize?client_id=client3&redirect_uri=http://localhost:8080&response_type=code&scope=all"
    },
    getToken: function () {
      const params = {
        code: this.code,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:8080",
        scope: "all",
        client_id: "client3",
        client_secret: "123456"
      }
      getToken(params).then((res) => {
        this.$router.push("/home")
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.index-card {
  width: 500px;
  height: 350px;
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
