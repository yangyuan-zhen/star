"use strict";
const common_vendor = require("../common/vendor.js");
require("../common/vendor.js");
const CACHE_DURATION = 5 * 60 * 1e3;
const RETRY_TIMES = 2;
const RETRY_DELAY = 1e3;
const getCachedData = (key) => {
  const data = common_vendor.index.getStorageSync(key);
  const time = common_vendor.index.getStorageSync(`${key}_time`);
  if (data && time && Date.now() - time < CACHE_DURATION) {
    return data;
  }
  return null;
};
const getWeatherReport = (city) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: "https://api.coze.cn/v1/workflow/run",
      method: "POST",
      header: {
        "Authorization": "Bearer pat_0xvh1L4lHPEiozeyZ0u9TnnVwD4cO8GkaM87ceE4z5is1uIuydjQ4AnzsIpgNFoV",
        "Content-Type": "application/json"
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
            const weatherData = JSON.parse(res.data.data);
            resolve(weatherData);
          } catch (error) {
            reject({
              code: -1,
              message: "数据解析失败"
            });
          }
        } else {
          reject({
            code: -1,
            message: res.data.msg || "获取天气数据失败"
          });
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
const getBookRecommend = (bookName) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: "https://api.coze.cn/v1/workflow/run",
      method: "POST",
      header: {
        "Authorization": "Bearer pat_0xvh1L4lHPEiozeyZ0u9TnnVwD4cO8GkaM87ceE4z5is1uIuydjQ4AnzsIpgNFoV",
        "Content-Type": "application/json"
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
            const bookData = JSON.parse(res.data.data);
            resolve(bookData);
          } catch (error) {
            reject({
              code: -1,
              message: "数据解析失败"
            });
          }
        } else {
          reject({
            code: -1,
            message: res.data.msg || "获取图书推荐失败"
          });
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
const translateText = (text) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: "https://api.coze.cn/v1/workflow/run",
      method: "POST",
      header: {
        "Authorization": "Bearer pat_0xvh1L4lHPEiozeyZ0u9TnnVwD4cO8GkaM87ceE4z5is1uIuydjQ4AnzsIpgNFoV",
        "Content-Type": "application/json"
      },
      data: {
        workflow_id: "7445294801782259738",
        parameters: {
          BOT_USER_INPUT: text
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
              message: "数据解析失败"
            });
          }
        } else {
          reject({
            code: -1,
            message: res.data.msg || "翻译失败"
          });
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
const getMovieData = () => {
  return new Promise((resolve, reject) => {
    const makeRequest = (retryCount = 0) => {
      common_vendor.index.request({
        url: "https://www.cikeee.cc/api",
        method: "GET",
        timeout: 1e4,
        header: {
          "Cookie": "PHPSESSID=caf3224b23f7ae7b415701a1872652bc"
        },
        data: {
          app_key: "pub_23020990025",
          t: Date.now()
        },
        success: (res) => {
          common_vendor.index.__f__("log", "at api/search.js:173", "API响应:", res);
          if (res.statusCode === 200 && res.data) {
            try {
              common_vendor.index.setStorageSync("movieCache", res.data);
              common_vendor.index.setStorageSync("movieCacheTime", Date.now());
            } catch (e) {
              common_vendor.index.__f__("error", "at api/search.js:180", "缓存数据失败:", e);
            }
            resolve(res.data);
          } else {
            const cachedData = common_vendor.index.getStorageSync("movieCache");
            if (cachedData) {
              common_vendor.index.__f__("log", "at api/search.js:187", "使用缓存数据");
              resolve(cachedData);
            } else if (retryCount < 2) {
              common_vendor.index.__f__("log", "at api/search.js:190", `重试请求 ${retryCount + 1}`);
              setTimeout(() => makeRequest(retryCount + 1), 1e3);
            } else {
              reject({
                code: -1,
                message: "获取电影数据失败",
                detail: res
              });
            }
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at api/search.js:202", "请求失败详情:", err);
          const cachedData = common_vendor.index.getStorageSync("movieCache");
          if (cachedData) {
            common_vendor.index.__f__("log", "at api/search.js:205", "使用缓存数据");
            resolve(cachedData);
          } else if (retryCount < 2) {
            common_vendor.index.__f__("log", "at api/search.js:208", `重试请求 ${retryCount + 1}`);
            setTimeout(() => makeRequest(retryCount + 1), 1e3);
          } else {
            reject({
              code: -1,
              message: "请求失败",
              detail: err
            });
          }
        }
      });
    };
    makeRequest();
  });
};
const getHolidayData = () => {
  return new Promise((resolve, reject) => {
    const cachedData = getCachedData("holidayCache");
    if (cachedData) {
      resolve(cachedData);
      return;
    }
    const makeRequest = (retryCount = 0) => {
      common_vendor.index.request({
        url: `https://timor.tech/api/holiday/year/${(/* @__PURE__ */ new Date()).getFullYear()}`,
        method: "GET",
        timeout: 1e4,
        // 添加超时设置
        success: (res) => {
          common_vendor.index.__f__("log", "at api/search.js:241", "节假日API响应:", res);
          if (res.statusCode === 200 && res.data && res.data.code === 0) {
            try {
              common_vendor.index.setStorageSync("holidayCache", res.data);
              common_vendor.index.setStorageSync("holidayCache_time", Date.now());
              resolve(res.data);
            } catch (e) {
              common_vendor.index.__f__("error", "at api/search.js:248", "缓存节假日数据失败:", e);
              resolve(res.data);
            }
          } else if (retryCount < RETRY_TIMES) {
            common_vendor.index.__f__("log", "at api/search.js:252", `节假日API重试 ${retryCount + 1}`);
            setTimeout(() => makeRequest(retryCount + 1), RETRY_DELAY);
          } else {
            const cachedData2 = common_vendor.index.getStorageSync("holidayCache");
            if (cachedData2) {
              common_vendor.index.__f__("log", "at api/search.js:258", "使用已缓存的节假日数据");
              resolve(cachedData2);
            } else {
              reject({
                code: -1,
                message: "获取节假日数据失败",
                detail: res
              });
            }
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at api/search.js:270", "节假日API请求失败:", err);
          if (retryCount < RETRY_TIMES) {
            setTimeout(() => makeRequest(retryCount + 1), RETRY_DELAY);
          } else {
            const cachedData2 = common_vendor.index.getStorageSync("holidayCache");
            if (cachedData2) {
              resolve(cachedData2);
            } else {
              reject({
                code: -1,
                message: "节假日API请求失败",
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
const getShoppingAdvice = (query, maxPrice, minPrice, location = "") => {
  return new Promise((resolve, reject) => {
    if (!query || !maxPrice || !minPrice) {
      reject({
        code: -1,
        message: "请填写完整的查询信息"
      });
      return;
    }
    common_vendor.index.request({
      url: "https://api.coze.cn/v1/workflow/run",
      method: "POST",
      header: {
        "Authorization": "Bearer pat_0xvh1L4lHPEiozeyZ0u9TnnVwD4cO8GkaM87ceE4z5is1uIuydjQ4AnzsIpgNFoV",
        "Content-Type": "application/json"
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
            resolve(res.data.data);
          } catch (error) {
            reject({
              code: -1,
              message: "数据解析失败"
            });
          }
        } else {
          reject({
            code: -1,
            message: res.data.msg || "获取购物建议失败"
          });
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
const QWEATHER_KEY = "7fdcb07d68dc4296bd06970b643ec23a";
const getQWeather = (location) => {
  return new Promise((resolve, reject) => {
    const cachedData = getCachedData("weatherCache");
    if (cachedData) {
      resolve(cachedData);
      return;
    }
    common_vendor.index.request({
      url: "https://devapi.qweather.com/v7/weather/now",
      method: "GET",
      data: {
        location: location || "101010100",
        key: QWEATHER_KEY
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === "200") {
          try {
            common_vendor.index.setStorageSync("weatherCache", res.data);
            common_vendor.index.setStorageSync("weatherCache_time", Date.now());
            resolve(res.data);
          } catch (error) {
            common_vendor.index.__f__("error", "at api/search.js:387", "缓存天气数据失败:", error);
            resolve(res.data);
          }
        } else {
          reject({
            code: -1,
            message: res.data.code || "获取天气数据失败"
          });
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
const getLocationId = (longitude, latitude) => {
  return new Promise((resolve, reject) => {
    const cachedLocation = getCachedData("locationCache");
    if (cachedLocation) {
      resolve(cachedLocation);
      return;
    }
    common_vendor.index.request({
      url: "https://geoapi.qweather.com/v2/city/lookup",
      method: "GET",
      data: {
        location: `${longitude},${latitude}`,
        key: QWEATHER_KEY
      },
      success: (res) => {
        var _a;
        if (res.statusCode === 200 && res.data.code === "200" && ((_a = res.data.location) == null ? void 0 : _a[0])) {
          try {
            common_vendor.index.setStorageSync("locationCache", res.data.location[0]);
            common_vendor.index.setStorageSync("locationCache_time", Date.now());
            resolve(res.data.location[0]);
          } catch (error) {
            common_vendor.index.__f__("error", "at api/search.js:429", "缓存位置数据失败:", error);
            resolve(res.data.location[0]);
          }
        } else {
          reject({
            code: -1,
            message: res.data.code || "获取城市信息失败"
          });
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
const analyzeTodoList = (input) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: "https://api.coze.cn/v1/workflow/run",
      method: "POST",
      header: {
        "Authorization": "Bearer pat_0xvh1L4lHPEiozeyZ0u9TnnVwD4cO8GkaM87ceE4z5is1uIuydjQ4AnzsIpgNFoV",
        "Content-Type": "application/json"
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
            const todoData = JSON.parse(res.data.data);
            resolve(todoData);
          } catch (error) {
            reject({
              code: -1,
              message: "数据解析失败"
            });
          }
        } else {
          reject({
            code: -1,
            message: res.data.msg || "待办事项分析失败"
          });
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
exports.analyzeTodoList = analyzeTodoList;
exports.getBookRecommend = getBookRecommend;
exports.getHolidayData = getHolidayData;
exports.getLocationId = getLocationId;
exports.getMovieData = getMovieData;
exports.getQWeather = getQWeather;
exports.getShoppingAdvice = getShoppingAdvice;
exports.getWeatherReport = getWeatherReport;
exports.translateText = translateText;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/search.js.map
