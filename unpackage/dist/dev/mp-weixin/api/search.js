"use strict";
const common_vendor = require("../common/vendor.js");
require("../common/vendor.js");
const CACHE_DURATION = 5 * 60 * 1e3;
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
        "Authorization": "Bearer pat_Ne72TLPjTvO2VU11SoIFPHwb3aDiR5CJHrMQTca061xHVpEmMobEGrRBsUAOZ1E0",
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
        "Authorization": "Bearer pat_Ne72TLPjTvO2VU11SoIFPHwb3aDiR5CJHrMQTca061xHVpEmMobEGrRBsUAOZ1E0",
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
        "Authorization": "Bearer pat_Ne72TLPjTvO2VU11SoIFPHwb3aDiR5CJHrMQTca061xHVpEmMobEGrRBsUAOZ1E0",
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
          console.log("API响应:", res);
          if (res.statusCode === 200 && res.data) {
            try {
              common_vendor.index.setStorageSync("movieCache", res.data);
              common_vendor.index.setStorageSync("movieCacheTime", Date.now());
            } catch (e) {
              console.error("缓存数据失败:", e);
            }
            resolve(res.data);
          } else {
            const cachedData = common_vendor.index.getStorageSync("movieCache");
            if (cachedData) {
              console.log("使用缓存数据");
              resolve(cachedData);
            } else if (retryCount < 2) {
              console.log(`重试请求 ${retryCount + 1}`);
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
          console.error("请求失败详情:", err);
          const cachedData = common_vendor.index.getStorageSync("movieCache");
          if (cachedData) {
            console.log("使用缓存数据");
            resolve(cachedData);
          } else if (retryCount < 2) {
            console.log(`重试请求 ${retryCount + 1}`);
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
    common_vendor.index.request({
      url: `https://timor.tech/api/holiday/year/${(/* @__PURE__ */ new Date()).getFullYear()}`,
      method: "GET",
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          try {
            common_vendor.index.setStorageSync("holidayCache", res.data);
            common_vendor.index.setStorageSync("holidayCache_time", Date.now());
          } catch (e) {
            console.error("缓存节假日数据失败:", e);
          }
          resolve(res.data);
        } else {
          const cachedData2 = common_vendor.index.getStorageSync("holidayCache");
          if (cachedData2) {
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
        console.error("请求失败详情:", err);
        const cachedData2 = common_vendor.index.getStorageSync("holidayCache");
        if (cachedData2) {
          resolve(cachedData2);
        } else {
          reject({
            code: -1,
            message: "请求失败",
            detail: err
          });
        }
      }
    });
  });
};
const getShoppingAdvice = (query, maxPrice, minPrice) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: "https://api.coze.cn/v1/workflow/run",
      method: "POST",
      header: {
        "Authorization": "Bearer pat_Ne72TLPjTvO2VU11SoIFPHwb3aDiR5CJHrMQTca061xHVpEmMobEGrRBsUAOZ1E0",
        "Content-Type": "application/json"
      },
      data: {
        workflow_id: "7450799344502423603",
        parameters: {
          query,
          max_price: maxPrice,
          min_price: minPrice
        }
      },
      success: (res) => {
        if (res.statusCode === 401 || res.data && res.data.code === 401) {
          common_vendor.index.showToast({
            title: "API授权已过期，请等待开发者更新",
            icon: "none",
            duration: 3e3
          });
          reject({ code: 401, message: "API授权已过期" });
          return;
        }
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
exports.getBookRecommend = getBookRecommend;
exports.getHolidayData = getHolidayData;
exports.getMovieData = getMovieData;
exports.getShoppingAdvice = getShoppingAdvice;
exports.getWeatherReport = getWeatherReport;
exports.translateText = translateText;
