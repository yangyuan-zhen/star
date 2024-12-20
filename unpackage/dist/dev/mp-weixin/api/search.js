"use strict";
const common_vendor = require("../common/vendor.js");
require("../common/vendor.js");
const getLastRequestTime = () => {
  return common_vendor.index.getStorageSync("lastRequestTime") || 0;
};
const setLastRequestTime = (time) => {
  common_vendor.index.setStorageSync("lastRequestTime", time);
};
const INTERVAL = 5 * 1e3;
const CACHE_DURATION = 5 * 60 * 1e3;
const getCachedData = (key) => {
  const data = common_vendor.index.getStorageSync(key);
  const time = common_vendor.index.getStorageSync(`${key}_time`);
  if (data && time && Date.now() - time < CACHE_DURATION) {
    return data;
  }
  return null;
};
const searchResources = () => {
  return new Promise((resolve, reject) => {
    const now = Date.now();
    const lastTime = getLastRequestTime();
    if (now - lastTime < INTERVAL) {
      const remainingTime = Math.ceil((INTERVAL - (now - lastTime)) / 1e3);
      reject({
        code: -1,
        message: `请稍后再试（${remainingTime}秒）`
      });
      return;
    }
    setLastRequestTime(now);
    common_vendor.index.request({
      url: "https://cn.apihz.cn/api/xinwen/baidu.php",
      method: "GET",
      data: {
        id: "88888888",
        key: "88888888"
      },
      success: (res) => {
        if (res.data.code === 200) {
          common_vendor.index.setStorageSync("newsCache", res.data);
          common_vendor.index.setStorageSync("newsCacheTime", now);
          resolve(res.data);
        } else {
          const cachedData = common_vendor.index.getStorageSync("newsCache");
          if (cachedData) {
            resolve(cachedData);
          } else {
            reject(res.data);
          }
        }
      },
      fail: (err) => {
        const cachedData = common_vendor.index.getStorageSync("newsCache");
        if (cachedData) {
          resolve(cachedData);
        } else {
          reject(err);
        }
      }
    });
  });
};
const getWeatherReport = (city) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: "https://api.coze.cn/v1/workflow/run",
      method: "POST",
      header: {
        "Authorization": "Bearer pat_TZ96143O1vNGqfgnwi9uM2TmigogOxdjibiYh5xCCAkOdZW7Bd75iRRO1wJF9T65",
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
        "Authorization": "Bearer pat_TZ96143O1vNGqfgnwi9uM2TmigogOxdjibiYh5xCCAkOdZW7Bd75iRRO1wJF9T65",
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
        "Authorization": "Bearer pat_TZ96143O1vNGqfgnwi9uM2TmigogOxdjibiYh5xCCAkOdZW7Bd75iRRO1wJF9T65",
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
const COZE_API_CONFIG = {
  url: "https://api.coze.cn/v1/workflow/run",
  workflowId: "7446309388979290151",
  token: "pat_TZ96143O1vNGqfgnwi9uM2TmigogOxdjibiYh5xCCAkOdZW7Bd75iRRO1wJF9T65"
};
const getCodeSuggestion = (userInput) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: COZE_API_CONFIG.url,
      method: "POST",
      header: {
        Authorization: `Bearer ${COZE_API_CONFIG.token}`,
        "Content-Type": "application/json"
      },
      data: {
        workflow_id: COZE_API_CONFIG.workflowId,
        parameters: {
          BOT_USER_INPUT: userInput
        }
      },
      success: (res) => {
        resolve(res.data);
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
exports.getBookRecommend = getBookRecommend;
exports.getCodeSuggestion = getCodeSuggestion;
exports.getHolidayData = getHolidayData;
exports.getMovieData = getMovieData;
exports.getWeatherReport = getWeatherReport;
exports.searchResources = searchResources;
exports.translateText = translateText;
