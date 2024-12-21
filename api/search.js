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

// 优化缓存策略
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存
const RETRY_TIMES = 2;
const RETRY_DELAY = 1000;

const getCachedData = (key) => {
    const data = uni.getStorageSync(key);
    const time = uni.getStorageSync(`${key}_time`);
    if (data && time && (Date.now() - time < CACHE_DURATION)) {
        return data;
    }
    return null;
};

// 添加请求重试和错误处理
const requestWithRetry = async (options, retryCount = 0) => {
    try {
        const response = await uni.request(options);
        return response;
    } catch (error) {
        if (retryCount < RETRY_TIMES) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return requestWithRetry(options, retryCount + 1);
        }
        throw error;
    }
};

// 热搜新闻接口
const searchResources = () => {
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

// 天气画报接口
const getWeatherReport = (city) => {
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
const getBookRecommend = (bookName) => {
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

// 翻译接口
const translateText = (text) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: 'https://api.coze.cn/v1/workflow/run',
            method: 'POST',
            header: {
                'Authorization': 'Bearer pat_TZ96143O1vNGqfgnwi9uM2TmigogOxdjibiYh5xCCAkOdZW7Bd75iRRO1wJF9T65',
                'Content-Type': 'application/json'
            },
            data: {
                workflow_id: '7445294801782259738',
                parameters: {
                    BOT_USER_INPUT: text
                }
            },
            success: (res) => {
                if (res.data.code === 0) {
                    try {
                        const result = JSON.parse(res.data.data)
                        resolve(result)
                    } catch (error) {
                        reject({
                            code: -1,
                            message: '数据解析失败'
                        })
                    }
                } else {
                    reject({
                        code: -1,
                        message: res.data.msg || '翻译失败'
                    })
                }
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

// 获取电影数据接口
const getMovieData = () => {
    return new Promise((resolve, reject) => {
        const makeRequest = (retryCount = 0) => {
            uni.request({
                url: 'https://www.cikeee.cc/api',
                method: 'GET',
                timeout: 10000,
                header: {
                    'Cookie': 'PHPSESSID=caf3224b23f7ae7b415701a1872652bc'
                },
                data: {
                    app_key: 'pub_23020990025',
                    t: Date.now()
                },
                success: (res) => {
                    console.log('API响应:', res);
                    if (res.statusCode === 200 && res.data) {
                        // 缓存数据
                        try {
                            uni.setStorageSync('movieCache', res.data);
                            uni.setStorageSync('movieCacheTime', Date.now());
                        } catch (e) {
                            console.error('缓存数据失败:', e);
                        }
                        resolve(res.data);
                    } else {
                        // 尝试使用缓存数据
                        const cachedData = uni.getStorageSync('movieCache');
                        if (cachedData) {
                            console.log('使用缓存数据');
                            resolve(cachedData);
                        } else if (retryCount < 2) {
                            console.log(`重试请求 ${retryCount + 1}`);
                            setTimeout(() => makeRequest(retryCount + 1), 1000);
                        } else {
                            reject({
                                code: -1,
                                message: '获取电影数据失败',
                                detail: res
                            });
                        }
                    }
                },
                fail: (err) => {
                    console.error('请求失败详情:', err);
                    const cachedData = uni.getStorageSync('movieCache');
                    if (cachedData) {
                        console.log('使用缓存数据');
                        resolve(cachedData);
                    } else if (retryCount < 2) {
                        console.log(`重试请求 ${retryCount + 1}`);
                        setTimeout(() => makeRequest(retryCount + 1), 1000);
                    } else {
                        reject({
                            code: -1,
                            message: '请求失败',
                            detail: err
                        });
                    }
                }
            });
        };

        makeRequest();
    });
};
// 获取节假日数据接口
const getHolidayData = () => {
    return new Promise((resolve, reject) => {
        // 先检查缓存
        const cachedData = getCachedData('holidayCache');
        if (cachedData) {
            resolve(cachedData);
            return;
        }

        uni.request({
            url: `https://timor.tech/api/holiday/year/${new Date().getFullYear()}`,
            method: 'GET',
            success: (res) => {
                if (res.statusCode === 200 && res.data) {
                    // 缓存数据
                    try {
                        uni.setStorageSync('holidayCache', res.data);
                        uni.setStorageSync('holidayCache_time', Date.now());
                    } catch (e) {
                        console.error('缓存节假日数据失败:', e);
                    }
                    resolve(res.data);
                } else {
                    // 如果请求失败，尝试使用缓存
                    const cachedData = uni.getStorageSync('holidayCache');
                    if (cachedData) {
                        resolve(cachedData);
                    } else {
                        reject({
                            code: -1,
                            message: '获取节假日数据失败',
                            detail: res
                        });
                    }
                }
            },
            fail: (err) => {
                console.error('请求失败详情:', err);
                // 请求失败时尝试使用缓存
                const cachedData = uni.getStorageSync('holidayCache');
                if (cachedData) {
                    resolve(cachedData);
                } else {
                    reject({
                        code: -1,
                        message: '请求失败',
                        detail: err
                    });
                }
            }
        });
    });
};

// 值得买吗接口
const getShoppingAdvice = (query, maxPrice, minPrice) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: 'https://api.coze.cn/v1/workflow/run',
            method: 'POST',
            header: {
                'Authorization': 'Bearer pat_TZ96143O1vNGqfgnwi9uM2TmigogOxdjibiYh5xCCAkOdZW7Bd75iRRO1wJF9T65',
                'Content-Type': 'application/json'
            },
            data: {
                workflow_id: '7450799344502423603',
                parameters: {
                    query: query,
                    max_price: maxPrice,
                    min_price: minPrice
                }
            },
            success: (res) => {
                if (res.data.code === 0) {
                    try {
                        const result = JSON.parse(res.data.data);
                        resolve(result);
                    } catch (error) {
                        reject({
                            code: -1,
                            message: '数据解析失败'
                        });
                    }
                } else {
                    reject({
                        code: -1,
                        message: res.data.msg || '获取购物建议失败'
                    });
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
};

// 统一导出所有函数
export {
    searchResources,
    getWeatherReport,
    getBookRecommend,
    translateText,
    getMovieData,
    getHolidayData,
    getShoppingAdvice
}
