<template>
    <div class="card" @click="goToLink(url)">
      <div class="card-left">
        <div class="card-title">{{ title }}</div>
        <div class="card-media">{{ media }}</div>
      </div>
      <div class="card-right">
        <img :src="thumb" alt="" />
      </div>
    </div>
</template>
  
  <script>
  export default {
    props: {
      title: {
        type: String,
        default: "",
      },
      media: {
        type: String,
        default: "",
      },
      thumb: {
        type: String,
        default: "",
      },
      url: {
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
  .card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border: 1px solid #ccc;
    cursor: pointer;
  }
  
  .card-left {
    display: flex;
    flex-direction: column;
  }
  
  .card-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .card-media {
    font-size: 12px;
    color: #999;
  }
  
  .card-right {
    width: 150px;
    height: 100px;
  }
  
  .card-right img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  </style>