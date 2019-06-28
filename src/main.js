import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
// 加载axios模块
import axios from 'axios'
// 处理js的大数字问题，超出js数据安全范围
import JSONbig from 'json-bigint'

// 优先查找文件,如文件找不到则找目录
// 找到目录,优先加载目录中的index.js
import router from './router'
// 此写法使得Vue.prototype.$router = router
// 再组件中使用this.$router, 与下边写的 $axios一样

import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'

// 加载进度条模块样式，全局通用
import 'nprogress/nprogress.css'

// 1. 配置axios的基础路由，也就是简化http://xxxx/xxxx.....
// 简写为，如： axios({url: '/authorizations'}), 路由中的 / ，多退少补

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

// 2. 几乎每个组件都要使用axios发送请求，频繁import就非常麻烦
// 所以可以将使用频繁的成员放到Vue.prototype中，就可以在组件中直接使用this.名称
// 原理是：所有的组件都是Vue的实例
// 所以在 Vue。prototype 中添加成员可以直接通过实例 this 进行访问
// Vue.prototype.foo = 'bar'
// 在Vue原型对象中添加成员，尽量使用 $ 起名，防止与组件中的成员冲突

Vue.prototype.$axios = axios

// 使用JSONbig 处理返回数据中超出js安全
// JSONbig 自己会分析数据中的那个数字超出范围
// 由于后端得数据id超出了js的安全整数范围，导致整数无法精确表示
// 可使用json-bigint处理，他会帮你把超出范围的数字处理好
axios.defaults.transformResponse = [function (data) {
  // data是未经js处理的后端响应数据：JSON格式字符串
  // return JSONbig.parse(data)
  // console.log(data)
  try {
    return JSONbig.parse(data)
  } catch (err) {
    return data
  }
}]

/*
  Axios 请求拦截器（先经过这里，再去发请求） -- 统一授权token
  所有使用axios发起的请求都要先经过这里
  config是本次请求相关的配置对象
  return config 就是允许通过的方式
*/

axios.interceptors.request.use(config => {
  const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
  // 只有登陆了才给需要token的接口统一添加token令牌
  // 登陆相关的接口不需要token令牌
  if (userInfo) {
    // 在请求头headers中设置Authorization
    config.headers.Authorization = `Bearer ${userInfo.token}`
    // console.dir(config)
  }
  return config
}, error => { // 处理错误
  return Promise.reject(error)
})

// Axios 响应拦截器（先经过这里，再回到发请求的地方） -- 统一处理响应数据
axios.interceptors.response.use(response => { // >= 200 && < 400 的状态码会进入这里
  // console.log(response)
  // response与发请求的res中的内容是一样的
  // 统一设置返回的数据格式
  if (typeof response.data === 'object') {
    return response.data.data
  } else {
    return response.data
  }
  // return response.data.data
}, error => { // >= 400 的状态码会进入这里
  const status = error.response.status
  // 如果401，说明token过期或未传，返回登录页重新登陆
  if (status === 401) {
    // 先清除本地存储中过期的的用户信息数据
    window.localStorage.removeItem('userInfo')
    router.push({
      name: 'login'
    })
  }
  return Promise.reject(error)
})

// 为神魔这样写
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
