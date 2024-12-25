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
        result.value = {
          data: res
        };
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
    common_vendor.onUnmounted(() => {
      if (loadingTimer) {
        clearTimeout(loadingTimer);
        loadingTimer = null;
      }
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
      var _a;
      if (!((_a = result.value) == null ? void 0 : _a.data))
        return [];
      try {
        const data = result.value.data;
        const jsonData = typeof data === "string" ? JSON.parse(data) : data;
        const outputText = jsonData.output;
        const lines = outputText.split("\n").filter(
          (line) => line.includes("手机名称：") || line.includes("价格：") || line.includes("购买渠道：")
        );
        const results = [];
        for (let i = 0; i < lines.length; i += 3) {
          if (i + 2 < lines.length) {
            const nameMatch = lines[i].match(/手机名称：(.+)/);
            const priceMatch = lines[i + 1].match(/价格：(\d+\.?\d*)/);
            const channelMatch = lines[i + 2].match(/购买渠道：(.+)/);
            if (nameMatch && priceMatch && channelMatch) {
              results.push({
                name: nameMatch[1].trim(),
                price: priceMatch[1].trim(),
                channel: channelMatch[1].trim()
              });
            }
          }
        }
        return results;
      } catch (error) {
        console.error("数据解析错误:", error);
        return [];
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          icon: "mdi:shopping-outline"
        }),
        b: query.value,
        c: common_vendor.o(($event) => query.value = $event.detail.value),
        d: common_vendor.p({
          icon: "mdi:information"
        }),
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
        p: parsedResults.value && parsedResults.value.length > 0
      }, parsedResults.value && parsedResults.value.length > 0 ? {
        q: common_vendor.f(parsedResults.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.price),
            c: common_vendor.t(item.channel),
            d: index
          };
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d650adc9"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
