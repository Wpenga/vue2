import  Vue from 'vue'
import  Vuex from 'vuex'
import router, {resetRouter} from "@/router";
import { getToken, setToken, removeToken } from '@/utils/auth'
import {login,logout} from '@/api/user'
Vue.use(Vuex)

const  store = new Vuex.Store({
    state:{
        currentPathName:'',
        token:getToken(),
        username:'',
        nickname:'',
        // username:JSON.parse(localStorage.getItem("user")).username,
        // nickname:JSON.parse(localStorage.getItem("user")).nickname,
    },
    mutations:{
        
        setPath(state){
            state.currentPathName = localStorage.getItem("currentPathName")
        },
        setToken(state,token){
            state.token = token
        },
        setUsername(state, username){
            state.username = username
        },
        setNickname(state, nickname){
            state.nickname = nickname
        },
        logout() {
            
            // 清空缓存
            localStorage.removeItem("user")
            localStorage.removeItem("menus")
            localStorage.removeItem("token")
            localStorage.removeItem("yqdata")
            router.push("/login")
            // 重置路由
            resetRouter()
        }
    },
    actions:{
        login({ commit },data){
            console.log("登录");
            // const { username, password } = userInfo
            return new Promise((resolve, reject) => {
                
                // login({ username: username.trim(), password: password }).then(res => {
                //     if(res.code === '200'){
                //         modal.msgSuccess("登录成功")
                        // const data = res.data
                        // const {menus}  = res.data
                        commit("setToken",data.token)
                        commit('setUsername',data.username)
                        commit("setNickname",data.nickname)
                        //存储数据 包含用户名，密码，昵称，图片url
                        localStorage.setItem("user",JSON.stringify(data.user))
                        localStorage.setItem("token",JSON.stringify(data.token))
                        localStorage.setItem("menus",JSON.stringify(data.menus))
                        setToken(data.token)
                    // }else if(res.code === "500"){ 
                        
                    //     modal.msgError("系统错误")
                    // }else if(res.code === "600"){
                    //     modal.msgError("用户名或密码错误")
                    // }
                //   resolve()
                    
                // }).catch(error => {
                //   reject(error)
                // })
            })
        }
    }
})

export  default  store