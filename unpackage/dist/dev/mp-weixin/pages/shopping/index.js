"use strict";
const common_vendor = require("../../common/vendor.js");
const api_search = require("../../api/search.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
if (!Math) {
  (common_vendor.unref(common_vendor.Icon) + _easycom_uni_icons)();
}
const _sfc_main = {
  __name: "index",
  setup(__props, { expose: __expose }) {
    const query = common_vendor.ref("");
    const minPrice = common_vendor.ref("");
    const maxPrice = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const result = common_vendor.ref(null);
    const showResults = common_vendor.ref(false);
    const getAdvice = async () => {
      try {
        loading.value = true;
        const res = await api_search.getShoppingAdvice(
          query.value,
          maxPrice.value,
          minPrice.value
        );
        result.value = res;
        if (parsedResults.value.length > 0) {
          showResults.value = true;
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "获取建议失败",
          icon: "error"
        });
      } finally {
        loading.value = false;
      }
    };
    common_vendor.onUnmounted(() => {
    });
    const onShareAppMessage = () => {
      return {
        title: "买什么 - AI智能购物建议",
        path: "/pages/shopping/index",
        imageUrl: ""
        // 如果有分享图片的话
      };
    };
    const onShareTimeline = () => {
      return {
        title: "买什么 - AI智能购物建议",
        query: "/pages/shopping/index",
        // 分享链接
        imageUrl: ""
        // 如果有分享图片的话
      };
    };
    __expose({
      onShareAppMessage,
      onShareTimeline
    });
    const parsedResults = common_vendor.computed(() => {
      if (!result.value)
        return [];
      try {
        const outputText = result.value.output || "";
        const products = outputText.split("\n\n").slice(1).filter(Boolean);
        const results = products.map((product) => {
          const nameMatch = product.match(/商品名称：([^\n]+)/);
          const priceMatch = product.match(/价格：([^\n]+)/);
          const channelMatch = product.match(/购买渠道：([^\n]+)/);
          const worthMatch = product.match(/是否值得购买：([^\n]+)/);
          if (nameMatch && priceMatch && channelMatch) {
            return {
              name: nameMatch[1].trim().replace(/🛍️\s*/, ""),
              price: priceMatch[1].trim().replace(/💲\s*/, ""),
              channel: channelMatch[1].trim().replace(/🛒\s*/, ""),
              worth: worthMatch ? worthMatch[1].trim().replace(/⭐\s*/, "") : "暂无评估"
            };
          }
          return null;
        }).filter(Boolean);
        return results;
      } catch (error) {
        return [];
      }
    });
    const scrollHeight = common_vendor.ref(0);
    common_vendor.onMounted(() => {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      scrollHeight.value = systemInfo.windowHeight - 44 - 32;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !showResults.value
      }, !showResults.value ? {
        b: common_vendor.p({
          icon: "mdi:shopping-outline"
        }),
        c: query.value,
        d: common_vendor.o(($event) => query.value = $event.detail.value),
        e: common_vendor.p({
          icon: "mdi:currency-cny"
        }),
        f: minPrice.value,
        g: common_vendor.o(($event) => minPrice.value = $event.detail.value),
        h: common_vendor.p({
          icon: "mdi:currency-cny"
        }),
        i: maxPrice.value,
        j: common_vendor.o(($event) => maxPrice.value = $event.detail.value),
        k: loading.value ? 1 : "",
        l: common_vendor.p({
          icon: loading.value ? "mdi:loading" : "mdi:magnify"
        }),
        m: common_vendor.t(loading.value ? "分析中..." : "获取建议"),
        n: common_vendor.o(getAdvice),
        o: loading.value,
        p: common_vendor.p({
          type: "info",
          size: "14",
          color: "#909399"
        }),
        q: common_vendor.p({
          type: "info",
          size: "14",
          color: "#909399"
        })
      } : {
        r: common_vendor.p({
          type: "back",
          size: "12"
        }),
        s: common_vendor.o(($event) => showResults.value = false),
        t: common_vendor.f(parsedResults.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.price),
            c: common_vendor.t(item.channel),
            d: "d650adc9-7-" + i0,
            e: common_vendor.t(item.worth),
            f: index
          };
        }),
        v: common_vendor.p({
          type: "checkmarkempty",
          size: "16",
          color: "#52c41a"
        }),
        w: scrollHeight.value + "px"
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d650adc9"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
