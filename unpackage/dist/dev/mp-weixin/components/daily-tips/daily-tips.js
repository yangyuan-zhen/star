"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "daily-tips",
  props: {
    fortune: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const getRandomIcon = (type, index = 0) => {
      const goodIcons = [
        "📚",
        "👥",
        "📝",
        "🧘",
        "🏃",
        "🛌",
        "📱",
        "🎮",
        "☕",
        "🎵",
        "🧠",
        "✍️"
      ];
      const badIcons = [
        "💳",
        "💬",
        "⚠️",
        "🍺",
        "🎰",
        "😡",
        "💤",
        "🚬",
        "🍔",
        "🎭",
        "📺",
        "⏰"
      ];
      const icons = type === "good" ? goodIcons : badIcons;
      return icons[index % icons.length];
    };
    return (_ctx, _cache) => {
      var _a, _b, _c, _d;
      return common_vendor.e({
        a: (_a = __props.fortune) == null ? void 0 : _a.goodFor
      }, ((_b = __props.fortune) == null ? void 0 : _b.goodFor) ? {
        b: common_vendor.f(__props.fortune.goodFor.split(","), (item, index, i0) => {
          return {
            a: common_vendor.t(getRandomIcon("good", index)),
            b: common_vendor.t(item.trim()),
            c: "good-" + index
          };
        })
      } : {}, {
        c: (_c = __props.fortune) == null ? void 0 : _c.badFor
      }, ((_d = __props.fortune) == null ? void 0 : _d.badFor) ? {
        d: common_vendor.f(__props.fortune.badFor.split(","), (item, index, i0) => {
          return {
            a: common_vendor.t(getRandomIcon("bad", index)),
            b: common_vendor.t(item.trim()),
            c: "bad-" + index
          };
        })
      } : {});
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/daily-tips/daily-tips.js.map
