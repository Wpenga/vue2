import request from "@/utils/request";
// 用户登录
export function login(data) {
    return request({
        url: "/user/login",
        method: "POST",
        data,
    });
}

// 用户登出
export function logout() {
    return request({
        url: "/user/logout",
        method: "get"
    });
}

// 用户注册
export function register(data) {
    return request({
        url: "/user/register",
        method: "post",
        data
    });
}
// 更新信息
export function updateUser(data){
    return request({
        url: "/user",
        method: "put",
        data
    });
}