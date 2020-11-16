import Vue from 'vue'
import axios from './http'
import store from './store/store'
import router from './router'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI, {
  size: 'mini'
});
Vue.config.productionTip = false

import './components/iconSvg' // iconSvg

// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.axios = axios;

new Vue({
  router,
  store,
  axios,
  render: h => h(App)
}).$mount('#app')