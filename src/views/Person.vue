<template>
  <el-card style="width: 400px">
    <el-form label-width="100px" :rules="rules" :model="form" ref="form">
      <el-upload
        class="avatar-uploader"
        :action="'http://' + serverIp + ':8090/file/upload'"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
      >
        <img v-if="form.avatarUrl" :src="form.avatarUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>

      <el-form-item label="学号">
        <el-input
          v-model="form.username"
          disabled
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input
          v-model="form.nickname"
          autocomplete="off"
          
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="学号">
      <el-input v-model="form.id" autocomplete="off"></el-input>
    </el-form-item> -->
      <el-form-item label="性别">
        <el-radio-group v-model="form.sex">
          <el-radio label="男" />
          <el-radio label="女" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="地址">
        <el-cascader
          placeholder="可搜索"
          :options="options"
          v-model="addressSelections"
          filterable
          clearable
        >
        </el-cascader>
      </el-form-item>
      <!-- <el-form-item label="地址">
      <el-input v-model="form.address" autocomplete="off"></el-input>
    </el-form-item> -->
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>

      <!-- <el-form-item label="签到状态">
      <el-select v-model="form.sign" placeholder="请选择签到状态">
        <el-option label="签到" value="签到"></el-option>
        <el-option label="未签到" value="未签到"></el-option>
      </el-select>
    </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="save('form')"
          >确 定</el-button
        ></el-form-item
      >
    </el-form>
  </el-card>
</template>

<script>
import {getCodeAddress, getTextAderess} from "@/utils/getAddress";
import { serverIp } from "../../public/config";
export default {
  name: "Person",
  data() {
    // 邮箱校验规则
    var checkEmail = (rule, value, callback) => {
      //只匹配26大小写字母，0-9，符号'_'和'-'，中间必须@隔开
      let emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!value) {
        callback(new Error("邮箱不能为空"));
      }else{
        if (emailReg.test(value)) {
          return callback();
        } else {
          callback(new Error("邮箱格式错误"));
        }
      }
    };
    return {
      options: this.regionData,
      addressSelections: [],
      serverIp: serverIp,
      form: {},
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {},
      rules: {
        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "手机号码为11位", trigger: "blur" },
        ],
        email: [
          {
            required: true,
            validator: checkEmail,
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getUser().then((res) => {
      //地址映射,获得区域码 数组
      this.addressSelections = res.data.address?getCodeAddress(res.data.address):'';
      this.form = res.data;
    });
  },
  methods: {
    async getUser() {
      return await this.request.get("/user/username/" + this.user.username);
    },
    //更新数据
    save(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          //根据区域码获取对应地址
          this.form.address = getTextAderess(this.addressSelections)
          this.request.post("/user", this.form).then((res) => {
            if (res.code === "200") {
              this.$message.success("保存成功");
              //触发父级更新User的方法
              this.$emit("refreshUser");
              //更新浏览器存储的用户信息
              this.getUser().then((res) => {
                res.data.token = JSON.parse(localStorage.getItem("user")).token;
                localStorage.setItem("user", JSON.stringify(res.data));
              });
            } else {
              this.$message.error("保存失败");
            }
          });
        } else {
          // console.log('提交失败');
          return false;
        }
      });
    },
    handleAvatarSuccess(res) {
      this.form.avatarUrl = res;
    },
  },
};
</script>

<style scoped>
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
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 130px;
  height: 130px;
  display: block;
}
</style>