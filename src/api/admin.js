import request from '@/utils/request'

// 查询用户信息列表
export function listUser(query) {
  return request({
    url: '/user/page',
    method: 'get',
    params: query
  })
}
// 所有信息
export function listUserAll() {
  return request({
    url: '/user/ids',
    method: 'get'
  })
}
// 查询用户信息详情
export function getUser(userId) {
  return request({
    url: '/user/' + userId,
    method: 'get'
  })
}
  
// 新增/更新用户信息 
export function addUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data: data
  })
}
  
// 修改用户信息
export function updateUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data: data
  })
}
  
// 删除用户信息
export function delUser(userId) {
  return request({
    url: '/user' + userId,
    method: 'delete'
  })
}
// 删除多个用户信息
export function delUsers(userIds) {
  return request({
    url: '/user/del/batch',
    method: 'post',
    data:userIds
  })
}

// 获取角色信息
export function getRole() {
  return request({
    url: '/role' ,
    method: 'get'
  })
}
// 导入用户列表
export function importFile(data){
  return request({
    url: '/user/import',
    method: 'post',
    data
  })
}