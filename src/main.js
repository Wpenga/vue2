import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import './assets/global.css';
import request from "../utils/request";
import store from "@/store";
// import "./mock";
Vue.config.productionTip = false

Vue.use(ElementUI,{size:"mini"});


// 封装一个函数,格式化时间为yyyy-MM-dd格式,挂在到全局
Vue.prototype.$formart = function(fmt) {
  var date = new Date(fmt);
  var date_value = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  return date_value
}

// Vue.prototype.this.request=request
// Vue.prototype.axios=request
//全局引入 注册
Vue.prototype.request=request
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
