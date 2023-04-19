<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="学号" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入学号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="nickname">
        <el-input
          v-model="queryParams.nickname"
          placeholder="请输入姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8" style="padding: 10px 0">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          >编辑</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >删除</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="LeaveList"
      stripe
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="请假ID" align="center" prop="leaveId" />
      <el-table-column label="学号" align="center" prop="username" />
      <el-table-column label="申请人" align="center" prop="nickname" />
      <el-table-column label="联系方式" align="center" prop="phone" />
      <!-- <el-table-column label="公告类型" align="center" prop="LeaveType" /> -->
      <el-table-column label="请假原因" align="center" prop="reason" />
      <el-table-column prop="startTime" label="请假时间" align="center" > 
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" align="center" > 
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间" align="center" > 
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applyTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="状态" align="center" prop="status" /> -->
      <el-table-column prop="status" label="审批状态" align="center" >
        <template slot-scope="scope">
          <!-- <el-button )">{ -->
          <!-- <el-tag :type="renderStatus(scope.row.status).type" >{{renderStatus(scope.row.status).label}}</el-tag> -->
          <el-tag :type="renderStatus(scope.row).type">{{
            renderStatus(scope.row).label
          }}</el-tag>
        </template>
      </el-table-column>
      
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="approval(scope.row,true)"
            :disabled="scope.row.status == 1"
            >批准</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-close"
            @click="approval(scope.row,false)"
            :disabled="scope.row.status == 2"
            >驳回</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  
  </div>
</template>

<script>
import {
  listLeave,
  getLeave,
  delLeave,
  addLeave,
  updateLeave,
} from "@/api/teacher/leave";

export default {
  name: "Leave",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 通知公告表格数据
      LeaveList: [],
      // 弹出层标题
      title: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        LeaveTitle: null,
        LeaveType: null,
        LeaveContent: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        LeaveTitle: [
          { required: true, message: "公告标题不能为空", trigger: "blur" },
        ],
        LeaveType: [
          { required: true, message: "公告类型不能为空", trigger: "change" },
        ],
      },
      dicts: [
        { value: '1', label: "正常"},
        { value: '0', label: "关闭"},
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
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
    /** 查询通知公告列表 */
    getList() {
      this.loading = false;
      
      listLeave(this.queryParams).then((res) => {
        // console.log(res.data.records);
        this.LeaveList = res.data.records.filter(record => record.status !== -1);;
        this.total = res.data.total;
        // this.LeaveList = response.rows;
        // this.total = response.total;
        this.loading = false;
      });
    },
    //审批
    approval(row,bool){
      row.status = bool ? 1 : 2;
      const msg = bool ? '同意请假' : '驳回请假';
      updateLeave(row).then(() => {
        this.$modal[bool ? 'msgSuccess' : 'msgWarning'](msg);
        this.getList();
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        leaveId: null,
        LeaveTitle: null,
        LeaveType: null,
        LeaveContent: null,
        status: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        // remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.leaveId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加通知公告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const leaveId = row.leaveId || this.ids;
      getLeave(leaveId).then((response) => {
        this.form = response.data;
        // this.form.status = this.dicts[0].value
        console.log('测试'+this.form.status);
        this.open = true;
        this.title = "修改通知公告";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.leaveId != null) {
            updateLeave(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.createBy = this.$store.state.nickname;
            addLeave(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row);
      const leaveIds=  row.leaveId ? [row.leaveId] : this.ids
      // const leaveIds = row.leaveId || this.ids;
      this.$modal
        .confirm('是否确认删除通知公告编号为"' + leaveIds + '"的数据项？')
        .then(function () {
          return delLeave(leaveIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    }
    
  },
};
</script>
