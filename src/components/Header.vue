<template>
  <!--          收缩按钮-->
  <div style="line-height: 60px;display:flex">

  <div style="flex:1">
    <span :class="collapseBtnClass" style="cursor: pointer;font-size: 18px;" @click="collapse"></span>
<!--    <div style="margin-bottom:30px">-->
      <el-breadcrumb separator="/" style="display: inline-block;margin-left:10px">
        <el-breadcrumb-item :to="'/'">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="currentPathName !== '首页'">{{currentPathName}}</el-breadcrumb-item>
<!--        <el-breadcrumb-item><a href="/">学生信息</a></el-breadcrumb-item>-->
        <!--<el-breadcrumb-item>活动列表</el-breadcrumb-item>-->
        <!--<el-breadcrumb-item>活动详情</el-breadcrumb-item>-->
      </el-breadcrumb>
  </div>

    <!--  cursor:pointer 实现鼠标变拳头-->
  <el-dropdown style="width:150px;cursor:pointer;text-align: center" >
    <div style="display: inline-block">
      <img :src="user.avatarUrl" alt="" style="width: 30px;border-radius: 50%;position: relative;top: 10px;right:5px">
      <span>{{ user.nickname }}</span><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
    </div>
    <el-dropdown-menu slot="dropdown" style="width: 100px;text-align: center;">
      <el-dropdown-item style="font-size: 14px;padding: 5px 0"  @click.native="toPage(1)">
        <!-- <router-link to="/person" style="text-decoration: none" @click.native="$emit('click')"> -->
        个人信息
        <!-- </router-link> -->
      </el-dropdown-item>
      <el-dropdown-item style="font-size: 14px; padding: 5px 0" @click.native="toPage(2)">
          <!-- <router-link to="/password" style="text-decoration: none"  > -->
          修改密码
          <!-- </router-link> -->
        </el-dropdown-item>
      <el-dropdown-item style="font-size: 14px;padding: 5px 0" @click.native="logout">
        <!-- <div  style="text-decoration: none" @click="logout"> -->
          退出

        <!-- </div> -->
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "Header",
  props:{
    collapseBtnClass:String,
    collapse:Function,
    user: Object
  },
  data(){
    return{
      // user:localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")):{}
    }
  },
  methods:{
    logout(){//退出登录
      this.$store.commit("logout")
      this.$message.success("退出成功")
    },
    toPage(val){
      const toPath = val === 1 ? '/person' : '/password'
      const path = this.$route.path// 返回当前路由的路径
      if (path === toPath) {
          // 当前路由已经是 topath 页面，则不用再次跳转
          return
        }
        this.$router.push(toPath)
    }
  },
  computed:{
    currentPathName(){
      return this.$store.state.currentPathName; //需要监听的数据
    },

  },
  watch:{
    currentPathName(newVal){
      // console.log(newVal)
    }
  }
}
</script>

<style scoped>

</style>