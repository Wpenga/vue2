<template>
  <div style="height: 100%">
<!--    <img alt="Vue logo" src="../assets/logo.png">-->
<!--    style="height: 100%;"-->
    <el-container style="min-height: 100vh;">
      <el-aside :width="sideWidth+'px'" style="background-color: rgb(238, 241, 246);box-shadow: 2px 0 6px rgb(0 21 41 / 35%);">
      <!--导航栏-->
        <Aside  :isCollapse="isCollapse" :logoTextShow="logoTextShow"/>
      </el-aside >

      <el-container>
        <!--头部组件-->
        <el-header style="border-bottom: 1px solid #cccccc;">
          <Header :collapseBtnClass="collapseBtnClass" :collapse="collapse" :user="user"/>
        </el-header>

        <el-main>
          <!--前页面在子路由中展示-->
          <router-view @refreshUser="getUser"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Aside from "@/components/Aside";
import Header from "@/components/Header";

export default {
  name: 'Home',
  //注册组件
  components: {
    Aside,
    Header
  },
  data() {
    return {
      //图标
      collapseBtnClass:'el-icon-s-fold',
      //收缩
      isCollapse:false,
      sideWidth:200,
      logoTextShow:true,
      user:{}
    }
  },
  created() {
    //获取User数据
    this.getUser()
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
    getUser(){
      //后台获取User数据
      let username = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).username:""
      this.request.get("/user/username/"+username).then(res=>{
        //重新赋值
        // console.log("更新数据");
        this.user = res.data
      })
    },
  }
}
</script>
