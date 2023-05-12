<template lang="">
    <div class="notification">
        <el-card  class="card" v-for="(notification, index) in notifications" :key="index" @click.native="showNotification(notification)" shadow="hover">
            <div slot="header">{{ notification.noticeTitle }}</div>
            <div style="margin-bottom:30px">
            <template >
                {{ notification.noticeContent.length > 7 ? notification.noticeContent.slice(0, 10) + '...' : notification.noticeContent }}
            </template></div>
            <div style="position: relative;">
                <div style="position: absolute; bottom: 0; left: 0;">
                    <i class="el-icon-time"></i>
                {{ parseTime(notification.createTime, '{y}-{m}-{d}') }}
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
export default {
    name: "ToastCard",
    props: {
        notifications: Array,
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
</style>