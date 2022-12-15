import router from '@/router/index'
import store from '@/store/index'

// 不需要重定向的白名单
const whiteList = ['/', '/callback']

router.beforeEach((to, from, next) => {
  const hasUser = store.getters['user/user']

  if (hasUser) {
    if (to.path === '/' || to.path === '') {
      next('/home')
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/') // 否则全部重定向到登录页
      // next(`/login?redirect=${to.path}`)
    }
  }
})
