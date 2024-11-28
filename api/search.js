// 使用 localStorage 来存储最后请求时间
const getLastRequestTime = () => {
    return uni.getStorageSync('lastRequestTime') || 0
}

const setLastRequestTime = (time) => {
    uni.setStorageSync('lastRequestTime', time)
}

const INTERVAL = 5 * 1000 // 60秒间隔

// 热搜新闻接口
export const searchResources = () => {
    return new Promise((resolve, reject) => {
        const now = Date.now()
        const lastTime = getLastRequestTime()

        // 检查是否到达请求间隔
        if (now - lastTime < INTERVAL) {
            const remainingTime = Math.ceil((INTERVAL - (now - lastTime)) / 1000)
            reject({
                code: -1,
                message: `请稍后再试（${remainingTime}秒）`
            })
            return
        }

        // 更新最后请求时间
        setLastRequestTime(now)

        uni.request({
            url: 'https://cn.apihz.cn/api/xinwen/baidu.php',
            method: 'GET',
            data: {
                id: '88888888',
                key: '88888888'
            },
            success: (res) => {
                if (res.data.code === 200) {
                    // 缓存数据
                    uni.setStorageSync('newsCache', res.data)
                    uni.setStorageSync('newsCacheTime', now)
                    resolve(res.data)
                } else {
                    // 如果请求失败，尝试使用缓存数据
                    const cachedData = uni.getStorageSync('newsCache')
                    if (cachedData) {
                        resolve(cachedData)
                    } else {
                        reject(res.data)
                    }
                }
            },
            fail: (err) => {
                // 请求失败时也尝试使用缓存数据
                const cachedData = uni.getStorageSync('newsCache')
                if (cachedData) {
                    resolve(cachedData)
                } else {
                    reject(err)
                }
            }
        })
    })
}

// 视频接口
export const videoResources = () => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: 'https://api.kuleu.com/api/xjj?type=json',
            method: 'GET',
            success: (res) => {
                resolve(res.data)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}