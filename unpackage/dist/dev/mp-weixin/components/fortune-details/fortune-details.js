"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "fortune-details",
  props: {
    fortune: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const getStarRating = (rating = 0, maxRating = 5) => {
      const validRating = Math.min(Math.max(Math.round(rating || 0), 0), maxRating);
      const fullStars = "★".repeat(validRating);
      const emptyStars = "☆".repeat(maxRating - validRating);
      return fullStars + emptyStars;
    };
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
      return {
        a: common_vendor.t(getStarRating(((_b = (_a = __props.fortune) == null ? void 0 : _a.love) == null ? void 0 : _b.rating) || 4)),
        b: common_vendor.t(((_d = (_c = __props.fortune) == null ? void 0 : _c.love) == null ? void 0 : _d.description) || "今天是增进感情的好时机，单身者可能会遇到有趣的人，已有伴侣的人可以计划一次约会，加深彼此了解。"),
        c: common_vendor.t(getStarRating(((_f = (_e = __props.fortune) == null ? void 0 : _e.career) == null ? void 0 : _f.rating) || 3)),
        d: common_vendor.t(((_h = (_g = __props.fortune) == null ? void 0 : _g.career) == null ? void 0 : _h.description) || "工作中可能会面临挑战，但你的解决问题能力很强。建议多与同事沟通，团队合作将帮助你度过难关。"),
        e: common_vendor.t(getStarRating(((_j = (_i = __props.fortune) == null ? void 0 : _i.wealth) == null ? void 0 : _j.rating) || 4)),
        f: common_vendor.t(((_l = (_k = __props.fortune) == null ? void 0 : _k.wealth) == null ? void 0 : _l.description) || "财运不错，但要避免冲动消费。适合做长期理财计划，投资决策需谨慎，可向专业人士咨询。"),
        g: common_vendor.t(getStarRating(((_n = (_m = __props.fortune) == null ? void 0 : _m.health) == null ? void 0 : _n.rating) || 5)),
        h: common_vendor.t(((_p = (_o = __props.fortune) == null ? void 0 : _o.health) == null ? void 0 : _p.description) || "身体状况良好，但注意不要过度劳累。建议多喝水，适量运动，保持良好的作息习惯有助于提高免疫力。")
      };
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/fortune-details/fortune-details.js.map
