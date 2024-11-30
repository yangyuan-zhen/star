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
const historyToday = () => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: "https://www.mxnzp.com/api/history/today",
      method: "GET",
      data: {
        type: 0,
        app_id: "0amkrpktjgnqorxr",
        app_secret: "1W9TGrscBM21Vqu4rsTQK2c8PbY0kRdM"
      },
      success: (res) => {
        if (res.data.code === 1) {
          const formattedData = {
            code: 1,
            data: res.data.data.map((item) => ({
              year: item.year,
              month: item.month,
              day: item.day,
              title: item.title,
              picUrl: item.picUrl || ""
            }))
          };
          resolve(formattedData);
        } else {
          reject({
            code: -1,
            message: res.data.msg || "获取数据失败"
          });
        }
      },
      fail: (err) => {
        reject(err);
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
exports.getWeatherReport = getWeatherReport;
exports.historyToday = historyToday;
exports.searchResources = searchResources;
