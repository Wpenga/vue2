<template>
    <!-- <div> -->
    <div class="cards" @click="goToLink(url)">
      <div class="card-left">
        <!-- <div class="card-title">{{ title }}</div> -->
        <div class="card-title">{{ title.length > 42 ? title.slice(0, 42) + '...' : title }}</div>
        <div class="card-media">{{ media }}</div>
        <div class="card-time"><i class="el-icon-time"></i>{{ cTime }}</div>
      </div>
      <div class="card-right" v-if="thumb">
        <img :src="thumb" alt="" />
      </div>
    </div>
    
      <!-- <el-pagination
        small
        layout="prev, pager, next"
        :total="50">
      </el-pagination>
    </div> -->
</template>
  
  <script>
  export default {
    props: {
      title: { //标题
        type: String,
        default: "",
      },
      media: { //媒体
        type: String,
        default: "",
      },
      cTime: { //时间
        type: String,
        default: "",
      },
      thumb: { //封面
        type: String,
        default: "",
      },
      url: {   //链接
        type: String,
        default: "",
      },
    },
    methods: {
      goToLink(link) {
        window.open(link, "_blank");
      },
    },
  };
  </script>
  
  <style scoped>
  .cards {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border: 1px solid #ccc;
    cursor: pointer;
    margin-bottom: 10px;
    border-radius:10px;
  }
  
   .card-left {
    display: flex;
    flex-direction: column;
  }
  
  .card-title {
    font-size: 10px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .card-media {
    font-size: 12px;
    color: #999;
  }
  .card-time {
    font-size: 8px;
    color: #999;
  }
  .card-right1 {
    width: 150px;
    height: 100px;
    display: flex; /* 将容器设置为 Flex 容器 */
    justify-content: center; /* 将内容横向居中 */
    align-items: center; /* 将内容纵向居中 */
  }
  .card-right {
  width: 150px;
  height: 100px; /* 固定容器比例 */
  overflow: hidden; /* 超出部分隐藏 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-right img {
  width: 100%;
  height: auto;
  object-fit: cover; /* 裁剪显示图片 */
  border-radius:10px;
  max-width: 100%;
  max-height: 100px;
}

  /* .card-right img {
    object-fit: cover;
    max-width: 100px;
    max-height: 100px;
    width: auto;
    height: auto;
    border-radius:10px;
  }  */
  /* .card-right img {
    width: 100%;
    height: auto;
    object-fit: contain;
    display: block; 
    margin: 0 auto; 
    max-width: 100%;
    max-height: 100px;
    border-radius:10px;
} */

  </style>