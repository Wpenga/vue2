<template>
  <el-menu :default-openeds="opens" style="min-height: 100%;overflow :hidden"
           background-color="rgb(48,65,86)"
           text-color="#fff"
           active-text-color="#E6A23C"
           :collapse-transition="false"
           :collapse="isCollapse"
           router
  >
    <!--图标logo-->
    <div style="height:60px;line-height: 60px;text-align:center">
      <img src="../assets/logo.png" style="width:20px;position: relative;top: 5px">
      <!--疫情防控-->
      <b style="color:white" v-show="logoTextShow">疫情防控系统</b>
    </div>
    <!--动态菜单-->
    
    <div v-for="item in menus" :key="item.id">
      
      <div v-if="item.path">
        <el-menu-item :index="item.path">
          <i :class="item.icon"></i>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </div>
      <div v-else>
        <el-submenu :index="item.id + ''">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title" v-show="logoTextShow">{{ item.name }}</span>
          </template>
          <div  v-for="subItem in item.children" :key="subItem.id">
            <el-menu-item :index="subItem.path">
              <i :class="subItem.icon"></i>
              <span slot="title">{{ subItem.name }}</span>
            </el-menu-item>
          </div>
        </el-submenu>
      </div>
    </div>
    <!-- <template> -->
<!--    <el-submenu index="0">-->
<!--    <el-menu-item index="/home">-->
<!--      <template>-->
<!--        <i class="el-icon-house"></i>-->
<!--        <span slot="title">首页</span>-->
<!--      </template>-->
<!--    </el-menu-item>-->
<!--    <el-submenu index="1">-->
<!--      <template slot="title">-->
<!--        <i class="el-icon-message"></i>-->
<!--        <span slot="title">学生信息</span>-->
<!--      </template>-->
<!--      <el-menu-item-group>-->
<!--        <el-menu-item index="1-1">签到</el-menu-item>-->
<!--        <el-menu-item index="1-2">未签到</el-menu-item>-->
<!--      </el-menu-item-group>-->
<!--    </el-submenu>-->
<!--    <el-submenu index="2">-->
<!--      <template slot="title">-->
<!--        <i class="el-icon-menu"></i>-->
<!--        <span slot="title">请假审批</span>-->
<!--      </template>-->
<!--      <el-menu-item-group>-->
<!--        <el-menu-item index="2-1">待审批</el-menu-item>-->
<!--        <el-menu-item index="2-2">已审批</el-menu-item>-->
<!--      </el-menu-item-group>-->
<!--    </el-submenu>-->
<!--    <el-submenu index="3">-->
<!--      <template slot="title"><i class="el-icon-setting"></i>-->
<!--        <span slot="title">提醒通知</span></template>-->
<!--      <el-menu-item-group>-->
<!--        <template slot="title">分组一</template>-->
<!--        <el-menu-item index="3-1">选项1</el-menu-item>-->
<!--        <el-menu-item index="3-2">选项2</el-menu-item>-->
<!--      </el-menu-item-group>-->
<!--      <el-menu-item-group title="分组2">-->
<!--        <el-menu-item index="3-3">选项3</el-menu-item>-->
<!--      </el-menu-item-group>-->
<!--      <el-submenu index="3-4">-->
<!--        <template slot="title">选项4</template>-->
<!--        <el-menu-item index="3-4-1">选项4-1</el-menu-item>-->
<!--      </el-submenu>-->
<!--    </el-submenu>-->

   <!-- <el-submenu index="4">
     <template slot="title">
       <i class="el-icon-menu"></i>
       <span slot="title">系统管理</span>
     </template>

     <el-menu-item index="/user">
       <i class="el-icon-user"></i>
       <span slot="title">用户管理</span>
     </el-menu-item>
     <el-menu-item index="/role">
       <i class="el-icon-user"></i>
       <span slot="title">角色管理</span>
     </el-menu-item>
     <el-menu-item index="/menu">
       <i class="el-icon-user"></i>
       <span slot="title">菜单管理</span>
     </el-menu-item>
     <el-menu-item index="/file">
       <i class="el-icon-document"></i>
       <span slot="title">文件管理1</spRan>
     </el-menu-item>
   </el-submenu> -->
    <!-- </template> -->
  </el-menu>
</template>

<script>
export default {
  name: "Aside",
  //组件传值
  props: {
    isCollapse: Boolean,
    logoTextShow: Boolean
  },
  data(){
    return{
      menus : localStorage.getItem("menus") ? JSON.parse(localStorage.getItem("menus")):[],
      opens : localStorage.getItem("menus") ? JSON.parse(localStorage.getItem("menus")).map(v => v.id+''):[]
    }
  }
}
</script>

<style scoped>

</style>