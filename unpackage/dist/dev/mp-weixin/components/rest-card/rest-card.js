"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "rest-card",
  props: {
    displaySettings: {
      type: Object,
      required: true
    },
    daysUntilFriday: {
      type: Number,
      required: true
    },
    nextHoliday: {
      type: Object,
      required: true
    }
  },
  emits: ["tap"],
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(__props.displaySettings.payday),
        b: common_vendor.t(__props.daysUntilFriday),
        c: common_vendor.t(__props.nextHoliday.days),
        d: common_vendor.t(__props.nextHoliday.name),
        e: common_vendor.t(__props.displaySettings.dailyIncome.toFixed(2)),
        f: common_assets._imports_0$1,
        g: common_vendor.o(($event) => _ctx.$emit("tap"))
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c9d65e26"]]);
wx.createComponent(Component);
