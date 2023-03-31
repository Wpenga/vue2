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
  </div>

  <el-table :data="tableData" stripe border :header-cell-class-name="headerBg" @selection-change="handleSelectionChange">
    <!--多选框-->
    <el-table-column
        type="selection"
        width="55">
    </el-table-column>
    <el-table-column prop="id" label="ID" width="140">
    </el-table-column>
    <el-table-column prop="name" label="名称" width="120">
    </el-table-column>
    <el-table-column prop="description" label="描述" >
    </el-table-column>

    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
            type="info"
            size="mini"
            @click="selectMenu(scope.row.id)">分配菜单<i class="el-icon-menu"></i></el-button>
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
  <el-dialog title="角色信息" :visible.sync="dialogFormVisible" width="30%">
    <el-form label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" autocomplete="off"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog title="菜单分配" :visible.sync="menuDialogVis" width="30%" style="padding: 0 50px">
    <el-tree
        ref="tree"
        :props="props"
        node-key="id"
        :default-expanded-keys="expends"
        :default-checked-keys="checks"
        :data="menuData"
        show-checkbox>
      <!--图标-->
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span><i :class="data.icon"/>{{ data.name }}</span>
      </span>
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button @click="menuDialogVis = false">取 消</el-button>
      <el-button type="primary" @click="saveRoleMenu">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: "Role",
  data() {

    return {
      tableData: [],
      total:0,
      pageNum:1,
      pageSize:5,
      id:'',
      name:'',
      description:'',
      form:{},
      dialogFormVisible:false,
      menuDialogVis:false,
      multipleSelection:[],
      headerBg:'headerBg',
      menuData:[
      //     {
      //   id:1,
      //   label: '主页',
      //   children: []
      //   },
      //   {
      //   id: 2,
      //   label: '系统管理',
      //   children: [{
      //       id: 3,
      //       label: '用户管理',
      //       children: []
      //     },
      //     {
      //       id: 4,
      //       label: '角色管理',
      //       children: []
      //     },
      //     {
      //       id: 5,
      //       label: '文件管理',
      //       children: []
      //     }]
      // }
      ],
      props: {
        label: 'name'
      },
      expends:[],
      checks:[],
      roleId:0
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
      this.request.get("/role/page",{
        params:{
          "pageNum":this.pageNum,
          "pageSize":this.pageSize,
          "name":this.name,
          // "description":this.description
        }
      }).then(res => {
        // console.log(res)
        this.tableData = res.data.records
        this.total = res.data.total
      })
      // console.log("请求数据")

    },
    //重置
    reset(){
      this.name='',
      this.load();
    },
    //新增按钮
    handleAdd(){
      this.dialogFormVisible=true
      this.form={}
    },
    // 改操作
    handleEdit(row) {
      this.dialogFormVisible=true
      this.form=row
    },
    //删操作
    handleDelete(row) {
      // this.dialogFormVisible=true
      this.request.delete("http://localhost:8090/role/"+row.id).then(res=>{
        if(res.code ==="200"){
          this.$message.success("删除成功")
          this.load()
        }else{
          this.$message.error("删除失败")
        }
      })
    },
    //多选
    handleSelectionChange(val){
      this.multipleSelection=val
    },
    //批量删除
    delBatch(){
      let ids = this.multipleSelection.map(v => v.id)  //[1,2,3]
      this.request.post("/role/del/batch",ids).then(res=>{
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
    //增加数据
    save(){
      this.request.post("http://localhost:8090/role",this.form).then(res=>{
        if(res.code ==="200"){
          this.$message.success("保存成功")
          this.dialogFormVisible=false
          this.load()
        }else{
          this.$message.error("保存失败")
        }

      })
    },
    //修改菜单 保存
    saveRoleMenu(){
      this.request.post("/role/roleMenu/" + this.roleId, this.$refs.tree.getCheckedKeys()).then(res=>{
        if(res.code ==="200"){
          this.$message.success("保存成功")
          this.menuDialogVis=false
        }else {
          this.$message.error(res.msg)
        }
      })
    },
    //菜单分配
    selectMenu(roleId){
      this.menuDialogVis = true
      this.roleId = roleId
      //菜单数据
      this.request.get("/menu",{
        params:{
          "name":this.name
        }
      }).then(res => {
        this.menuData = res.data
        //后台菜单数据转化成id数组
        this.expends = this.menuData.map(v => v.id)
      })
      //获取已选择的菜单数组
      this.request.get("/role/roleMenu/" + this.roleId).then(res=>{
        this.checks = res.data
      })
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