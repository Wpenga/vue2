import request from '@/utils/request'

//获取统计数据
export function getdata(){
    return request({
        url: '/echarts/getdata',
        method: 'get',
    })
}

//获取时间分布
export function getTiemCounts(){
    return request({
        url: '/echarts/timeCounts',
        method: 'get',
    })
}