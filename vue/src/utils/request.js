import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8080', // 根据实际后端地址调整
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 可以在这里添加 token 等 header
    const adminInfoStr = localStorage.getItem('adminInfo')
    if (adminInfoStr) {
      try {
        const adminInfo = JSON.parse(adminInfoStr)
        if (adminInfo.id) {
          config.headers['Admin-Id'] = adminInfo.id
        }
        if (adminInfo.role) {
          config.headers['Admin-Role'] = encodeURIComponent(adminInfo.role)
        }
      } catch (e) {}
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    let res = response.data
    
    // 如果返回的类型是文件等
    if (response.config.responseType === 'blob') {
      return res
    }
    
    // 兼容字符串转换
    if (typeof res === 'string') {
      res = res ? JSON.parse(res) : res
    }

    // 这里根据后端的 Result 结构处理
    if (res.code === '200') {
      return res
    } else {
      ElMessage.error(res.msg || '系统错误')
      return Promise.reject(new Error(res.msg || 'Error'))
    }
  },
  error => {
    console.error('err' + error)
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

export default request
