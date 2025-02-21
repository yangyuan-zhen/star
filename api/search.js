"use strict";
const common_vendor = require("../common/vendor.js");

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

// 天气画报接口
const getWeatherReport = (city) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: 'https://api.coze.cn/v1/workflow/run',
            method: 'POST',
            header: {
                'Authorization': 'Bearer pat_0xvh1L4lHPEiozeyZ0u9TnnVwD4cO8GkaM87ceE4z5is1uIuydjQ4AnzsIpgNFoV',
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
                'Authorization': 'Bearer pat_0xvh1L4lHPEiozeyZ0u9TnnVwD4cO8GkaM87ceE4z5is1uIuydjQ4AnzsIpgNFoV',
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
                'Authorization': 'Bearer pat_0xvh1L4lHPEiozeyZ0u9TnnVwD4cO8GkaM87ceE4z5is1uIuydjQ4AnzsIpgNFoV',
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

        // 添加重试机制
        const makeRequest = (retryCount = 0) => {
            uni.request({
                url: `https://timor.tech/api/holiday/year/${new Date().getFullYear()}`,
                method: 'GET',
                timeout: 10000, // 添加超时设置
                success: (res) => {
                    console.log('节假日API响应:', res); // 添加日志
                    if (res.statusCode === 200 && res.data && res.data.code === 0) {
                        try {
                            uni.setStorageSync('holidayCache', res.data);
                            uni.setStorageSync('holidayCache_time', Date.now());
                            resolve(res.data);
                        } catch (e) {
                            console.error('缓存节假日数据失败:', e);
                            resolve(res.data); // 即使缓存失败也返回数据
                        }
                    } else if (retryCount < RETRY_TIMES) {
                        console.log(`节假日API重试 ${retryCount + 1}`);
                        setTimeout(() => makeRequest(retryCount + 1), RETRY_DELAY);
                    } else {
                        // 尝试使用缓存
                        const cachedData = uni.getStorageSync('holidayCache');
                        if (cachedData) {
                            console.log('使用已缓存的节假日数据');
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
                    console.error('节假日API请求失败:', err);
                    if (retryCount < RETRY_TIMES) {
                        setTimeout(() => makeRequest(retryCount + 1), RETRY_DELAY);
                    } else {
                        // 尝试使用缓存
                        const cachedData = uni.getStorageSync('holidayCache');
                        if (cachedData) {
                            resolve(cachedData);
                        } else {
                            reject({
                                code: -1,
                                message: '节假日API请求失败',
                                detail: err
                            });
                        }
                    }
                }
            });
        };

        makeRequest();
    });
};

// 添加统一的错误处理函数
const handleApiError = (error) => {
    if (error.statusCode === 401 || (error.data && error.data.code === 401)) {
        uni.showToast({
            title: 'API授权已过期，请等待开发者更新',
            icon: 'none',
            duration: 3000
        });
        throw { code: 401, message: 'API授权已过期' };
    }
    throw error;
};

// 买什么接口
const getShoppingAdvice = (query, maxPrice, minPrice, location = '') => {
    return new Promise((resolve, reject) => {
        // 参数验证
        if (!query || !maxPrice || !minPrice) {
            reject({
                code: -1,
                message: '请填写完整的查询信息'
            });
            return;
        }

        uni.request({
            url: 'https://api.coze.cn/v1/workflow/run',
            method: 'POST',
            header: {
                'Authorization': 'Bearer pat_0xvh1L4lHPEiozeyZ0u9TnnVwD4cO8GkaM87ceE4z5is1uIuydjQ4AnzsIpgNFoV',
                'Content-Type': 'application/json'
            },
            data: {
                "workflow_id": "7450799344502423603",
                "parameters": {
                    "query": query,
                    "max_price": maxPrice,
                    "min_price": minPrice,
                    "location": location
                }
            },
            success: (res) => {
                if (res.data.code === 0) {
                    try {
                        // 直接返回数据，不进行JSON解析
                        resolve(res.data.data);
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

// 和风天气API接口
const QWEATHER_KEY = '7fdcb07d68dc4296bd06970b643ec23a';

const getQWeather = (location) => {
    return new Promise((resolve, reject) => {
        // 先检查缓存
        const cachedData = getCachedData('weatherCache');
        if (cachedData) {
            resolve(cachedData);
            return;
        }

        uni.request({
            url: 'https://devapi.qweather.com/v7/weather/now',
            method: 'GET',
            data: {
                location: location || '101010100',
                key: QWEATHER_KEY
            },
            success: (res) => {
                if (res.statusCode === 200 && res.data.code === '200') {
                    try {
                        // 缓存数据
                        uni.setStorageSync('weatherCache', res.data);
                        uni.setStorageSync('weatherCache_time', Date.now());
                        resolve(res.data);
                    } catch (error) {
                        console.error('缓存天气数据失败:', error);
                        resolve(res.data); // 即使缓存失败也返回数据
                    }
                } else {
                    reject({
                        code: -1,
                        message: res.data.code || '获取天气数据失败'
                    });
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
};

// 和风天气城市查询接口
const getLocationId = (longitude, latitude) => {
    return new Promise((resolve, reject) => {
        // 先检查缓存
        const cachedLocation = getCachedData('locationCache');
        if (cachedLocation) {
            resolve(cachedLocation);
            return;
        }

        uni.request({
            url: 'https://geoapi.qweather.com/v2/city/lookup',
            method: 'GET',
            data: {
                location: `${longitude},${latitude}`,
                key: QWEATHER_KEY
            },
            success: (res) => {
                if (res.statusCode === 200 && res.data.code === '200' && res.data.location?.[0]) {
                    try {
                        // 缓存数据
                        uni.setStorageSync('locationCache', res.data.location[0]);
                        uni.setStorageSync('locationCache_time', Date.now());
                        resolve(res.data.location[0]);
                    } catch (error) {
                        console.error('缓存位置数据失败:', error);
                        resolve(res.data.location[0]); // 即使缓存失败也返回数据
                    }
                } else {
                    reject({
                        code: -1,
                        message: res.data.code || '获取城市信息失败'
                    });
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
};

// 待办事项分析接口
const analyzeTodoList = (input) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: 'https://api.coze.cn/v1/workflow/run',
            method: 'POST',
            header: {
                'Authorization': 'Bearer pat_0xvh1L4lHPEiozeyZ0u9TnnVwD4cO8GkaM87ceE4z5is1uIuydjQ4AnzsIpgNFoV',
                'Content-Type': 'application/json'
            },
            data: {
                "workflow_id": "7473912204761677875",
                "parameters": {
                    "input": input
                }
            },
            success: (res) => {
                if (res.data.code === 0) {
                    try {
                        // 解析返回的数据
                        const todoData = JSON.parse(res.data.data);
                        resolve(todoData);
                    } catch (error) {
                        reject({
                            code: -1,
                            message: '数据解析失败'
                        });
                    }
                } else {
                    reject({
                        code: -1,
                        message: res.data.msg || '待办事项分析失败'
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
    getWeatherReport,
    getBookRecommend,
    translateText,
    getMovieData,
    getHolidayData,
    getShoppingAdvice,
    getQWeather,
    getLocationId,
    analyzeTodoList,
    QWEATHER_KEY
}