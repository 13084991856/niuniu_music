import axios from 'axios'

export function request(config) {
    // 1.创建axios的实例
    const instance = axios.create({
        baseURL: 'http://bao.lqjhome.cn:3000',
        timeout: 5000
    })

    // 2.axios的拦截器
    // 2.1.请求拦截的作用
    instance.interceptors.request.use(config => {
        return config
    }, err => {
        console.log(err);
    })

    // 2.2.响应拦截
    instance.interceptors.response.use(res => {
        return res.data
    }, err => {
        if (err && err.response) {
            switch (err.response.status) {
                case 503:
                    err.message = '服务不可用'
                    break
            }
        }
        console.log(err);
        return Promise.reject(err)
    })

    // 3.发送真正的网络请求
    return instance(config)
}