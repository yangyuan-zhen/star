"use strict";
const common_vendor = require("../../common/vendor.js");
const api_search = require("../../api/search.js");
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
      if (translatedText.value) {
        common_vendor.index.showToast({
          title: "请清空输入框再翻译",
          icon: "none"
        });
        return;
      }
      isLoading.value = true;
      try {
        const result = await api_search.translateText(inputText.value);
        translatedText.value = result.output;
        console.log(result);
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
    const processedTranslation = common_vendor.computed(() => {
      if (!translatedText.value)
        return { translation: "", vocabulary: [] };
      const lines = translatedText.value.split("\n").filter((line) => line.trim());
      const translation = lines[0].trim();
      const vocabularyStartIndex = lines.findIndex(
        (line) => line.includes("重点词汇分析")
      );
      const vocabularyLines = lines.slice(vocabularyStartIndex + 1);
      const vocabulary = vocabularyLines.filter((line) => line.startsWith("-")).map((line) => {
        const content = line.replace("-", "").trim();
        const mainParts = content.split("：");
        const word = mainParts[0].trim();
        const explanation = mainParts[1].trim();
        return { word, explanation };
      });
      return { translation, vocabulary };
    });
    return (_ctx, _cache) => {
      var _a, _b;
      return common_vendor.e({
        a: -1,
        b: inputText.value,
        c: common_vendor.o(($event) => inputText.value = $event.detail.value),
        d: common_vendor.o(clearInput),
        e: common_vendor.o(handleTranslate),
        f: !translatedText.value
      }, !translatedText.value ? {} : common_vendor.e({
        g: common_vendor.t(processedTranslation.value.translation),
        h: (_a = processedTranslation.value.vocabulary) == null ? void 0 : _a.length
      }, ((_b = processedTranslation.value.vocabulary) == null ? void 0 : _b.length) ? {
        i: common_vendor.f(processedTranslation.value.vocabulary, (item, index, i0) => {
          return {
            a: common_vendor.t(item.word),
            b: common_vendor.t(item.explanation),
            c: index
          };
        })
      } : {}), {
        j: isLoading.value
      }, isLoading.value ? {} : {});
    };
  }
};
_sfc_main.__runtimeHooks = 6;
wx.createPage(_sfc_main);
