"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "zodiac-nav-bar",
  emits: ["settings"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const onSettings = () => {
      emit("settings");
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(onSettings)
      };
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/zodiac-nav-bar/zodiac-nav-bar.js.map
