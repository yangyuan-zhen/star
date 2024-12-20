"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "page-loading",
  props: {
    show: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: "热搜榜"
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.show
      }, __props.show ? {
        b: common_assets._imports_0,
        c: common_vendor.t(__props.title),
        d: common_vendor.f(3, (i, k0, i0) => {
          return {
            a: i
          };
        })
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e598955a"]]);
wx.createComponent(Component);
