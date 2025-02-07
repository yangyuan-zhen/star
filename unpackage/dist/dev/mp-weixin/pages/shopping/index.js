"use strict";
const common_vendor = require("../../common/vendor.js");
const api_search = require("../../api/search.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
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
      if (Number(minPrice.value) > Number(maxPrice.value)) {
        common_vendor.index.showToast({
          title: "最低价格不能大于最高价格",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      try {
        loading.value = true;
        console.log("发起API请求...", {
          query: query.value,
          minPrice: minPrice.value,
          maxPrice: maxPrice.value
        });
        const res = await api_search.getShoppingAdvice(
          query.value,
          maxPrice.value,
          minPrice.value
        );
        console.log("API响应结果：", res);
        if (res) {
          result.value = { output: res };
        } else {
          result.value = {};
        }
        console.log("result.value的值：", result.value);
        console.log("解析后的结果：", parsedResults.value);
        if (parsedResults.value.length > 0) {
          showResults.value = true;
        } else {
          console.log("没有解析到有效结果");
          common_vendor.index.showToast({
            title: "未获取到商品推荐",
            icon: "none",
            duration: 2e3
          });
        }
      } catch (error) {
        console.error("请求失败：", error);
        common_vendor.index.showToast({
          title: error.message || "获取建议失败",
          icon: "none",
          duration: 2e3
        });
      } finally {
        loading.value = false;
      }
    };
    common_vendor.onUnmounted(() => {
    });
    const parsedResults = common_vendor.computed(() => {
      var _a;
      if (!((_a = result.value) == null ? void 0 : _a.output))
        return [];
      try {
        const text = result.value.output;
        const products = text.match(/- 🛍️ 商品名称:[\s\S]*?(?=(?:- 🛍️ 商品名称:|$))/g) || [];
        const results = products.map((product) => {
          var _a2, _b;
          try {
            const nameMatch = product.match(/商品名称:\s*([^\n]+)/);
            const priceMatch = product.match(/价格:\s*([\d.]+)/);
            const channelMatch = product.match(/购买渠道:\s*([^\n]+)/);
            const worthMatch = product.match(/是否值得购买：\s*([^。\n]+)/);
            if (!(nameMatch == null ? void 0 : nameMatch[1]) || !(priceMatch == null ? void 0 : priceMatch[1]))
              return null;
            const name = nameMatch[1].trim().replace(/\\n/g, "").replace(/\[点击.*?\]/g, "").replace(/🛍️/g, "");
            const price = priceMatch[1].trim();
            const channel = ((_a2 = channelMatch == null ? void 0 : channelMatch[1]) == null ? void 0 : _a2.trim().replace(/\\n/g, "").replace(/\[点击.*?\]/g, "").replace(/🛒/g, "")) || "平台未注明";
            const worth = ((_b = worthMatch == null ? void 0 : worthMatch[1]) == null ? void 0 : _b.trim().replace(/\\n/g, "").replace(/\[点击.*?\]/g, "").replace(/。$/, "").replace(/⭐/g, "").replace(/https?:\/\/[^\s)]+/g, "")) || "暂无评估";
            return { name, price, channel, worth };
          } catch (error) {
            console.error("解析错误：", error);
            return null;
          }
        }).filter(Boolean);
        return results;
      } catch (error) {
        console.error("解析错误：", error);
        return [];
      }
    });
    const scrollHeight = common_vendor.ref(0);
    common_vendor.onMounted(() => {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      scrollHeight.value = systemInfo.windowHeight - 44 - 32;
    });
    const onShareAppMessage = () => {
      return {
        title: "买什么 - AI智能购物建议",
        path: "/pages/shopping/index",
        imageUrl: ""
        // 如有分享图片可填写
      };
    };
    const onShareTimeline = () => {
      return {
        title: "买什么 - AI智能购物建议",
        query: "/pages/shopping/index",
        imageUrl: ""
        // 如有分享图片可填写
      };
    };
    __expose({
      onShareAppMessage,
      onShareTimeline
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !showResults.value
      }, !showResults.value ? {
        b: query.value,
        c: common_vendor.o(($event) => query.value = $event.detail.value),
        d: maxPrice.value,
        e: common_vendor.o(($event) => maxPrice.value = $event.detail.value),
        f: minPrice.value,
        g: common_vendor.o(($event) => minPrice.value = $event.detail.value),
        h: common_vendor.t(loading.value ? "分析中..." : "获取建议"),
        i: common_vendor.o(getAdvice),
        j: loading.value,
        k: common_vendor.p({
          type: "info",
          size: "14",
          color: "#909399"
        }),
        l: common_vendor.p({
          type: "info",
          size: "14",
          color: "#909399"
        })
      } : {
        m: common_vendor.p({
          type: "back",
          size: "10"
        }),
        n: common_vendor.o(($event) => showResults.value = false),
        o: common_vendor.f(parsedResults.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.price),
            c: common_vendor.t(item.channel),
            d: common_vendor.t(item.worth),
            e: index
          };
        }),
        p: scrollHeight.value + "px"
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d650adc9"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
