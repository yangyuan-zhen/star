"use strict";
const common_vendor = require("../../common/vendor.js");
const api_search = require("../../api/search.js");
if (!Math) {
  PageLoading();
}
const PageLoading = () => "../../components/page-loading/page-loading.js";
const _sfc_main = {
  __name: "index",
  setup(__props, { expose: __expose }) {
    const newsList = common_vendor.ref([]);
    const isLoading = common_vendor.ref(false);
    const isPageLoading = common_vendor.ref(true);
    const shareInfo = {
      title: "实时热搜榜",
      path: "/pages/index/index",
      imageUrl: "",
      // 可以添加分享图片的路径
      desc: "查看最新热搜话题"
    };
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
          newsList.value = response.data.map((item) => ({
            ...item,
            isExpanded: false
          }));
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "获取热榜失败，请稍后重试",
          icon: "none",
          duration: 2e3
        });
      } finally {
        isLoading.value = false;
        isPageLoading.value = false;
        common_vendor.index.stopPullDownRefresh();
      }
    };
    const handleNewsClick = (item) => {
      common_vendor.index.setClipboardData({
        data: item.url,
        success: () => {
          common_vendor.index.showModal({
            title: "提示",
            content: "链接已复制到剪贴板。由于微信小程序政策限制，个人小程序不支持直接打开网页，请在浏览器中粘贴链接查看。",
            showCancel: false,
            confirmText: "我知道了"
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
    const toggleExpand = (index) => {
      newsList.value[index] = {
        ...newsList.value[index],
        isExpanded: !newsList.value[index].isExpanded
      };
    };
    const onShareAppMessage = () => {
      return {
        title: shareInfo.title,
        path: shareInfo.path,
        imageUrl: shareInfo.imageUrl,
        desc: shareInfo.desc
      };
    };
    const onShareTimeline = () => {
      return {
        title: shareInfo.title,
        path: shareInfo.path,
        imageUrl: shareInfo.imageUrl,
        query: ""
        // 可选：分享��携带的查询参数
      };
    };
    common_vendor.onMounted(() => {
      Promise.all([
        fetchNews(),
        new Promise((resolve) => setTimeout(resolve, 1500))
      ]).then(() => {
        isPageLoading.value = false;
      });
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
      },
      onShareAppMessage,
      onShareTimeline
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          show: isPageLoading.value,
          title: "热搜榜"
        }),
        b: common_vendor.f(newsList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(index + 1),
            b: index < 3 ? 1 : "",
            c: item.isExpanded ? 1 : "",
            d: common_vendor.o(($event) => toggleExpand(index), index),
            e: common_vendor.t(item.word),
            f: common_vendor.t(formatHotScore(item.hotScore)),
            g: item.hotTagImg
          }, item.hotTagImg ? {
            h: item.hotTagImg
          } : {}, {
            i: item.img
          }, item.img ? {
            j: item.img
          } : {}, {
            k: common_vendor.o(($event) => handleNewsClick(item), index),
            l: item.isExpanded
          }, item.isExpanded ? {
            m: common_vendor.t(item.desc || "暂无描述")
          } : {}, {
            n: index,
            o: item.isExpanded ? 1 : ""
          });
        }),
        c: !isPageLoading.value
      };
    };
  }
};
_sfc_main.__runtimeHooks = 6;
wx.createPage(_sfc_main);
