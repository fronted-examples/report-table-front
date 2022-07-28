import axios from 'axios'
import { Message } from 'element-ui'

/**
 * 控制请求重试
 * @param {*} adapter 预增强的 Axios 适配器对象；
 * @param {*} options 缓存配置对象，该对象支持 2 个属性，分别用于配置不同的功能：
 *                      times：全局设置请求重试的次数；
 *                      delay：全局设置请求延迟的时间，单位是 ms。
 * @returns
 */
function retryAdapterEnhancer (adapter, options) {
  const { times = 0, delay = 300 } = options

  return async (config) => {
    const { retryTimes = times, retryDelay = delay } = config
    let __retryCount = 0

    const request = async () => {
      try {
        return await adapter(config)
      } catch (err) {
        if (!retryTimes || __retryCount >= retryTimes) {
          return Promise.reject(err)
        }

        __retryCount++

        // 延时处理
        const delay = new Promise((resolve) => {
          setTimeout(() => {
            resolve()
          }, retryDelay)
        })

        // 重新发起请求
        return delay.then(() => {
          return request()
        })
      }
    }

    return request()
  }
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  adapter: retryAdapterEnhancer(axios.defaults.adapter, {
    retryDelay: 1000
  })
})

service.defaults.withCredentials = true

// 请求拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const { data, config } = response

    console.log('响应信息：', response)

    // if the custom code is not 20000, it is judged as an error.
    if (config.responseType === 'blob') {
      // 下载请求，不抛错误
      return data
    }

    if (config.responseType === 'arraybuffer') {
      // 获取图片的二进制流
      return response
    }

    return data
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
