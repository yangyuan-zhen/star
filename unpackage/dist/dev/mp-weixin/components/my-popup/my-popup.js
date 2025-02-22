"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "my-popup",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "center"
    },
    maskClick: {
      type: Boolean,
      default: true
    }
  },
  emits: ["update:show"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const onMaskClick = () => {
      if (props.maskClick) {
        emit("update:show", false);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.show
      }, __props.show ? {
        b: common_vendor.o(onMaskClick),
        c: __props.show ? 1 : 0,
        d: common_vendor.n("uni-popup--" + __props.type),
        e: common_vendor.n(__props.show ? "active" : ""),
        f: common_vendor.n("uni-popup--" + __props.type),
        g: common_vendor.n(__props.show ? "active" : ""),
        h: common_vendor.o(() => {
        })
      } : {});
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/my-popup/my-popup.js.map
