import axios from 'axios'
import { Message } from 'element-ui'
import { saveAs } from 'file-saver'
import { getToken } from '@/utils/auth'
// import errorCode from '@/utils/errorCode'
// import { blobValidate } from "@/utils/ruoyi";

const baseURL = process.env.VUE_APP_BASE_API

export default {
  name(url,name, isDelete = true) {
    var url = url
    // baseURL + "/common/download?fileName=" + encodeURIComponent(name) + "&delete=" + isDelete
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { 'token':  getToken() }
    }).then((res) => {
        // console.log(res);
      const isBlob = this.blobValidate(res.data);
      if (isBlob) {
        const blob = new Blob([res.data])
        this.saveAs(blob, decodeURIComponent(name))
      } else {
        this.printErrMsg(res.data);
      }
    })
  },
  // 验证是否为blob格式
    blobValidate(data) {
    return data.type !== 'application/json'
  },
  resource(resource) {
    var url = baseURL + "/common/download/resource?resource=" + encodeURIComponent(resource);
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      hheaders: { 'token':  getToken() }
    }).then((res) => {
      const isBlob = blobValidate(res.data);
      if (isBlob) {
        const blob = new Blob([res.data])
        this.saveAs(blob, decodeURIComponent(res.headers['download-filename']))
      } else {
        this.printErrMsg(res.data);
      }
    })
  },
  
  saveAs(text, name, opts) {
    saveAs(text, name, opts);
  },
  async printErrMsg(data) {
    let errorCode={
        '401': '认证失败，无法访问系统资源',
        '403': '当前操作没有权限',
        '404': '访问资源不存在',
        'default': '系统未知错误，请反馈给管理员'
    }
    const resText = await data.text();
    const rspObj = JSON.parse(resText);
    const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
    Message.error(errMsg);
  }
}

