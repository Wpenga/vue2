<template>
  <div class="wrapper">
    <div class="windows">
      <div style="margin: 20px 0;text-align: center;font-size: 24px">登录</div>
      <el-form :label-position="labelPosition" ref="user" label-width="100px" :model="user" :rules="rules">
        <div style="padding: 0 30px 0 0">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="user.username" size="medium" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="user.password" placeholder="请输入密码" show-password size="medium" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
        </div>
        <div class="btn">
          <el-button type="warning" size="medium" @click="$router.push('/register')">注册</el-button>
          <el-button type="primary" size="medium" @click="onLogin('user')">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      labelPosition: "right",
      user: {
        username: "",
        password: ""
      },
      rules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
        ],
        password:[ { required: true, message: '请输入密码', trigger: 'blur' }]
      },
    }
  },

  methods: {
    onLogin(user) {
      // 处理登录逻辑
      this.$refs[user].validate((valid) => {
        if (valid) {//表单校验合法
          // alert('submit!');
          this.request.post("/user/login",this.user).then(res=>{
            if(res.code==="200"){
              this.$message.success("登录成功")
              this.$router.push("/")
              //存储数据 包含用户名，密码，昵称，图片url
              localStorage.setItem("user",JSON.stringify(res.data))

            }else if(res.code=="500"){
              this.$message.error("系统错误")
            }else if(res.code=="600"){
              this.$message.error("用户名或密码错误")
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
    onRegister() {
      // 处理注册逻辑
      this.$router.push("/register")
    }
  }
};
</script>

<style scoped>
.wrapper {
  height: 100vh;
  background-image: linear-gradient(to bottom right, #FC466B, #3F5EFB);/*渐变*/
  display: flex;
  justify-content: center;
  align-items: center;
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
</style>