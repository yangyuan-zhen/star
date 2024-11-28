"use strict";
const common_vendor = require("../common/vendor.js");
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
const videoResources = () => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: "https://api.kuleu.com/api/xjj?type=json",
      method: "GET",
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
exports.searchResources = searchResources;
exports.videoResources = videoResources;
