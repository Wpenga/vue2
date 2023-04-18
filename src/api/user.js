import request from "@/utils/request";
// 用户登录
export function login(data) {
    return request({
        url: "/user/login",
        method: "POST",
        data,
    });
}


// 查询通知公告列表
export function listNotice(query) {
  return request({
    url: '/notice/page',
    method: 'get',
    params: query
  })
}

// 查询通知公告详细
export function getNotice(noticeId) {
  return request({
    url: '/notice/' + noticeId,
    method: 'get'
  })
}

// 新增通知公告
export function addNotice(data) {
  return request({
    url: '/notice',
    method: 'post',
    data: data
  })
}

// 修改通知公告
export function updateNotice(data) {
  return request({
    url: '/notice',
    method: 'put',
    data: data
  })
}

// 删除通知公告
// export function delNotice(noticeId) {
//   return request({
//     url: '/notice/' + noticeId,
//     method: 'delete'
//   })
// }
export function delNotice(noticeId) {
  return request({
    url: '/notice/del/batch',
    method: 'post',
    data: noticeId
  })
}
