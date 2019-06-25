import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
// 加载axios模块
import axios from 'axios'

// 优先查找文件,如文件找不到则找目录
// 找到目录,优先加载目录中的index.js
import router from './router'

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

// 为神魔这样写
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
