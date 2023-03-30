import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import './assets/global.css';
import request from "../utils/request";
import index from "@/store";
Vue.config.productionTip = false

Vue.use(ElementUI,{size:"mini"});

// Vue.prototype.this.request=request
// Vue.prototype.axios=request
//全局引入 注册
Vue.prototype.request=request
new Vue({
  store: index,
  router,
  render: h => h(App)
}).$mount('#app')
