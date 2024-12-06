"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const inputText = common_vendor.ref("");
    const translatedText = common_vendor.ref("");
    const isLoading = common_vendor.ref(false);
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
        const response = await common_vendor.index.request({
          url: "https://api.coze.cn/v1/workflow/run",
          method: "POST",
          header: {
            Authorization: "Bearer pat_TZ96143O1vNGqfgnwi9uM2TmigogOxdjibiYh5xCCAkOdZW7Bd75iRRO1wJF9T65",
            "Content-Type": "application/json"
          },
          data: {
            workflow_id: "7445294801782259738",
            parameters: {
              BOT_USER_INPUT: inputText.value
            }
          }
        });
        if (response.data.code === 0) {
          const result = JSON.parse(response.data.data);
          translatedText.value = result.output;
        } else {
          throw new Error("翻译失败");
        }
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
        d: common_vendor.o(clearInput),
        e: common_vendor.o(handleTranslate),
        f: translatedText.value
      }, translatedText.value ? {
        g: common_vendor.t(translatedText.value),
        h: common_vendor.o(copyResult)
      } : {}, {
        i: isLoading.value
      }, isLoading.value ? {} : {});
    };
  }
};
wx.createPage(_sfc_main);
