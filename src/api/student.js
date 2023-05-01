import request from '@/utils/request'
// 判断当天有没有提交健康报表
export function gethealth(username) {
  return request({
      url: "/health/username/"+username,
      method: "GET"
  });
}
//提交报表
export function sethealth(data) {
  return request({
      url: '/health',
      method: 'post',
      data
  })
}



// 获取学生请假表
export function getmyLeave(username) {
  return request({
      url: "/leave/username/" + username,
      method: "get",

  });
}
//通过Id获取
export function getmyLeaveById(leaveId) {
  return request({
      url: "/leave/"+leaveId,
      method: "get",

  });
}
// 撤销请假
export function updateLeave(data) {
  return request({
    url: '/leave',
    method: 'post',
    data: data
  })
}
// 提交请假单
export function setLeave(data) {
  return request({
      url: "/leave",
      method: "POST",
      data
  });
}

// 获取发布的通知公告详细
export function getNoticeOpen(username) {
  return request({
    url: '/notice/open',
    method: 'get',
    params: username
  })
}