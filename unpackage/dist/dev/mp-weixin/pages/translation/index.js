"use strict";
const common_vendor = require("../../common/vendor.js");
const api_search = require("../../api/search.js");
if (!Math) {
  common_vendor.unref(common_vendor.Icon)();
}
const _sfc_main = {
  __name: "index",
  setup(__props, { expose: __expose }) {
    const inputText = common_vendor.ref("");
    const translatedText = common_vendor.ref("");
    const isLoading = common_vendor.ref(false);
    const shareInfo = {
      title: "AI智能翻译助手",
      path: "/pages/translation/index",
      imageUrl: "",
      // 可以添加分享图片的路径
      desc: "支持多语言智能翻译"
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
        // 可选：分享时携带的查询参数
      };
    };
    __expose({
      onShareAppMessage,
      onShareTimeline
    });
    const handleTranslate = async () => {
      if (!inputText.value.trim()) {
        common_vendor.index.showToast({
          title: "请输入要翻译的内容",
          icon: "none"
        });
        return;
      }
      isLoading.value = true;
      try {
        const result = await api_search.translateText(inputText.value);
        translatedText.value = result.output;
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "翻译失败，请稍后重试",
          icon: "none"
        });
      } finally {
        isLoading.value = false;
      }
    };
    const clearInput = () => {
      inputText.value = "";
      translatedText.value = "";
    };
    const copyResult = () => {
      if (!translatedText.value)
        return;
      common_vendor.index.setClipboardData({
        data: translatedText.value,
        success: () => {
          common_vendor.index.showToast({
            title: "已复制到剪贴板",
            icon: "success"
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: -1,
        b: inputText.value,
        c: common_vendor.o(($event) => inputText.value = $event.detail.value),
        d: common_vendor.p({
          icon: "material-symbols:delete-outline"
        }),
        e: common_vendor.o(clearInput),
        f: common_vendor.p({
          icon: "material-symbols:translate"
        }),
        g: common_vendor.o(handleTranslate),
        h: translatedText.value
      }, translatedText.value ? {
        i: common_vendor.p({
          icon: "material-symbols:description-outline"
        }),
        j: common_vendor.t(translatedText.value),
        k: common_vendor.o(copyResult)
      } : {}, {
        l: isLoading.value
      }, isLoading.value ? {
        m: common_vendor.p({
          icon: "line-md:loading-loop"
        })
      } : {});
    };
  }
};
_sfc_main.__runtimeHooks = 6;
wx.createPage(_sfc_main);
