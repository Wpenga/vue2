import request from '@/utils/request'

//提交数据
export function sethealth(data) {
  return request({
    url: '/student/sethealth',
    method: 'post',
    data
  })
}