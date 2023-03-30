import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Manage.vue'
import index from "@/store";
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Manage',
    component: () => import('../views/Manage.vue'),
    //默认访问主页
    redirect:"/home",
    children:[
      {path: 'user',name:'用户管理',component: () => import('../views/User.vue')},
      {path: 'role',name:'角色管理',component: () => import('../views/Role.vue')},
      {path: 'Home',name:'主页',component: () => import('../views/Home.vue')},
      {path: '/person',name: '个人信息',component: () => import('../views/Person.vue')},
      {path: '/file',name: '文件管理',component: () => import('../views/File.vue')}
    ],
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//路由守卫
router.beforeEach((to,from, next)=>{//路由名称
  localStorage.setItem("currentPathName", to.name)  //设置路由名称
  index.commit("setPath")  ///触发store的数据更新
  next()//放行路由
})
export default router
