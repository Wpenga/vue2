<template>
  <el-card style="width: 500px;">
    <el-form label-width="120px" size="small" :model="form" :rules="rules" ref="form" status-icon> 

      <el-form-item label="原密码" prop="password">
        <el-input v-model="form.password" autocomplete="off" show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" autocomplete="off" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" autocomplete="off" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save('form')">确 定</el-button>
        <el-button @click="resetForm('form')">重 置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "Password",
  data() {
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.form.confirmPassword !== '') {
            this.$refs.form.validateField('confirmPassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
    };
    return {
      form: {},
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      rules: {
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 5, message: '长度不少于5位', trigger: 'blur' }
        ],
        newPassword: [
          { validator:validatePass, required: true,trigger: 'blur' },
          { min: 5, message: '长度不少于5位', trigger: 'blur' }
        ],
        confirmPassword: [
          { validator:validatePass2, required: true, trigger: 'blur' },
          { min: 5, message: '长度不少于5位', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    this.form.username = this.user.username
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // if (this.form.newPassword !== this.form.confirmPassword) {
          //   this.$message.error("2次输入的新密码不相同")
          //   return false
          // }
          // if(this.form.password === )
          if (this.form.password === this.form.newPassword) {
            this.$message.warning("新密码和旧密码相同")
            return false
          }
          this.request.post("/user/password", this.form).then(res => {
            if (res.code === '200') {
               this.$modal.prompt('修改成功，请重新登录').then(function() {
                  return this.$store.commit("logout")
                }).then((res) => {
                  this.$message.success("退出成功")
                    
              }).catch(() => {});
              // this.$message.success("修改成功")
             
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
    }
  }
}
</script>

<style>
.avatar-uploader {
  text-align: center;
  padding-bottom: 10px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 138px;
  height: 138px;
  line-height: 138px;
  text-align: center;
}
.avatar {
  width: 138px;
  height: 138px;
  display: block;
}
</style>
