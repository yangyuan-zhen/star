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
        weather: "/pages/weather/index"
      };
      if (routes[type]) {
        common_vendor.index.navigateTo({
          url: routes[type]
        });
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.o(($event) => handleNavigate("history")),
        c: common_assets._imports_1,
        d: common_vendor.o(($event) => handleNavigate("textSnap")),
        e: common_assets._imports_2,
        f: common_vendor.o(($event) => handleNavigate("weather"))
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9cb5c55a"]]);
wx.createPage(MiniProgramPage);
