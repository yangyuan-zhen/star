"use strict";
const common_vendor = require("../../common/vendor.js");
const api_search = require("../../api/search.js");
if (!Math) {
  common_vendor.unref(common_vendor.Icon)();
}
const _sfc_main = {
  __name: "index",
  setup(__props, { expose: __expose }) {
    const query = common_vendor.ref("");
    const minPrice = common_vendor.ref("");
    const maxPrice = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const result = common_vendor.ref(null);
    const lastQuery = common_vendor.ref("");
    const lastMinPrice = common_vendor.ref("");
    const lastMaxPrice = common_vendor.ref("");
    let loadingTimer = null;
    const getAdvice = async () => {
      var _a;
      if (((_a = result.value) == null ? void 0 : _a.output) && query.value === lastQuery.value && minPrice.value === lastMinPrice.value && maxPrice.value === lastMaxPrice.value) {
        common_vendor.index.showToast({
          title: "输入的商品和价格未改变，请修改后再试",
          icon: "none"
        });
        return;
      }
      if (!query.value.trim()) {
        common_vendor.index.showToast({
          title: "请输入商品名称",
          icon: "none"
        });
        return;
      }
      if (!minPrice.value) {
        common_vendor.index.showToast({
          title: "请输入最低价格",
          icon: "none"
        });
        return;
      }
      if (!maxPrice.value) {
        common_vendor.index.showToast({
          title: "请输入最高价格",
          icon: "none"
        });
        return;
      }
      if (Number(minPrice.value) > Number(maxPrice.value)) {
        common_vendor.index.showToast({
          title: "最低价格不能高于最高价格",
          icon: "none"
        });
        return;
      }
      loading.value = true;
      loadingTimer = setTimeout(() => {
        if (loading.value) {
          common_vendor.index.showToast({
            title: "正在努力分析中，请耐心等待...",
            icon: "none",
            duration: 2e3
          });
        }
      }, 5e3);
      try {
        const res = await api_search.getShoppingAdvice(
          query.value,
          maxPrice.value,
          minPrice.value
        );
        console.log("API 响应:", res);
        result.value = res;
        lastQuery.value = query.value;
        lastMinPrice.value = minPrice.value;
        lastMaxPrice.value = maxPrice.value;
      } catch (error) {
        console.error("发生错误:", error);
        common_vendor.index.showToast({
          title: "获取建议失败",
          icon: "error"
        });
      } finally {
        loading.value = false;
        if (loadingTimer) {
          clearTimeout(loadingTimer);
          loadingTimer = null;
        }
      }
    };
    const formatResult = (text) => {
      if (!text)
        return "";
      return text.replace(/^- /gm, "").replace(/\n- /g, "\n");
    };
    common_vendor.onUnmounted(() => {
      if (loadingTimer) {
        clearTimeout(loadingTimer);
        loadingTimer = null;
      }
    });
    const onShareAppMessage = () => {
      return {
        title: "值得买吗 - AI智能购物建议",
        path: "/pages/shopping/index",
        imageUrl: ""
        // 如果有分享图片的话
      };
    };
    const onShareTimeline = () => {
      return {
        title: "值得买吗 - AI智能购物建议",
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
    return (_ctx, _cache) => {
      var _a, _b, _c, _d;
      return common_vendor.e({
        a: common_vendor.p({
          icon: "mdi:shopping"
        }),
        b: common_vendor.p({
          icon: "mdi:robot"
        }),
        c: common_vendor.p({
          icon: "mdi:shopping-outline"
        }),
        d: query.value,
        e: common_vendor.o(($event) => query.value = $event.detail.value),
        f: common_vendor.p({
          icon: "mdi:information"
        }),
        g: common_vendor.p({
          icon: "mdi:currency-cny"
        }),
        h: minPrice.value,
        i: common_vendor.o(($event) => minPrice.value = $event.detail.value),
        j: common_vendor.p({
          icon: "mdi:currency-cny"
        }),
        k: maxPrice.value,
        l: common_vendor.o(($event) => maxPrice.value = $event.detail.value),
        m: loading.value ? 1 : "",
        n: common_vendor.p({
          icon: loading.value ? "mdi:loading" : "mdi:magnify"
        }),
        o: common_vendor.t(loading.value ? "分析中..." : "获取建议"),
        p: common_vendor.o(getAdvice),
        q: loading.value,
        r: (_a = result.value) == null ? void 0 : _a.value
      }, ((_b = result.value) == null ? void 0 : _b.value) ? {
        s: common_vendor.t(JSON.stringify(result.value.value, null, 2))
      } : {}, {
        t: (_c = result.value) == null ? void 0 : _c.output
      }, ((_d = result.value) == null ? void 0 : _d.output) ? {
        v: common_vendor.t(formatResult(result.value.output))
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d650adc9"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
