"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const handleMenuClick = (type) => {
      common_vendor.index.showToast({
        title: "功能开发中",
        icon: "none"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$1,
        b: common_vendor.o(($event) => handleMenuClick()),
        c: common_vendor.o(($event) => handleMenuClick()),
        d: common_vendor.o(($event) => handleMenuClick())
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-79e6a490"]]);
wx.createPage(MiniProgramPage);
