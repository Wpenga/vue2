import Mock from "mockjs";

//模拟数据
Mock.mock('/user/getinfo','get',{
    "code":200,
    "data":{
        "username": "2019",
        "name":'@cname'
    }
})

// Mock.mock('/user/login', {
//     "code":200,
//     "data":{
//         "username": "2019",
//         "name":'@cname'
//     }
// });


Mock.mock("/user/login", "post", (options) => {
  const { username, password } = JSON.parse(options.body)
  if (username === "admin" && password === "admin") {
    return {
      code: "200",
      data: {
        username: "admin",
        nickname: "管理员",
        avatar: "https://example.com/avatar.png",
        menus: ["dashboard", "user", "role", "permission"],
      },
    }
  } else {
    return {
      code: "401",
      message: "用户名或密码错误",
    }
  }
})

Mock.mock("/student/sethealth","post",(options) => {
    return{
        data:{
            message:"成功"
        }
    }
})