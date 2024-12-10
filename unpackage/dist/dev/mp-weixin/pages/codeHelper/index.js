"use strict";
const common_vendor = require("../../common/vendor.js");
const api_search = require("../../api/search.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const userInput = common_vendor.ref("");
    const suggestion = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    common_vendor.watch(userInput, (newVal) => {
      if (!newVal.trim() && suggestion.value) {
        common_vendor.index.showModal({
          title: "提示",
          content: "是否清除当前的建议内容？",
          success: function(res) {
            if (res.confirm) {
              suggestion.value = "";
            }
          }
        });
      }
    });
    const handleGetSuggestion = async () => {
      if (!userInput.value.trim()) {
        common_vendor.index.showToast({
          title: "请输入开发需求",
          icon: "none"
        });
        return;
      }
      loading.value = true;
      try {
        const result = await api_search.getCodeSuggestion(userInput.value);
        console.log("API返回结果:", result);
        if (result && result.data) {
          const parsedData = JSON.parse(result.data);
          if (parsedData && parsedData.output) {
            suggestion.value = String(parsedData.output);
            console.log("处理后的suggestion:", suggestion.value);
          }
        } else {
          console.error("Unexpected result type:", result);
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "获取建议失败",
          icon: "none"
        });
        console.error(error);
      } finally {
        loading.value = false;
      }
    };
    const renderedMarkdown = common_vendor.computed(() => {
      if (!suggestion.value)
        return "";
      try {
        common_vendor.marked.setOptions({
          gfm: true,
          breaks: true,
          sanitize: true
        });
        return common_vendor.marked(String(suggestion.value));
      } catch (error) {
        console.error("Markdown渲染错误:", error);
        return String(suggestion.value);
      }
    });
    const copyText = async () => {
      try {
        await common_vendor.index.setClipboardData({
          data: suggestion.value,
          success: () => {
            common_vendor.index.showToast({
              title: "复制成功",
              icon: "success",
              duration: 1500
            });
          }
        });
      } catch (error) {
        console.error("复制失败:", error);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: userInput.value,
        b: common_vendor.o(($event) => userInput.value = $event.detail.value),
        c: common_vendor.o(handleGetSuggestion),
        d: loading.value,
        e: !suggestion.value
      }, !suggestion.value ? {} : {}, {
        f: suggestion.value
      }, suggestion.value ? {
        g: common_vendor.o(copyText),
        h: renderedMarkdown.value
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-62afe2d4"]]);
wx.createPage(MiniProgramPage);
