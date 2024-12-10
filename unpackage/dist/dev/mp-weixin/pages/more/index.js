"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const handleNavigate = (type) => {
      const routes = {
        history: "/pages/history/index",
        textSnap: "/pages/textSnap/index",
        weather: "/pages/weather/index",
        book: "/pages/book/index",
        translation: "/pages/translation/index",
        codeHelper: "/pages/codeHelper/index",
        movie: "/pages/movie/index"
      };
      if (routes[type]) {
        common_vendor.index.navigateTo({
          url: routes[type],
          animationType: "slide-in-right",
          animationDuration: 300,
          fail: (err) => {
            console.error("页面跳转失败:", err);
            common_vendor.index.showToast({
              title: "页面跳转失败",
              icon: "none"
            });
          }
        });
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.o(($event) => handleNavigate("textSnap")),
        c: common_assets._imports_1,
        d: common_vendor.o(($event) => handleNavigate("weather")),
        e: common_assets._imports_2,
        f: common_vendor.o(($event) => handleNavigate("book")),
        g: common_assets._imports_3,
        h: common_vendor.o(($event) => handleNavigate("translation")),
        i: common_assets._imports_4,
        j: common_vendor.o(($event) => handleNavigate("codeHelper")),
        k: common_assets._imports_5,
        l: common_vendor.o(($event) => handleNavigate("movie"))
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9cb5c55a"]]);
wx.createPage(MiniProgramPage);
