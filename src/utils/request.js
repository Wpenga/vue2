import store from '@/store';
import axios from 'axios'
import ElementUI from "element-ui"
import {serverIp} from "../../public/config";
const request = axios.create({
    // baseURL: '/dev-api',
    // baseURL: `http://${serverIp}:8090`,
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000
})

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    let token =localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")):null
    if(token){
        config.headers['token'] = token;  // 设置请求头
    }

    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
       
        let res = response.data;
        // 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res
        }
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        if(res.code.toString() === "401"){  //响应失败
            ElementUI.Message({
                message:res.msg+'需重新登录',
                type:"error"
            })
            store.commit('logout')//退出
        }
        return res;
    },
    error => {
        // store.commit('logout')
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)


export default request

