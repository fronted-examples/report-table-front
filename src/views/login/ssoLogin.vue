<template>
  <div>
  </div>
</template>

<script>
import { getToken } from '@/apis/index'
export default {
  name: 'ssoLogin',
  data () {
    return {
      state: "",
      code: "",
    }
  },
  methods: {
    getToken: function () {
      const params = {
        code: this.code,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:8080/login",
        scope: "all",
        client_id: "client3",
        client_secret: "123456"
      }
      getToken(params).then((res) => {
        this.$router.push("/home")
      })
    }
  },
  mounted: function () {
    this.code = this.$route.query.code
    this.state = this.$route.query.state
    this.getToken()
  }
}
</script>

<style>
</style>

