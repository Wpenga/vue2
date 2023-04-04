import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Manage.vue'
import index from "@/store";
Vue.use(VueRouter)

const routes = [

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
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//刷新会使路由重置
export const setRoutes= () =>{
  const storeMenus = localStorage.getItem("menus")
  ////动态路由 拼装
  if(storeMenus){
    const manageRoute = { path: '/', name: 'Manage', component: () => import('../views/Manage.vue'), redirect: "/home", children: [
        { path: 'person', name: '个人信息', component: () => import('../views/Person.vue')},
        { path: 'password', name: '修改密码', component: () => import('../views/Password.vue')}
        ]}
    const menus = JSON.parse(storeMenus)
    menus.forEach(item =>{
      if (item.path) {  // 当且仅当path不为空的时候才去设置路由
        let itemMenu = { path: item.path.replace("/", ""), name: item.name, component: () => import('../views/' + item.pagePath + '.vue')}
        manageRoute.children.push(itemMenu)
      } else if(item.children.length) {
        item.children.forEach(item => {
          if (item.path) {
            let itemMenu = { path: item.path.replace("/", ""), name: item.name, component: () => import('../views/' + item.pagePath + '.vue')}
            manageRoute.children.push(itemMenu)
          }
        })
      }
    })
    //获取当前路由对象名称数组
    const  currentRouteNames = router.getRoutes().map(v => v.name)
    if(!currentRouteNames.includes('Manage')){
      //添加到路由对象中
      router.addRoute(manageRoute)
      // console.log('添加了'+JSON.stringify(manageRoute))
    }

  }
}
//刷新后重新设置路由
// setRoutes()
router.addRoute({
  path: '/',
  name: 'Manage',
  component: () => import('../views/Manage.vue'),
  //默认访问主页
  redirect:"/home",
  children:[
    {path: 'user',name:'用户管理',component: () => import('../views/User.vue')},
    {path: 'role',name:'角色管理',component: () => import('../views/Role.vue')},
    {path: 'menu',name:'菜单管理',component: () => import('../views/Menu.vue')},
    {path: 'Home',name:'主页',component: () => import('../views/Home.vue')},
    {path: '/person',name: '个人信息',component: () => import('../views/Person.vue')},
    {path: '/file',name: '文件管理',component: () => import('../views/File.vue')}
  ],
},)


//路由守卫
router.beforeEach((to,from, next)=>{//路由名称
  localStorage.setItem("currentPathName", to.name)  //设置路由名称
  index.commit("setPath")  ///触发store的数据更新

  // 未找到路由的情况
  if (!to.matched.length) {
    const storeMenus = localStorage.getItem("menus")
    if (storeMenus) {
      next("/404")
    } else {
      // 跳回登录页面
      next("/login")
    }
  }

  next()//放行路由
})
export default router
