<template>
  <div class="app-container">
    <el-form ref="form"  :model="form" :rules="rules" label-width="130px" v-loading="loading">
      <el-form-item label="姓名" >
        <el-input v-model="form.nickname" :disabled="true"/>
      </el-form-item>
      <el-form-item label="学号">
        <el-input v-model="form.username" :disabled="true"/>
      </el-form-item>
      <el-form-item label="当前所在地区" prop="address" >
        <el-cascader
          placeholder="可搜索"
          :options="options"
          v-model="addressSelections"
          filterable
          clearable
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="是否发烧" prop="isFever" required>
        <el-switch v-model="form.isFever" />
      </el-form-item>
      <el-form-item label="经过高危地区" prop="goRisk" required>
        <el-switch v-model="form.goRisk" />
      </el-form-item>
    
      <el-form-item label="疫苗针数" prop = "vaccineCount" required>
        <el-radio-group v-model="form.vaccineCount">
          <el-radio label="0">0针</el-radio>
          <el-radio label="1">1针</el-radio>
          <el-radio label="2">2针</el-radio>
          <el-radio label="3">3针</el-radio>
        </el-radio-group>
      </el-form-item>
     
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
       
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { regionData} from 'element-china-area-data';
import {getCodeAddress, getTextAderess} from "@/utils/getAddress";
import {sethealth, gethealth} from '@/api/student';
// import nowTime from  "@/utils/getTime"; 

export default {
  data() {
    var checkAddress = (rule, value, callback) => {
      if (this.addressSelections.length == 0) {
        callback(new Error("请选择地址"));
      }else{
          return callback();
      }
    };
    return {
      // 遮罩层
      loading: false,
      // 打卡与否
      sign: false,
      form: {
        nickname: "",
        username: "",
        address:'',
        isFever:'',
        goRisk:'',
        date:""
      },
      options: this.regionData,
      addressSelections:[],
      rules: {
        address: [{ required: true, validator: checkAddress,message: "请选择地址", trigger: "blur" }],
        // isFever: [{ required: true,trigger: "blur"}],
        // goRisk: [{ required: true,trigger: "blur"}],
        // vaccineCount: [{ required: true,trigger: "blur"}],
      },
    };
  },
  created(){
    //后台获取User数据
    this.form.username = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).username:""
    this.gethealth();
  
  },
  methods: {
    // 获取表单信息
    async gethealth() {
      const  res  = await gethealth(JSON.parse(localStorage.getItem("user")).username);
      if(res.code === "200"){
        this.form = res.data
        this.form.vaccineCount=res.data.vaccineCount.toString()
        //地址映射,获得区域码 数组
        this.addressSelections = res.data.address ? getCodeAddress(res.data.address): '';
      }else{
        this.$message.warning("未打卡，请及时打卡")
      }
    },

    // 提交打卡信息
    onSubmit(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          const nowdate = this.parseTime(new Date(),'{y}-{m}-{d}')
          const olddate = this.parseTime(this.form.punchDate,'{y}-{m}-{d}')
          // console.log('当前时间：',nowdate);
          // console.log('数据库转化时间：',olddate);
          // console.log('数据库时间：',this.form.punchDate);
          if(olddate === nowdate){
              this.sign = true
          }
          if(this.sign){
            this.$modal.notifyWarning("今日已打卡，无需再次提交！")
          } else{
            this.loading = true;
            //获取中文地址
            this.form.address = getTextAderess(this.addressSelections);
            this.form.punchDate = this.parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}')
            // console.log('提交时间',this.form.punchDate);
            delete this.form.id
            await sethealth(this.form).then(res=>{
              if(res.code === '200'){
                  this.loading = false;
                  this.$message.success("提交成功");
              }else{
                  this.$modal.notifyWarning(res.msg)
              }
            });
            
          }
        }
      })
    },
    // onCancel() {
    //   this.$message({
    //     message: "重置",
    //     type: "warning",
    //   });
    // },
  },
};
</script>

<style scoped>
.app-container {
  padding: 0 770px 0 30px;
}
.el-form-item__label[for="goRisk"] {
  width: 140px;
}
.line {
  text-align: center;
}
</style>