<template>
  <div class="notification">
    <el-card  class="card" v-for="(notification, index) in notifications" :key="index" @click.native="showNotification(notification)">
      <div slot="header">{{ notification.noticeTitle }}</div>
      <div style="margin-bottom:30px">{{ notification.noticeContent }}</div>
      <div style="position: relative;">
        <div style="position: absolute; bottom: 0; left: 0;">
            <i class="el-icon-time"></i>
          {{ parseTime(notification.createTime, '{y}-{m}-{d}') }}
        </div>
      </div>
      <!-- <div>
        <i class="el-icon-time"></i>
          {{ notification.createTime }}
      </div> -->
     
    </el-card>
    <el-dialog :title="selectedNotification.noticeTitle" :visible.sync="dialogVisible" >
      <span>{{ selectedNotification.noticeContent }}</span>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getNoticeOpen} from "@/api/student";
export default {
  data() {
    return {
      notifications: [
        // {
        //   title: "New feature released",
        //   content: "We have just released a new feature in our app. Check it out!",
        //   date: "2022-05-06",
        // },
        // {
        //   title: "Maintenance scheduled",
        //   content: "We will be undergoing maintenance on May 15th, 2022 from 10:00pm to 12:00am EST. Please make sure to save your work before then.",
        //   date: "2022-05-10",
        // },
        // {
        //   title: "Important security update",
        //   content: "We have detected a security vulnerability in our app. Please update to the latest version immediately.",
        //   date: "2022-05-02",
        // }
      ],
      dialogVisible: false,
      selectedNotification: {}
    }
  },
  created(){
    getNoticeOpen().then((response) => {
        this.notifications = response.data;
        // this.form.status = this.dicts[0].value
      });
  },
  methods: {
    showNotification(notification) {
      // if (notification.unread) {
      //   notification.unread = false;
      // }
      this.selectedNotification = notification;
      this.dialogVisible = true;
    }
  }
}
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
</style>
