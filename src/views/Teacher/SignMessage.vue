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
     <el-form-item label="学生学号" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入学号"
          clearable
          @keyup.enter.native="getList"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="nickname">
        <el-input
          v-model="queryParams.nickname"
          placeholder="请输入姓名"
          clearable
          @clear="getList"
          @keyup.enter.native="getList"
        />
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入用户邮箱"
          clearable
          @keyup.enter.native="getList"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号码"
          clearable
          @keyup.enter.native="getList"
        />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入地址"
          clearable
          @keyup.enter.native="getList"
        />
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 多功能按钮 -->
    <el-row :gutter="10" class="mb8" style="padding: 10px 0">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          
        >编辑</el-button> -->
      <!-- </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-upload
          :action="'http://'+ serverIp+':8090/user/import'"
          :show-file-list="false" accept=".xlsx"
          :on-success="handleExcelImportSuccess"
          style="display: inline-block"
        ><el-button
          type="info"
          plain
          icon="el-icon-download"
          size="mini"
        >导入</el-button></el-upload>
      </el-col>
</el-row>
<!-- 列表 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学号" align="center" prop="username" width="140"/>
      <el-table-column label="姓名" align="center" prop="nickname" width="100"/>
      <el-table-column label="性别" align="center" prop="sex" width="100"/>
      
      <el-table-column label="联系方式" align="center" prop="phone" width="120" />
      <el-table-column label="邮箱" align="center" prop="email" width="120"/>
      <el-table-column
        align="center" 
        prop="issign"
        label="签到状态"
        width="100"
        :filters="[{ text: '已签到', value: true }, { text: '未签到', value: false }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
            <el-tag
                :type="scope.row.issign === true ? 'success' : 'danger'"
                disable-transitions>{{ scope.row.issign ? '已签到' : '未签到' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center" 
        prop="isFever"
        label="发烧与否"
        width="100"
        :filters="[{ text: '发烧', value: true }, { text: '未发烧', value: false }]"
        :filter-method="filterTagisFever"
        filter-placement="bottom-end">
        <template slot-scope="scope">
            <el-tag
                :type="scope.row.isFever === true ? 'warning' : 'info'"
                disable-transitions>{{ scope.row.isFever ? '发烧' : '未发烧' }}</el-tag>
        </template>
      </el-table-column>
    <el-table-column prop="address" label="地址" align="center"  width="240"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-bell"
            @click="handleNotice(scope.row)"
            :disabled="scope.row.issign"
            >提醒</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
<!-- 分页插件 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改通知公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学号" prop="username">
          <el-input v-model="form.username" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="姓名" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio :label="'男'">男</el-radio>
            <el-radio :label="'女'">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="性别" prop="sex">
          <el-input v-model="form.nickname" placeholder="请输入性别" />
        </el-form-item> -->
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <!-- <el-col :span="24"> -->
        <!-- <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dicts"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item> -->
        <!-- </el-col> -->
        <!-- <el-form-item label="公告内容"> -->
          <!-- <el-input v-model="form.noticeContent" :min-height="192" type="textarea" :rows="2"/> -->
          <!-- <editor v-model="form.noticeContent" :min-height="192" /> -->
        <!-- </el-form-item> -->
        <!-- <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, getUser, delUsers, addUser, updateUser } from "@/api/admin";
import {serverIp} from "../../../public/config";
import {addNotice} from "@/api/teacher/notice";
export default {
  name: "Notice",
  data() {
    return {
      serverIp:serverIp,
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
      tableData: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams:{
          'role':'ROLE_STUDENT', //学生
          "pageNum":1,
          "pageSize":10,
          "username":null,
          "nickname":null,
          "address":null,
          "phone":null,
          "email":null,
      },
    //   queryParams: {
        
    //     pageNum: 1,
    //     pageSize: 10,
    //     noticeTitle: null,
    //     noticeType: null,
    //     noticeContent: null,
    //     status: null,
    //   },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        noticeTitle: [
          { required: true, message: "公告标题不能为空", trigger: "blur" },
        ],
        noticeType: [
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
    resetForm(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields();
      }
    },
    
    /** 查询学生列表 */
    getList(){
      this.loading = true ;
      listUser(this.queryParams).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.getmsg(res.data.records)
        this.loading = false;
        
      })

      this.request.get("/role").then(res=>{
        this.roles = res.data
      })
    },
    getmsg(data){
        const nowdate = this.parseTime(new Date(),'{y}-{m}-{d}')
        data.forEach(item => {
            const olddate = this.parseTime(item.punchDate,'{y}-{m}-{d}')
            item.issign = olddate === nowdate
        })
    },
    // getList() {
    //   this.loading = true;
    //   listNotice(this.queryParams).then((res) => {
    //     this.tableData = res.data.records;
    //     this.total = res.data.total;
    //     // this.tableData = response.rows;
    //     // this.total = response.total;
    //     this.loading = false;
    //   });
    // },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        
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
      this.ids = selection.map((item) => item.noticeId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加通知公告";
    },
    /** 通知按钮操作 */
    handleNotice(row) {
      this.reset();
      const noticeId = row.noticeId || this.ids;
      const createBy = JSON.parse(localStorage.getItem("user")).username
      const noticeForm={
        noticeTitle: "签到提醒",
        noticeType: '0',
        noticeContent: `${createBy}提醒你打卡啦！`,
        status: '1',
        noticeType:'1',
        createBy,
        receiver:row.username
      }
      addNotice(noticeForm).then((response) => {
          this.$modal.msgSuccess("发送通知成功！");
          // this.open = false;
          // this.getList();
      });
      // getUser(noticeId).then((response) => {
      //   this.form = response.data;
      //   this.open = true;
      //   this.title = "修改通知公告";
      // });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          //提交按钮
          addUser(this.form).then(res=>{
            if(res.code ==="200"){
              this.$message.success("添加成功")
              this.open=false
              this.getList()
            }else{
              this.$message.error("保存失败")
            }

          })
          
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row);
      const noticeIds=  row.noticeId ? [row.noticeId] : this.ids
      // const noticeIds = row.noticeId || this.ids;
      this.$modal
        .confirm('是否确认删除通知公告编号为"' + noticeIds + '"的数据项？')
        .then(function () {
          return delUsers(noticeIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    //筛选 签到信息
    filterTag(value, row) {
      return row.issign === value;
    },
    //筛选 发烧情况
    filterTagisFever(value, row) {
      return row.isFever === value;
    },
    //导出表格
    handleExport(){
      // this.request("/user/export")
      this.$modal.confirm('确认到导出数据？').then(function() {
        return window.open(`http://${serverIp}:8090/excel/notfever`);
      }).then((res) => {
            this.$modal.notifySuccess("导出成功")
            // this.$message.error("删除失败");
          
      }).catch(() => {});
      
    },
    //导入表格
    handleExcelImportSuccess(){
      this.$message.success("导入成功")
      this.getList()
    }
    
  },
};
</script>
