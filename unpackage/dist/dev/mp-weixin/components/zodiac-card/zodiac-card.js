"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "zodiac-card",
  props: {
    zodiacName: { type: String, required: true },
    dateRange: { type: String, default: "" },
    fortune: { type: Object, default: () => ({}) },
    loading: { type: Boolean, default: false },
    gradient: { type: String, required: true },
    iconPath: { type: String, required: true }
  },
  setup(__props) {
    const getStarRating = (rating = 0, maxRating = 5) => {
      const validRating = Math.min(Math.max(Math.round(rating || 0), 0), maxRating);
      const fullStars = "★".repeat(validRating);
      const emptyStars = "☆".repeat(maxRating - validRating);
      return fullStars + emptyStars;
    };
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f;
      return common_vendor.e({
        a: __props.loading
      }, __props.loading ? {} : {
        b: common_vendor.t(__props.zodiacName),
        c: common_vendor.t(__props.dateRange),
        d: common_vendor.t(getStarRating(((_b = (_a = __props.fortune) == null ? void 0 : _a.overall) == null ? void 0 : _b.rating) || 4)),
        e: common_vendor.t(((_c = __props.fortune) == null ? void 0 : _c.summary) || "今天你的直觉特别敏锐，适合做重要决策。人际关系方面会有意外惊喜，工作上可能遇到挑战但能顺利解决。建议保持积极心态，适当放松心情。"),
        f: common_vendor.t(((_d = __props.fortune) == null ? void 0 : _d.luckyNumber) || "7"),
        g: common_vendor.t(((_e = __props.fortune) == null ? void 0 : _e.luckyColor) || "深蓝色"),
        h: common_vendor.t(((_f = __props.fortune) == null ? void 0 : _f.luckyZodiac) || "水瓶座")
      }, {
        i: __props.iconPath,
        j: __props.gradient
      });
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/zodiac-card/zodiac-card.js.map
