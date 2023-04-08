<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="姓名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="学号">
        <el-input v-model="form.userid" />
      </el-form-item>
      <el-form-item label="当前所在地区">
        <el-cascader
          placeholder="可搜索"
          :options="options"
          v-model="addressSelections"
          filterable
          clearable
        >
        </el-cascader>
        <!-- <el-select v-model="form.region" placeholder="please select your zone">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select> -->
      </el-form-item>
      <!-- <el-form-item label="时间">
        <el-col :span="11">
          <el-date-picker
            v-model="form.date1"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker
            v-model="form.date2"
            type="fixed-time"
            placeholder="选择时间"
            style="width: 100%"
          />
        </el-col>
      </el-form-item> -->
      <el-form-item label="是否发烧">
        <el-switch v-model="form.hot" />
      </el-form-item>
      <el-form-item label="是否经过高危地区">
        <el-switch v-model="form.gorisk" />
      </el-form-item>
      <!-- <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item> -->
      <el-form-item label="疫苗针数">
        <el-radio-group v-model="form.vaccinum">
          <el-radio label="1针" value="1" />
          <el-radio label="2针" value="2" />
          <el-radio label="3针" value="3" />
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="Activity form">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { regionData, CodeToText} from 'element-china-area-data';
import {sethealth} from '@api/student';
// import timestampToTime from  "../utils/getTime"; 
//获取时间
function timestampToTime(times) {
    let time = times[1]
    let mdy = times[0]
    mdy = mdy.split('/')
    let month = parseInt(mdy[0]);
    let day = parseInt(mdy[1]);
    let year = parseInt(mdy[2])
    return year + '-' + month + '-' + day + ' ' + time
}
export default {
  data() {
    return {
      form: {
        name: "",
        userid: "",
        region: "",
        date:"",
        date1: "", 
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      options: regionData,
      addressSelections:[],
      address:[] 
    };
  },
  methods: {
    onSubmit() { 
        let time = new Date()
        let nowTime =  timestampToTime(time.toLocaleString('en-US',{hour12: false}).split(" "))
        this.form.date = nowTime
        console.log(this.$format(new Date()))
        //使用对象解构 根据区域码获取具体的地区名
        const {0: province, 1: city, 2: town} = this.addressSelections.map(code => CodeToText[code]);
        this.address = { province, city, town };
        // console.log(this.form);
        sethealth(form)
        this.$message.success("提交成功");
    },
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning",
      });
    },
  },
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>