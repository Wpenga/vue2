import Mock from "mockjs";

//模拟数据
Mock.mock('http://localhost:8080/user/getinfo','get',{
    "code":200,
    "data":{
        "username": "2019",
        "name":'@cname'
    }
})

Mock.mock('http://localhost:8080/user/login',{
    "code":200,
    "data":{
        "username": "2019",
        "name":'@cname'
    }
})