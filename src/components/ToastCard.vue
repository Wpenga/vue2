<template lang="">
    <div class="notification">
        <el-card  class="card" v-for="(notification, index) in notifications" :key="index" @click.native="showNotification(notification)" shadow="hover">
            <div slot="header" style="font-weight:bold">{{ notification.noticeTitle }}</div>
            <div style="margin-bottom:30px">
            <template >
                {{ notification.noticeContent.length > 7 ? notification.noticeContent.slice(0, 10) + '...' : notification.noticeContent }}
            </template></div>
            <div style="position: relative;">
                <div style="position: absolute; bottom: 0; left: 0;font-size: 8px;color: #999;">
                    <i class="el-icon-time"></i>
                {{ parseTime(notification.createTime, '{y}-{m}-{d}') }}
                </div>
            </div>
        </el-card>

     <el-dialog :title="selectedNotification.noticeTitle" :visible.sync="dialogVisible" >
        <div style="position: absolute; top: 60px; font-size: 12px;color: #999;">
                    <i class="el-icon-time"></i>
                {{ parseTime(selectedNotification.createTime, '{y}-{m}-{d}') }}
                </div>
      <span>{{ selectedNotification.noticeContent }}</span>
      <!-- <div style="position: relative;"> -->
                
            <!-- </div> -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    </div>
</template>
<script>
export default {
    name: "ToastCard",
    props: {
        notifications: Array,
        // showNotification: Function
    },
    data(){
        return{
            dialogVisible: false,
            selectedNotification: {},
        }
    },
    methods: {
        showNotification(notification) {
        // if (notification.unread) {
        //   notification.unread = false;
        // }
            this.selectedNotification = notification;
            this.dialogVisible = true;
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
  cursor: pointer;
}
</style>