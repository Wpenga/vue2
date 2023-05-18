<template>
  <div>
    <el-button
      type="primary"
      @click="addButton"
      class="add"
      icon="el-icon-plus"
      >添加</el-button
    >
    <!-- 表格 -->
    <el-table :data="getLeaveData" border style="width: 100%">
      <!-- <el-table-column prop="username" label="学号" width="180"> -->
      <!-- </el-table-column> -->
      <!-- <el-table-column prop="nickname" label="姓名" width="180"> -->
      <!-- <el-table-column prop="nickname" label="姓名" width="180"></el-table-column> -->
      <!-- </el-table-column> -->
      <el-table-column prop="type" label="请假类型" width="100">
        <template slot-scope="scope">
          <el-tag :type="tagType(scope.row.type)">{{scope.row.type}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="详细原因"> </el-table-column>
      
      <el-table-column prop="startTime" label="请假时间"> 
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间"> 
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间"> 
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applyTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="审批状态">
        <template slot-scope="scope">
          <el-tag :type="renderStatus(scope.row).type">{{
            renderStatus(scope.row).label
          }}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="classes" label="班级"> </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            :disabled="scope.row.status != 0 && scope.row.status !=-1"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleCancel(scope.row)"
           :disabled="scope.row.status != 0"
            >撤回</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 请假表单 -->
    <el-dialog title="请假单" :visible.sync="dialogVisible" width="50%">
      <span>
        <!-- 请假单里的信息 -->
        <el-form ref="form" :rules="rules" :model="form" label-width="80px">
          <el-form-item label="请假类型" prop="type">
          <el-select clearable v-model="form.type" placeholder="请选择" style="width:15%">
              <el-option v-for="item in options" :key="item" :label="item" :value="item">
              </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="详细原因" prop="reason" style="width:80%">
            <el-input 
              v-model="form.reason"
              type="textarea"
              :rows="2"
            ></el-input>
          </el-form-item>
          <el-form-item label="时间范围" prop="Time">
            <el-col :span="11">
              <el-date-picker
              unlink-panels
              v-model="Time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              format="yyyy 年 MM 月 dd 日"
              >
            </el-date-picker>
            </el-col>
          </el-form-item>
        </el-form>
      </span>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getmyLeave, setLeave ,getmyLeaveById,updateLeave} from "@/api/student";
// import { STATUS_ENUM } from "./constant";
export default {
  data() {
     var checkTime = (rule, value, callback) => {
      if (this.Time.length == 0) {
        callback(new Error("请选择时间"));
      }else{
          return callback();
      }
    };
    return {
      tag:['info','primary','warning'],
      // 获取个人请假表
      getLeaveData: [],
      dialogVisible: false,
      Time:'',
      // 请假单数据
      form: {
        username:JSON.parse(localStorage.getItem("user")).username,
        reason: null,
        startTime: null,
        endTime: null,
        status: null,
      },
      // pickerOptions: {
      //   disabledDate(time) {
          
      //     const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
      //     const now = new Date();
      //     const yesterday = new Date(now.getTime() - oneDay);
      //     return time.getTime() < yesterday;
      //   }
     
      // }},
      // pickerOptions: this.disabledDate, // 修改这里
  //     {
  //       disabledDate(time) {
  //   const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
  //   const now = new Date();
  //   const yesterday = new Date(now.getTime() - oneDay);
  //   const leaveList = this.getLeaveData; // 获取所有请假时间段
  //   for (let i = 0; i < leaveList.length; i++) {
  //     const start = new Date(leaveList[i].startTime); // 转换成日期类型
  //     const end = new Date(leaveList[i].endTime);
  //     if (time >= start && time <= end) { // 判断当前日期是否在某个请假时间段内
  //       return true; // 如果是则为禁用状态
  //     }
  //   }
  //   return time.getTime() < yesterday; // 否则再判断是否小于昨天
  // }
    
  // },
      options:['事假','病假','其他'],
      rules: {
        reason: [{ required: true, message: "请填写原因", trigger: "blur" }],
        Time: [{ required: true, validator:checkTime, trigger: "blur" }],
      }
    };
  },
  created() {
    this.getleaveform();
  },
  computed: {
    pickerOptions() {
      return {
        disabledDate: this.disabledDate // 修改这里
      }
    }
  },
  methods: {
    disabledDate(time) {
      const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
      const now = new Date();
      const yesterday = new Date(now.getTime() - oneDay);
      const leaveList = this.getLeaveData; // 修改为 this.leaveData

      for (let i = 0; i < leaveList.length; i++) {
        const start = new Date(leaveList[i].startTime);
        const end = new Date(leaveList[i].endTime);

        if (time >= start && time <= end) {
          return true;
        }
      }

      return time.getTime() < yesterday;
    },
    tagType(type){
      return type === "事假" ? 'primary' : type === "病假" ? 'warning' : 'info';
    },
    renderStatus(row) {
      const { status: status } = row || {};
      const STATUS_ENUM = {
        NoAllow: {
          value: "0",
          label: "未批准",
          type: "info",
        },
        Allow: {
          value: "1",
          label: "已批准",
          type: "success",
        },
        Opposition: {
          value: "2",
          label: "已驳回",
          type: "danger",
        },
        Cancel: {
          value: "-1",
          label: "已撤销",
          type: "warning",
        },
      };
      let tag = {};
      Object.values(STATUS_ENUM).map((item) => {
        if (item.value == status) tag = item;
      });
      return tag;
    },
    resetForm(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields();
      }
    },  
    // 获取个人请假表
    async getleaveform() {
      const res = await getmyLeave(JSON.parse(localStorage.getItem("user")).username);
      this.getLeaveData = res.data;
      console.log(this.getLeaveData);
    },
    // 添加按钮
    addButton(){
      this.form = {
        username:JSON.parse(localStorage.getItem("user")).username,
        reason: null,
        startTime: null,
        endTime: null,
        status: null,
      },
      this.Time = {}
      this.resetForm('form')
      this.dialogVisible = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const leaveId = row.leaveId;
      getmyLeaveById(leaveId).then((res) => {
        this.form = res.data;
        this.Time = [res.data.startTime,res.data.endTime ]
        // this.form.status = this.dicts[0].value
        this.dialogVisible = true;
        this.title = "修改请假信息";
      });
    },
    //撤回申请
    handleCancel(row){
      console.log(row.status);
      row.status = -1;
      updateLeave(row).then(() => {
        this.$modal.notifySuccess("撤回成功,若需重新提交修改即可");
      });
    },
    // 提交请假表
    async submit(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          [this.form.startTime,this.form.endTime ]= this.Time
          // const { reason, grade, college, date1, date2 } = this.form;
          this.form.startTime = this.parseTime(this.form.startTime, "{y}-{m}-{d} {h}:{i}:{s}");
          this.form.endTime = this.parseTime(this.form.endTime,"{y}-{m}-{d} {h}:{i}:{s}");
          this.form.status=0
          await setLeave(this.form).then(res =>{
              if(res.code ==="200"){
                this.$message.success("提交成功")
              }else{
                this.$message.error("提交失败")
              }
          }).catch(err =>{
            this.$message.error("系统错误，稍候重试");
          })
          this.getleaveform();
          this.dialogVisible = false;
        }
      })
    }
  },
};
</script>

<style lang="less" scoped>
.add {
  float: right;
  margin: 0 20px 10px 0;
}

.el-table {
  top: 0px;
}
</style>