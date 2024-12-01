"use strict";
const common_vendor = require("../common/vendor.js");

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

//历史上的今天
export const historyToday = () => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: "https://www.mxnzp.com/api/history/today",
            method: "GET",
            data: {
                type: 0,
                app_id: '0amkrpktjgnqorxr',
                app_secret: '1W9TGrscBM21Vqu4rsTQK2c8PbY0kRdM'
            },
            success: (res) => {
                if (res.data.code === 1) {
                    const formattedData = {
                        code: 1,
                        data: res.data.data.map(item => ({
                            year: item.year,
                            month: item.month,
                            day: item.day,
                            title: item.title,
                            picUrl: item.picUrl || ''
                        }))
                    };
                    resolve(formattedData);
                } else {
                    reject({
                        code: -1,
                        message: res.data.msg || '获取数据失败'
                    });
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}

// 天气画报接口
export const getWeatherReport = (city) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: 'https://api.coze.cn/v1/workflow/run',
            method: 'POST',
            header: {
                'Authorization': 'Bearer pat_TZ96143O1vNGqfgnwi9uM2TmigogOxdjibiYh5xCCAkOdZW7Bd75iRRO1wJF9T65',
                'Content-Type': 'application/json'
            },
            data: {
                "workflow_id": "7442954002298388492",
                "parameters": {
                    "city": city
                }
            },
            success: (res) => {
                if (res.data.code === 0) {
                    try {
                        // 解析字符串格式的 data
                        const weatherData = JSON.parse(res.data.data);
                        resolve(weatherData);
                    } catch (error) {
                        reject({
                            code: -1,
                            message: '数据解析失败'
                        });
                    }
                } else {
                    reject({
                        code: -1,
                        message: res.data.msg || '获取天气数据失败'
                    });
                }
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}
// AI荐书接口   
export const getBookRecommend = (bookName) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: 'https://api.coze.cn/v1/workflow/run',
            method: 'POST',
            header: {
                'Authorization': 'Bearer pat_TZ96143O1vNGqfgnwi9uM2TmigogOxdjibiYh5xCCAkOdZW7Bd75iRRO1wJF9T65',
                'Content-Type': 'application/json'
            },
            data: {
                "workflow_id": "7443436905217835019",
                "parameters": {
                    "BOT_USER_INPUT": bookName
                }
            },
            success: (res) => {
                if (res.data.code === 0) {
                    try {
                        // 解析返回的数据
                        const bookData = JSON.parse(res.data.data);
                        resolve(bookData);
                    } catch (error) {
                        reject({
                            code: -1,
                            message: '数据解析失败'
                        });
                    }
                } else {
                    reject({
                        code: -1,
                        message: res.data.msg || '获取图书推荐失败'
                    });
                }
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}