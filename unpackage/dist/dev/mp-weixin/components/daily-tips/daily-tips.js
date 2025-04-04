"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "daily-tips",
  props: {
    fortune: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const getRandomIcon = (type, index, text) => {
      const goodIcons = ["📝", "🧘", "🏃", "📱", "🎮", "☕", "🎵", "🧠", "✍️"];
      const badIcons = ["💳", "💬", "⚠️", "🍺", "🎰", "😡", "💤", "🚬", "🍔"];
      const goodKeywords = {
        创作: "✍️",
        写作: "✍️",
        学习: "📚",
        阅读: "📚",
        思考: "🧠",
        独处: "🧠",
        运动: "🏃",
        锻炼: "🏃",
        健身: "💪",
        冥想: "🧘",
        放松: "🛌",
        社交: "👥",
        聚会: "🎉",
        旅行: "🧳",
        工作: "💼",
        计划: "📝",
        整理: "📋",
        购物: "🛍️",
        约会: "❤️"
      };
      const badKeywords = {
        酒: "🍺",
        喝酒: "🍺",
        酗酒: "🍺",
        熬夜: "💤",
        赌博: "🎰",
        争吵: "😡",
        争执: "😡",
        吵架: "😡",
        冲动: "💢",
        消费: "💳",
        购物: "💳",
        暴饮暴食: "🍔",
        油炸: "🍟",
        抱怨: "💬",
        懒惰: "🛋️",
        拖延: "⏰"
      };
      const keywords = type === "good" ? goodKeywords : badKeywords;
      const defaultIcons = type === "good" ? goodIcons : badIcons;
      for (const [keyword, icon] of Object.entries(keywords)) {
        if (text && text.includes(keyword)) {
          return icon;
        }
      }
      return defaultIcons[index % defaultIcons.length];
    };
    return (_ctx, _cache) => {
      var _a, _b, _c, _d;
      return common_vendor.e({
        a: (_a = __props.fortune) == null ? void 0 : _a.goodFor
      }, ((_b = __props.fortune) == null ? void 0 : _b.goodFor) ? {
        b: common_vendor.f(__props.fortune.goodFor.split(","), (item, index, i0) => {
          return {
            a: common_vendor.t(getRandomIcon("good", index, item.trim())),
            b: common_vendor.t(item.trim()),
            c: "good-" + index
          };
        })
      } : {}, {
        c: (_c = __props.fortune) == null ? void 0 : _c.badFor
      }, ((_d = __props.fortune) == null ? void 0 : _d.badFor) ? {
        d: common_vendor.f(__props.fortune.badFor.split(","), (item, index, i0) => {
          return {
            a: common_vendor.t(getRandomIcon("bad", index, item.trim())),
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
