import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'

// 优先查找文件,如文件找不到则找目录
// 找到目录,优先加载目录中的index.js
import router from './router'

import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'

// 加载进度条模块样式，全局通用
import 'nprogress/nprogress.css'

// 为神魔这样写
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
