import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import axios from 'axios'
// import VueSession from 'vue-session'
// 引入echarts
import * as echarts from 'echarts'
// import horizontalScroll from 'el-table-horizontal-scroll'

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.use(ElementUI)
// Vue.use(VueSession)
// Vue.use(horizontalScroll)
new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
