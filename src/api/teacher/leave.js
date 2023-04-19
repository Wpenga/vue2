import request from '@/utils/request'

// 查询请假列表
export function listLeave(query) {
  return request({
    url: '/leave/page',
    method: 'get',
    params: query
  })
}

//批准请假
// export function allowLeave(LeaveId){
//   return request({
//     url: '/leave/allow' + LeaveId,
//     method: 'get'
//   })
// }
// export function allowLeave(data){
//   return request({
//     url: '/leave' ,
//     method: 'post',
//     data
//   })
// }
// 查询请假详细
export function getLeave(LeaveId) {
  return request({
    url: '/leave/' + LeaveId,
    method: 'get'
  })
}

// 新增请假
export function addLeave(data) {
  return request({
    url: '/leave',
    method: 'post',
    data: data
  })
}

// 修改请假
export function updateLeave(data) {
  return request({
    url: '/leave',
    method: 'post',
    data: data
  })
}

// 删除请假
// export function delLeave(LeaveId) {
//   return request({
//     url: '/Leave/' + LeaveId,
//     method: 'delete'
//   })
// }
export function delLeave(LeaveId) {
  return request({
    url: '/leave/del/batch',
    method: 'post',
    data: LeaveId
  })
}