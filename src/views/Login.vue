<template>
  <!-- style="{ backgroundImage: `url(${backImg})` }" -->
  <div >
    <div class="wrapper" :style="{ backgroundImage: `url(${backImg})` }">
      <div class="title">校园疫情防控系统</div>
      <div class="windows">
        <div style="margin: 20px 0; text-align: center; font-size: 24px">
          登录
        </div>
        <el-form
          :label-position="labelPosition"
          ref="user"
          label-width="100px"
          :model="user"
          :rules="rules"
        >
          <div style="padding: 0 30px 0 0">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="user.username"
                size="medium"
                prefix-icon="el-icon-user"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="密码"
              prop="password"
              @keyup.enter.native="onLogin('user')"
            >
              <el-input
                v-model="user.password"
                placeholder="请输入密码"
                show-password
                size="medium"
                prefix-icon="el-icon-lock"
              ></el-input>
            </el-form-item>
          </div>
          <div class="btn">
            <el-button
              type="warning"
              size="medium"
              @click="$router.push('/register')"
              >注册</el-button
            >
            <el-button
              :loading="loading"
              type="primary"
              size="medium"
              @click="onLogin('user')"
              >登录</el-button
            >
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import router, { setRoutes } from "@/router";
import jsonp from 'jsonp';
import { login } from "@/api/user";
import backImg from "/src/assets/background.jpg"
import "@/assets/background.jpg"
export default {
  name: "Login",
  data() {
    return {
      backImg:backImg,
      loading: false,
      labelPosition: "right",
      user: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 11 个字符",
            trigger: "blur",
          },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },

  methods: {
    onLogin(user) {
      
      // 处理登录逻辑
      // this.$refs[user].validate(async (valid) => {
      this.$refs[user].validate((valid) => {
        if (valid) {//表单校验是否合法
          this.loading = true;
          login(this.user).then((res) => {
            // res = res.data
            if (res.code === "200") {
              this.loading = false;
              //存储数据 包含用户名，密码，昵称，图片url
              // localStorage.setItem("user",JSON.stringify(res.data))
              // localStorage.setItem("menus",JSON.stringify(res.data.menus))
              this.$store.dispatch("login", res.data);
              //设置当前路由
              setRoutes();
              this.$message.success("登录成功");
              this.$router.push("/");
              //地区数据
              localStorage.setItem("regionData",JSON.stringify(this.regionData))
              //疫情信息
              jsonp('https://interface.sina.cn/news/wap/fymap2020_data.d.json',{},(err,data)=>{
                  if(!err){
                    this.alldata = data.data
                    localStorage.setItem("yqdata",JSON.stringify(data.data))
                  }})
            } else if (res.code == "500") {
              this.loading = false;
              this.$message.error("系统错误");
            } else if (res.code == "600") {
              this.loading = false;
              this.$message.error("用户名或密码错误");
            } else if (res.code == "700") {
              this.loading = false;
              this.$message.warning("账号不存在，请注册");
              // this.$router.push("/register")
            }else{
              this.loading = false;
              this.$message.error("超时，请重试")
            }
          })
          .catch((err) => {
            this.loading = false;
              this.$message.error("错误:"+err);
            });;
        } else {
          console.log("非法!!");
          return false;
        }
      });
    },
    onRegister() {
      // 处理注册逻辑
      // axios.get("http://localhost:8080/user/getinfo").then((res) => {
      //   console.log(res);
      // });
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped>
.wrapper {
  height: 100vh;
  /* background-image: url("/src/assets/background.jpg"); */
  /*linear-gradient(to bottom right, #fc466b, #3f5efb); 渐变*/
  /* background-color: rgb(18, 243, 213); */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-size: cover;
  background-position: center center;
}

.windows {
  background-color: #fff;
  border-radius: 5px;
  width: 350px;
  height: 250px;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.btn {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-top: 20px;
}

.btn el-button:first-child {
  margin-right: 10px;
}

.title {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 50px;
  color: #ffffff;
  margin-top: 10px;
  margin-bottom: 30px;
}
</style>