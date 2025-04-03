"use strict";
const common_vendor = require("../common/vendor.js");
require("../common/vendor.js");
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
exports.getBookRecommend = getBookRecommend;
exports.getMovieData = getMovieData;
exports.getShoppingAdvice = getShoppingAdvice;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/search.js.map
