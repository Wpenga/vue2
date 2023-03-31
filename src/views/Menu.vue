<template>
<div>
  <!--搜索-->
  <div style="padding: 10px 0">
    <el-input style="width: 200px" placeholder="请输入名称"  suffix-icon="el-icon-user" v-model="name" clearable @clear="load"></el-input>
<!--    <el-input style="width: 200px" placeholder="请输入学号"  suffix-icon="el-icon-search" class="ml-5" v-model="id"></el-input>-->
<!--    <el-input style="width: 200px" placeholder="请输入地址"  suffix-icon="el-icon-position" class="ml-5" v-model="address"></el-input>-->
    <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
    <el-button class="ml-5" type="warning" @click="reset">重置</el-button>

  </div>

  <div style="margin:10px 0">
    <el-button class="ml-5" type="primary" @click="handleAdd(8)">新增<i class="el-icon-circle-plus-outline"></i> </el-button>
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
  </div>

  <el-table
      row-key="id"
      default-expand-all
      :data="tableData" stripe border :header-cell-class-name="headerBg" @selection-change="handleSelectionChange">
    <!--多选框-->
    <el-table-column
        type="selection"
        width="55">
    </el-table-column>
    <el-table-column prop="id" label="ID" width="140"></el-table-column>

    <el-table-column prop="name" label="名称" width="120"></el-table-column>
    <el-table-column prop="path" label="路径" > </el-table-column>
    <el-table-column prop="icon" label="图标" > </el-table-column>
    <el-table-column prop="description" label="描述" > </el-table-column>

    <el-table-column label="操作" width="300" align="center">
      <template slot-scope="scope">
        <el-button
            type="primary"
            size="mini"
            @click="handleAdd(scope.row.id)" v-if="!scope.row.pid && !scope.row.path">新增子菜单<i class="el-icon-plus"></i></el-button>
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

<!--列表内容-->
  <el-dialog title="菜单管理" :visible.sync="dialogFormVisible" width="30%">
    <el-form label-width="80px">
      <el-form-item label="名称"> <el-input v-model="form.name" autocomplete="off"></el-input></el-form-item>
      <el-form-item label="路径"> <el-input v-model="form.path" autocomplete="off"></el-input></el-form-item>
      <el-form-item label="图标">
        <el-select clearable v-model="form.icon" placeholder="请选择" style="width: 100%">
          <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述"> <el-input v-model="form.description" autocomplete="off"></el-input></el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: "Menu",
  data() {

    return {
      tableData: [],
      total:0,
      pageNum:1,
      pageSize:5,
      id:'',
      name:'',
      path:'',
      icon:'',
      description:'',
      form:{},
      dialogFormVisible:false,
      multipleSelection:[],
      headerBg:'headerBg',
      options:[]
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
      this.request.get("/menu",{
        params:{
          "name":this.name
        }
      }).then(res => {
        this.tableData = res.data
      })
      // console.log("请求数据")
    },
    //重置
    reset(){
      this.name='',
      this.load();
    },
    //点击新增
    handleAdd(pid){
      this.dialogFormVisible=true
      this.form={}
      if(pid){
        this.form.pid = pid
      }
    },
    //增加数据
    save(){
      this.request.post("http://localhost:8090/menu",this.form).then(res=>{
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
      this.form=JSON.parse(JSON.stringify(row))
      //获取图标数据
      this.request.get("/menu/icons").then(res => {
        this.options = res.data
      })
    },
    //删操作
    handleDelete(row) {
      // this.dialogFormVisible=true
      this.request.delete("http://localhost:8090/menu/"+row.id).then(res=>{
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
      this.request.post("/menu/del/batch",ids).then(res=>{
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
      // this.request("/menu/export")
      window.open("http://localhost:8090/menu/export")
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