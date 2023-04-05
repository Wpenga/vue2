<template>
<div>

  <!--搜索-->
  <div style="padding: 10px 0">
    <el-input style="width: 200px" placeholder="请输入姓名"  suffix-icon="el-icon-user" v-model="username" clearable @clear="load"></el-input>
    <el-input style="width: 200px" placeholder="请输入学号"  suffix-icon="el-icon-search" class="ml-5" v-model="id"></el-input>
    <el-input style="width: 200px" placeholder="请输入地址"  suffix-icon="el-icon-position" class="ml-5" v-model="address"></el-input>
    <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
    <el-button class="ml-5" type="warning" @click="reset">重置</el-button>

  </div>

  <div style="margin:10px 0">
    <el-button class="ml-5" type="primary" @click="handleAdd">新增<i class="el-icon-circle-plus-outline"></i> </el-button>
    <el-popconfirm
        class="ml-5"
        confirm-button-text='好的'
        cancel-button-text='不用了'
        icon="el-icon-info"
        icon-color="red"
        title="您确定批量删除这些数据吗？"
        @confirm="delBatch"
    >
      <el-button class="ml-5" type="danger" slot="reference">批量删除<i class="el-icon-remove-outline"></i> </el-button>
    </el-popconfirm>
    <el-upload :action="'http://'+ serverIp+':8090/user/import'"
               :show-file-list="false" accept=".xlsx"
               :on-success="handleExcelImportSuccess"
               style="display: inline-block">
    <el-button type="primary" class="ml-5">导入<i class="el-icon-bottom"></i> </el-button>
    </el-upload>

    <el-button  type="primary" @click="exp" class="ml-5">导出<i class="el-icon-top"></i> </el-button>
  </div>

  <el-table :data="tableData" stripe border :header-cell-class-name="headerBg" @selection-change="handleSelectionChange">
    <!--多选框-->
    <el-table-column
        type="selection"
        width="55">
    </el-table-column>
    <el-table-column prop="id" label="学号" width="140"></el-table-column>
    <el-table-column prop="role" label="角色" width="140"></el-table-column>
    <el-table-column prop="username" label="姓名" width="120"></el-table-column>
    <el-table-column prop="phone" label="联系方式" ></el-table-column>
    <el-table-column
        prop="sign"
        label="签到状态"
        width="100"
        :filters="[{ text: '签到', value: '签到' }, { text: '未签到', value: '未签到' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
      <template slot-scope="scope">
        <el-tag
            :type="scope.row.sign === '签到' ? 'primary' : 'success'"
            disable-transitions>{{scope.row.sign || '未签到'}}</el-tag>
      </template>
    </el-table-column>

    <el-table-column prop="address" label="地址">
    </el-table-column>

    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
            size="mini"
            @click="handleEdit(scope.row)">编辑<i class="el-icon-edit"></i></el-button>

        <el-popconfirm
            class="ml-5"
            confirm-button-text='好的'
            cancel-button-text='不用了'
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @confirm="handleDelete(scope.row)"
        >
          <el-button
              slot="reference"
              size="mini"
              type="danger"
          >删除<i class="el-icon-delete"></i></el-button>
        </el-popconfirm>
      </template>
    </el-table-column>

  </el-table>
  <div style="padding: 10px 0">
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </div>
<!--列表内容-->
  <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="30%">
    <el-form label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select clearable v-model="form.role" placeholder="请选择角色" style="width: 100%">
          <el-option v-for="item in roles" :key="item.name" :label="item.name" :value="item.flag">
            <i :class="item.value" /> {{ item.name }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学号">
        <el-input v-model="form.id" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="form.phone" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="签到状态">
        <el-select v-model="form.sign" placeholder="请选择签到状态">
          <el-option label="签到" value="签到"></el-option>
          <el-option label="未签到" value="未签到"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {serverIp} from "../../public/config";

export default {
  name: "User",
  data() {

    return {
      serverIp:serverIp,
      tableData: [],
      total:0,
      pageNum:1,
      pageSize:5,
      id:'',
      username:'',
      address:'',
      sign:'',
      form:{},
      dialogFormVisible:false,
      multipleSelection:[],
      headerBg:'headerBg',
      roles:[]
    }
  },
  //请求分页查询数据
  created(){
    //请求数据
    this.load();
  },

  methods:{
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
    load(){
      // /page?pageNum=1&pageSize=2
      this.request.get("/user/page",{
        params:{
          "pageNum":this.pageNum,
          "pageSize":this.pageSize,
          "username":this.username,
          "address":this.address
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })

      this.request.get("/role").then(res=>{
        this.roles = res.data
      })
    },
    //重置
    reset(){
      this.username='',
          this.address="",
          this.load();
    },
    //点击新增
    handleAdd(){
      this.dialogFormVisible=true
      this.form={}
    },
    //增加数据
    save(){
      this.request.post("/user",this.form).then(res=>{
        if(res.code ==="200"){
          this.$message.success("保存成功")
          this.dialogFormVisible=false
          this.load()
        }else{
          this.$message.error("保存失败")
        }

      })
    },
    // 改操作
    handleEdit(row) {
      this.dialogFormVisible=true
      this.form=row
    },
    //删操作
    handleDelete(row) {
      // this.dialogFormVisible=true
      this.request.delete("/user/"+row.id).then(res=>{
        if(res.code ==="200"){
          this.$message.success("删除成功")
          this.load()
        }else{
          this.$message.error("删除失败")
        }
        // console.log(index, row)
      })
    },
    //多选
    handleSelectionChange(val){
      this.multipleSelection=val
    },
    //批量删除
    delBatch(){
      let ids = this.multipleSelection.map(v => v.id)  //[1,2,3]
      this.request.post("/user/del/batch",ids).then(res=>{
        if(res.code === "200"){
          this.$message.success("批量删除成功")
          this.load()
        }else{
          this.$message.error("删除失败")
        }
      })
    },
    //pageSize改变时触发
    handleSizeChange(val){
      this.pageSize=val
      this.load()
    },
    //页面变化
    handleCurrentChange(val){
      this.pageNum=val
      this.load()
    },

    //筛选
    filterTag(value, row) {
      return row.sign === value;
    },
    //导出表格
    exp(){
      // this.request("/user/export")
      window.open(`http://${serverIp}:8090/user/export`)
    },
    //导入表格
    handleExcelImportSuccess(){
      this.$message.success("导入成功")
      this.load()
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