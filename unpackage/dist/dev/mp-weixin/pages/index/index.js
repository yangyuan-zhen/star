"use strict";
const common_vendor = require("../../common/vendor.js");
const api_search = require("../../api/search.js");
const _sfc_main = {
  __name: "index",
  setup(__props, { expose: __expose }) {
    const newsList = common_vendor.ref([]);
    const isLoading = common_vendor.ref(false);
    const checkLastFetchTime = () => {
      const lastFetchTime = common_vendor.index.getStorageSync("lastFetchTime");
      const currentTime = (/* @__PURE__ */ new Date()).getTime();
      if (!lastFetchTime || currentTime - lastFetchTime > 24 * 60 * 60 * 1e3) {
        common_vendor.index.setStorageSync("lastFetchTime", currentTime);
        return true;
      }
      return false;
    };
    const fetchNews = async () => {
      if (isLoading.value)
        return;
      isLoading.value = true;
      try {
        const response = await api_search.searchResources();
        if (response.code === 200) {
          newsList.value = response.data;
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "获取热榜失败，请稍后重试",
          icon: "none",
          duration: 2e3
        });
      } finally {
        isLoading.value = false;
        common_vendor.index.stopPullDownRefresh();
      }
    };
    const handleNewsClick = (item) => {
      common_vendor.index.setClipboardData({
        data: item.url,
        success: function() {
          common_vendor.index.showModal({
            title: "提示",
            content: "链接已复制，请在浏览器中打开",
            showCancel: false
          });
        }
      });
    };
    const formatHotScore = (score) => {
      const num = parseInt(score);
      if (num >= 1e4) {
        return (num / 1e4).toFixed(1) + "万";
      }
      return score;
    };
    common_vendor.onMounted(() => {
      fetchNews();
    });
    __expose({
      onPullDownRefresh() {
        if (checkLastFetchTime()) {
          fetchNews();
        } else {
          common_vendor.index.showToast({
            title: "请稍后再试",
            icon: "none"
          });
          common_vendor.index.stopPullDownRefresh();
        }
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(newsList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(index + 1),
            b: common_vendor.t(item.word),
            c: common_vendor.t(formatHotScore(item.hotScore)),
            d: item.hotTagImg
          }, item.hotTagImg ? {
            e: item.hotTagImg
          } : {}, {
            f: item.img
          }, item.img ? {
            g: item.img
          } : {}, {
            h: index,
            i: common_vendor.o(($event) => handleNewsClick(item), index)
          });
        }),
        b: isLoading.value
      }, isLoading.value ? {} : {});
    };
  }
};
wx.createPage(_sfc_main);
