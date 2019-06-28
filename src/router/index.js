import Vue from 'vue'
import Router from 'vue-router'

// 加载第三方模块进度条
import nprogress from 'nprogress'

Vue.use(Router)

const router = new Router({
  routes: [
    // {
    //   // 路由的名字, 和组件名没关系, 说白了就是path的别名
    //   // 好处就是假如你的path就是/x/x/x/x/x, 我们就可以直接这样写
    //   // $router.push('/x/x/x/x')
    //   // $router.push({name: 'xxx'}), 不仅如此, 给路由起名字是个好习惯
    //   name: 'home',
    //   path: '/',
    //   // @ 表示src目录,无论当前文件在哪, @只表示src
    //   component: () => import('@/views/home')
    // },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    },
    {
      // name: 'layout',
      path: '/',
      component: () => import('@/views/layout'),
      children: [ // 所有子路由都显示到父路由的router-view中
        {
          name: 'home',
          path: '', // 什么都不写，layout 默认子路由
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        },
        {
          name: 'article',
          path: '/article',
          component: () => import('@/views/article')
        }
      ]
    }
  ]
})

// 导航守卫 -- beforeEach路由导航开始前都会进入这里
/*
 * 所有路由导航都要经过这里
 * to 去哪儿，from 来自哪里，next 允许通过的方法
 */
router.beforeEach((to, from, next) => {
  // 在此开始出现进度条
  nprogress.start()
  // 获取登陆信息
  const userInfo = window.localStorage.getItem('userInfo')
  // 1. 如果不是到登陆页面，先判断是否已登陆
  if (to.path !== '/login') {
    // console.log(to)
    if (!userInfo) {
      next({ name: 'login' }) // 没登陆， 就先登陆
    } else {
      next() // 登陆了就允许通过
    }
  } else { // 2. 是到登陆界面
    if (userInfo) {
      // 判断有无登陆，登陆了让其返回来的地方，没登陆就可以登陆
      next(false) // 返回来的地方
    } else {
      // 没登陆就登陆
      console.log(to) // path: "/login" name: "login"
      next() // 允许通过
    }
  }
})

// 导航守卫 -- afterEach路由导航结束后会进入这里
router.afterEach((to, from) => {
  // 进度条结束
  nprogress.done()
})

// 导出路由
export default router
