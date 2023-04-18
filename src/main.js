import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import './assets/global.css';
import request from "./utils/request";
import store from "@/store";
import '@/utils/hasPermi' // permission control
//获取时间
import {nowTime,getdate} from  "@/utils/getTime"; 
import { parseTime} from "@/utils/parseTime";
//模拟api
// import "./mock";
//插件 包含 弹窗
import plugins from "@/plugins"

// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
import Editor from "@/components/Editor"
Vue.config.productionTip = false

Vue.use(ElementUI,{size:"mini"});
Vue.use(plugins);
//全局组件
Vue.component('RightToolbar', RightToolbar)
Vue.component('Pagination', Pagination)
Vue.component('Editor', Editor)

// Vue.prototype.this.request=request
// Vue.prototype.axios=request
//全局引入 注册
Vue.prototype.request=request
Vue.prototype.nowTime=nowTime
Vue.prototype.getdate=getdate
Vue.prototype.parseTime = parseTime
// Vue.prototype.modal=modal
// Vue.prototype.modal = modal
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
