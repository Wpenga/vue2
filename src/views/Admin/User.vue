<template>
<div>
<el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
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
        <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
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
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleEdit"
          
        >编辑</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport(scope.row)"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-upload
          :action="uploadFileUrl"
          :headers="headers"
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
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

  <el-table :data="tableData" v-loading="loading" stripe border :header-cell-class-name="headerBg" @selection-change="handleSelectionChange">
    <!--多选框-->
    <el-table-column
        type="selection"
        width="55">
    </el-table-column>
    <el-table-column prop="username" label="学号" width="140"></el-table-column>
    <el-table-column prop="nickname" label="姓名" width="100"></el-table-column>
    <el-table-column prop="sex" label="性别" width="62"></el-table-column>
    <el-table-column prop="role" label="角色"  width="120">
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.role === 'ROLE_ADMIN'">管理员</el-tag>
          <el-tag type="warning" v-if="scope.row.role === 'ROLE_TEACHER'">老师</el-tag>
          <el-tag type="success" v-if="scope.row.role === 'ROLE_STUDENT'">学生</el-tag>
        </template>
    </el-table-column>
    <el-table-column prop="phone" label="联系方式" width="120"></el-table-column>
    <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
    

    <el-table-column prop="address" label="地址" width="256">
    </el-table-column>

    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)">编辑</el-button>

        <!-- <el-popconfirm
            class="ml-5"
            confirm-button-text='好的'
            cancel-button-text='不用了'
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @confirm="handleDelete(scope.row)"
        > -->
          <el-button
              slot="reference"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
          >删除</el-button>
        <!-- </el-popconfirm> -->
      </template>
    </el-table-column>

  </el-table>
  <!-- 分页 -->
  <div style="padding: 10px 0">
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="form.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </div>
<!--窗口内容-->
  <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="30%">
    <el-form label-width="80px" :rules="rules" ref="form" :model="form">
      <el-form-item label="姓名">
        <el-input v-model="form.nickname" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
          <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.flag">
            <!-- <i :class="item.value" /> {{ item.name }}{{item.value}} -->
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学号" prop="username">
        <el-input v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="form.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address" autocomplete="off" type="textarea" :rows="2"></el-input>
      </el-form-item>
      <!-- <el-form-item label="签到状态">
        <el-select v-model="form.sign" placeholder="请选择签到状态">
          <el-option label="签到" value="签到"></el-option>
          <el-option label="未签到" value="未签到"></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
// import { MessageBox } from 'element-ui';
import {serverIp} from "../../../public/config";
import { listUser, getUser, delUsers, addUser, updateUser } from "@/api/admin";
import { getToken } from "@/utils/auth";
const baseURL = process.env.VUE_APP_BASE_API
export default {
  name: "User",
  data() {

    return {
      uploadFileUrl:baseURL+"/user/import",
      headers: { 'token':  getToken() },  //请求头token校验
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
      serverIp:serverIp,
      tableData: [],
      total:0,
      queryParams:{
          "pageNum":1,
          "pageSize":10,
          "username":null,
          "nickname":null,
          "address":null,
          "phone":null,
          "email":null,
      },
      pageNum:1,
      pageSize:5,
      form:{
        id:'',
        username:'',
        address:'',
        nickname:'',
        sign:'',
      },
       rules: {
        username: [
          { required: true, message: "学号不能为空", trigger: "blur" },
        ]},
      dialogFormVisible:false,
      headerBg:'headerBg',
      roles:[],
      selection:''
    }
  },
  //请求分页查询数据
  created(){
    //请求数据
    this.getList();
  },

  methods:{
    resetForm(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields();
      }
    },
    //点击缩进
    collapse(){
      this.isCollapse = !this.isCollapse
      this.collapseBtnClass='el-icon-s-unfold'
      if(this.isCollapse){ //缩进
        this.sideWidth = 64
        this.logoTextShow = false
      }else{
        this.sideWidth = 200  //展开
        this.collapseBtnClass='el-icon-s-fold'
        this.logoTextShow = true
      }
    },
    //获取全部数据
    getList(){
      this.loading = true ;
      listUser(this.queryParams).then(res => {
     
        this.tableData = res.data.records
        this.total = res.data.total
        this.loading = false;
      })

      this.request.get("/role").then(res=>{
        this.roles = res.data
      })
    },
    //重置
    reset(){
      this.username='',
      this.address="",
      this.queryParams={
        "pageNum":1,
        "pageSize":10
      }
      this.getList();
    },
    //新增按钮
    handleAdd(){
      this.resetForm("form");
      this.form={}
      this.dialogFormVisible=true
    },
    //提交按钮
    submitForm(){
      this.$refs["form"].validate((valid) => {
        if (valid) {
        addUser(this.form).then(res=>{
        // this.request.post("/user",this.form).then(res=>{
          if(res.code ==="200"){
            this.$message.success("保存成功")
            this.dialogFormVisible=false
            this.getList()
          }else{
            this.$message.error("保存失败")
          }

        })
      }
    })
    },
    // 修改按钮操作
    handleEdit(row) {
      this.resetForm("form");
      const data =  row.id ? row : this.selection[0]
      this.form = JSON.parse(JSON.stringify(data))
      this.dialogFormVisible = true
    },
    //删操作
    // handleDelete(row) {
    //   // this.dialogFormVisible=true
    //   this.request.delete("/user/"+row.id).then(res=>{
    //     if(res.code ==="200"){
    //       this.$message.success("删除成功")
    //       this.getList()
    //     }else{
    //       this.$message.error("删除失败")
    //     }
    //     // console.log(index, row)
    //   })
    // },
    //多选
    handleSelectionChange(selection){
      this.selection = selection
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    //批量删除
    handleDelete(row){
      // console.log(row);
      const userIds =  row.id ? row.username : this.selection.map(item => item.username)
      const Ids =  row.id ? [row.id] : this.ids
      // const data =  row.id ? row : this.selection[0]
       this.$modal.confirm('是否确认删除学号为"' + userIds + '"的数据项？').then(function() {
        return delUsers(Ids);
      }).then((res) => {
          if(res.code === "200"){
            this.$modal.notifySuccess("删除成功")
            this.getList()
          }else{
            this.$message.error("删除失败");
          }
      }).catch(() => {});
        
      // });
      
      // let ids = this.ids
      // this.multipleSelection.map(v => v.id)  //[1,2,3]
      // this.request.post("/user/del/batch",userIds).then(res=>{
      //   if(res.code === "200"){
      //     this.$message.success("删除成功")
      //     this.getList()
      //   }else{
      //     this.$message.error("删除失败")
      //   }
      // })
    },
    //pageSize改变时触发
    handleSizeChange(pageSize){
      this.pageSize=pageSize
      this.queryParams.pageSize = pageSize
      this.getList()
    },
    //页面变化
    handleCurrentChange(pageNum){
      this.pageNum=pageNum
      this.queryParams.pageNum = pageNum
      this.getList()
    },

    //筛选
    filterTag(value, row) {
      return row.sign === value;
    },
    //导出表格
    handleExport(row){
      // this.request("/user/export")
      // window.open(`http://${serverIp}:8090/user/export`)
      // window.open(baseURL+`/user/export`)
      this.$download.name(row.url, row.name)
    },
    //导入表格
    handleExcelImportSuccess(){
      this.$message.success("导入成功")
      this.getList()
    }
  }
}
</script>

<style>
/*表头颜色*/
.headerBg{
  background: #eee!important;
}
</style>