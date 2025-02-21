"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "MyPopup",
  props: {
    type: {
      type: String,
      default: "center"
    },
    maskClick: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showPopup: false
    };
  },
  methods: {
    open() {
      common_vendor.index.__f__("log", "at components/my-popup/my-popup.vue:42", "Opening popup");
      this.showPopup = true;
    },
    close() {
      common_vendor.index.__f__("log", "at components/my-popup/my-popup.vue:46", "Closing popup");
      this.showPopup = false;
    },
    onMaskClick() {
      if (this.maskClick) {
        this.close();
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.showPopup
  }, $data.showPopup ? {
    b: common_vendor.o((...args) => $options.onMaskClick && $options.onMaskClick(...args)),
    c: $data.showPopup ? 1 : 0,
    d: common_vendor.n("uni-popup--" + $props.type),
    e: common_vendor.n($data.showPopup ? "active" : ""),
    f: common_vendor.n("uni-popup--" + $props.type),
    g: common_vendor.n($data.showPopup ? "active" : ""),
    h: common_vendor.o(() => {
    })
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/my-popup/my-popup.js.map
