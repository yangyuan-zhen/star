import { getCurrentInstance } from 'vue'

export function useAxios() {
    return {
        $axios: {
            get: (url) => {
                return new Promise((resolve, reject) => {
                    uni.request({
                        url: `你的接口基础URL${url}`,
                        method: 'GET',
                        success: (res) => {
                            resolve({ data: res.data })
                        },
                        fail: (err) => {
                            reject(err)
                        }
                    })
                })
            }
        }
    }
} 