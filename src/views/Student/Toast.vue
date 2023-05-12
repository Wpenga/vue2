<template>
  <div class="notification">
    <el-row :gutter="20">
      <el-col :span="18" :xs="24" style="width: 900px">
        <el-card style="height:auto">
          <div slot="header" class="clearfix">
            <span style="font-size: larger; font-weight: bolder">通知内容</span>
          </div>
          <!-- v-model="activeTab" -->
          <el-tabs v-model="activeTab" @tab-click="tabClick">
            <el-tab-pane label="公告" name="announcement">
              <ToastCard :notifications="announcement" />
            </el-tab-pane>
            <el-tab-pane label="通知" name="toast">
              <ToastCard :notifications="toast" />
            </el-tab-pane>

            <!-- 分页浏览 -->
          <el-pagination
                style="margin-bottom: 4px;"
                :hide-on-single-page="onePage"
                small 
                layout="total,sizes,prev, pager, next,jumper" 
                @size-change="handleSizeChange"
                @current-change="handleCurrentChangeToast" 
                :current-page="pageNumToast" 
                :page-sizes="[6, 9, 12]"
                :page-size="pageSizeToast" 
                :total="totalToast">
            </el-pagination>
          </el-tabs>
          
        </el-card>
      </el-col>
      <!-- 新闻 -->
      <el-col :span="6" :xs="24" >
        <div style="position: relative;">
        <el-card style="width: 300px;height:567px">
          
          <div slot="header" class="clearfix">
            <span style="font-size: larger; font-weight: bolder">疫情资讯</span>
          </div>
            <el-tabs v-model="activeTabNews" @tab-click="tabClick" >
              <el-tab-pane label="全国" name="country" >
                <div v-for="news in countryNews" :key="news.title">
                  <newCard :media="news.mediaInfo.ipHome ? news.mediaInfo.ipHome : '' +' '+ news.mediaInfo.name" :cTime="news.title" :title="news.shareInfo.title" :thumb="news.shareInfo.imgUrl" :url="news.shareInfo.link"></newCard>
                </div>
                <!-- {{ news.mediaInfo.ipHome ? news.mediaInfo.ipHome : '' }} {{ news.mediaInfo.name ? news.mediaInfo.name : '' }} -->
              </el-tab-pane>

              <el-tab-pane label="地方" name="province">
                <div v-for="news in newsArr" :key="news.id">
                  <newCard :media="news.media" :cTime="news.cTime" :title="news.title" :thumb="news.thumb" :url="news.url"></newCard>
                </div>
              </el-tab-pane>
              <!-- 分页浏览新闻 -->
              <!-- @size-change="handleSizeChange" -->
             
              
              
            
            </el-tabs>
        </el-card>
        <el-pagination
                small 
                layout="prev, pager, next" 
                @current-change="handleCurrentChange" 
                :current-page="pageNum" 
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageSize" 
                :total="total"
                style="position: absolute; bottom: 5px; left: 0;margin-bottom: 5px;">
              </el-pagination>
      </div>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getNoticeOpen } from "@/api/student";
import ToastCard from "@/components/ToastCard.vue";
import newCard from "@/components/newCard.vue";
import jsonp from 'jsonp'
import countyNews from "@/assets/countyNews.js"
export default {
  name: "Home",
  //注册组件
  components: {
    ToastCard,
    newCard,
  },
  data() {
    return {
      notifications: [],
      dialogVisible: false,
      selectedNotification: {},
      announcement: [], //公告
      toast: [], //通知
      activeTab: "announcement", //默认选中卡片公告
      activeTabNews: "country",
      totalToast:1,
      total: 1, //数量
      pageNum: 1,  //页码
      pageSize: 3,  //大小
      onePage:false,//一页不显示
      pageNumToast:1,
      pageSizeToast:6,
      newsArr: [],
    };
  },
  created() {
    let username = null;
    // if(JSON.parse(localStorage.getItem("user")).role == "ROLE_STUDENT"){
      username = JSON.parse(localStorage.getItem("user")).username;
    // }
    //获取通知内容
    getNoticeOpen({ username }).then((response) => {
      this.Allannouncement = response.data.filter((item) => item.noticeType == 0);   
      this.announcement = this.getNewsForPage(this.Allannouncement,this.pageNumToast,this.pageSizeToast) //公告
      this.totalToast = this.Allannouncement.length
      this.Alltoast = response.data.filter((item) => item.noticeType == 1);     
      this.toast = this.getNewsForPage(this.Alltoast,this.pageNumToast,this.pageSizeToast) //通知
    });
    this.getProvinceNews()
    this.getCounryNews()
  },
  methods: {
    //处理通知弹窗
    showNotification(notification) {
      this.selectedNotification = notification;
      this.dialogVisible = true;
    },
    // 获取省份新闻
    getProvinceNews() {
      const params = {
        type: 'province',
        code: 'guangdong',
        page: 1
      };
      const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
      jsonp(
        `https://gwpre.sina.cn/interface/news/wap/fyzt_newsv2.d.json?${queryString}`,{},//?type=province&code=guangdong&page=1
        (err, res) => {
          if (!err) {
            this.AllnewsArr = res.result.data;
            // this.total = this.AllnewsArr.length
            this.newsArr = this.getNewsForPage(this.AllnewsArr,this.pageNum,this.pageSize)
          }
        }
      );
    },
    //获取全国新闻
    getCounryNews() {
      this.AllcountryNews = countyNews.data.components[1].data.map(
        (item)=> ({ 
          title:item.title, 
          shareInfo: item.item.info.interactionInfo.shareInfo ,
          mediaInfo:item.item.info.mediaInfo
        }));
      this.total = this.AllcountryNews.length
      this.countryNews = this.getNewsForPage(this.AllcountryNews,this.pageNum,this.pageSize)

      const params = {
        page: 1,
        conf: 'page',
        pageType: 'kangYiNewsFlash'
      };
      const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
      jsonp(
        `https://interface.sina.cn/app.news/24hours_news.d.json?${queryString}`,{},//?page=1&conf=page&pageType=kangYiNewsFlash
        (err, res) => {
          if (!err) {
            // console.log(res.data.components[1].data.map);
            this.AllcountryNews = res.data.components[1].data.map(
              (item)=> ({ 
                title:item.title, 
                shareInfo: item.item.info.interactionInfo.shareInfo ,
                mediaInfo:item.item.info.mediaInfo}
              ));
            this.total = this.AllcountryNews.length
            this.countryNews = this.getNewsForPage(this.AllcountryNews,this.pageNum,this.pageSize)
          }
        }
      );
    },
    // 处理点击tab事件
    tabClick(tab){
      console.log('选中的标签页标签名为:', tab.label)
      this.labeltile = tab.label
      if(tab.label ==='地方'){
        this.total = this.AllnewsArr.length
      }else if(tab.label ==='全国'){
        this.total = this.AllcountryNews.length
      }else if(tab.label === "通知"){
        this.totalToast = this.Alltoast.length
      }else{
        this.totalToast = this.Allannouncement.length
      }
      this.handleCurrentChange(1)
      this.handleCurrentChangeToast(1) 
    },
    //pageSize改变时触发
    handleSizeChange(val) {
      this.pageSizeToast = val;
      this.announcement = this.getNewsForPage(this.Allannouncement,this.pageNumToast,this.pageSizeToast)
      // this.newsArr = this.getNewsForPage(this.AllnewsArr,this.pageNum,this.pageSize)
    },
    // 通知页面变化
    handleCurrentChangeToast(val) {
      this.pageNumToast = val;
      this.announcement = this.getNewsForPage(this.Allannouncement,val,this.pageSizeToast)
      if(this.labeltile === '公告'){
        this.announcement = this.getNewsForPage(this.Allannouncement,val,this.pageSizeToast)
      }else{
        this.toast = this.getNewsForPage(this.Alltoast,val,this.pageSizeToast)
      }
    },
    // 新闻页面变化
    handleCurrentChange(val) {
      this.pageNum = val;
      if(this.labeltile === '地方'){
        this.newsArr = this.getNewsForPage(this.AllnewsArr,val,this.pageSize)
      }else{
        this.countryNews = this.getNewsForPage(this.AllcountryNews,val,this.pageSize)
      }
    },
    getNewsForPage(arr,pageNum, pageSize) {
  // // 总共有多少条新闻数据？
    // this.total = arr.length;
  
  // // 计算总共有多少页
  // const totalPages = Math.ceil(total / pageSize);
  
  // // 如果请求的页码大于总页数，则返回空数组
  // if (pageNum > totalPages) {
  //   return [];
  // }
  
  // 计算需要获取的新闻数据的索引
  const start = (pageNum - 1) * pageSize;
  const end = pageNum * pageSize;
  // 返回需要获取的新闻数据
  return arr.slice(start, end);
}

  },
};
</script>

<style>
.notification {
  display: flex;
  flex-wrap: wrap;
  /* justify-content: space-between; */
  margin: 20px;
}

.card {
  width: calc(33.33% - 10px);
  margin-bottom: 20px;
  margin-right: 10px;
}
.page {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 300px; /* 根据需要设置宽度 */
}

</style>
