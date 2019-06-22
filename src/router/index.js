import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      // 路由的名字, 和组件名没关系, 说白了就是path的别名
      // 好处就是假如你的path就是/x/x/x/x/x, 我们就可以直接这样写
      // $router.push('/x/x/x/x')
      // $router.push({name: 'xxx'}), 不仅如此, 给路由起名字是个好习惯
      name: 'home',
      path: '/',
      // @ 表示src目录,无论当前文件在哪, @只表示src
      component: () => import('@/views/home')
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})
