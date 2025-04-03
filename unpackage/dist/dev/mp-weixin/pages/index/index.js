"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  ZodiacSettings();
}
const ZodiacSettings = () => "../../components/zodiac-settings/zodiac-settings.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const zodiacSigns = [
      "白羊座",
      "金牛座",
      "双子座",
      "巨蟹座",
      "狮子座",
      "处女座",
      "天秤座",
      "天蝎座",
      "射手座",
      "摩羯座",
      "水瓶座",
      "双鱼座"
    ];
    const zodiacElements = {
      白羊座: "fire",
      狮子座: "fire",
      射手座: "fire",
      金牛座: "earth",
      处女座: "earth",
      摩羯座: "earth",
      双子座: "air",
      天秤座: "air",
      水瓶座: "air",
      巨蟹座: "water",
      天蝎座: "water",
      双鱼座: "water"
    };
    const zodiacDateRanges = {
      白羊座: "3月21日-4月19日",
      金牛座: "4月20日-5月20日",
      双子座: "5月21日-6月21日",
      巨蟹座: "6月22日-7月22日",
      狮子座: "7月23日-8月22日",
      处女座: "8月23日-9月22日",
      天秤座: "9月23日-10月23日",
      天蝎座: "10月24日-11月22日",
      射手座: "11月23日-12月21日",
      摩羯座: "12月22日-1月19日",
      水瓶座: "1月20日-2月18日",
      双鱼座: "2月19日-3月20日"
    };
    const currentZodiac = common_vendor.ref("天蝎座");
    const birthDate = common_vendor.ref("2000-01-01");
    const settingsVisible = common_vendor.ref(false);
    const loading = common_vendor.ref(false);
    const fortuneData = common_vendor.ref(null);
    const getZodiacIconPath = (zodiac) => {
      return `/static/stars/${zodiac}.svg`;
    };
    const getZodiacDateRange = (zodiac) => {
      return zodiacDateRanges[zodiac] || "";
    };
    const getZodiacGradient = (zodiac) => {
      const element = zodiacElements[zodiac];
      switch (element) {
        case "fire":
          return "linear-gradient(135deg, #ff7700 0%, #ff3300 100%)";
        case "earth":
          return "linear-gradient(135deg, #77aa33 0%, #336633 100%)";
        case "air":
          return "linear-gradient(135deg, #33ccff 0%, #3366ff 100%)";
        case "water":
          return "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)";
        default:
          return "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)";
      }
    };
    const getCurrentDateZodiac = () => {
      const now = /* @__PURE__ */ new Date();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      return getZodiacByDate(month, day);
    };
    const getZodiacByDate = (month, day) => {
      if (month === 1 && day >= 20 || month === 2 && day <= 18) {
        return "水瓶座";
      } else if (month === 2 && day >= 19 || month === 3 && day <= 20) {
        return "双鱼座";
      } else if (month === 3 && day >= 21 || month === 4 && day <= 19) {
        return "白羊座";
      } else if (month === 4 && day >= 20 || month === 5 && day <= 20) {
        return "金牛座";
      } else if (month === 5 && day >= 21 || month === 6 && day <= 21) {
        return "双子座";
      } else if (month === 6 && day >= 22 || month === 7 && day <= 22) {
        return "巨蟹座";
      } else if (month === 7 && day >= 23 || month === 8 && day <= 22) {
        return "狮子座";
      } else if (month === 8 && day >= 23 || month === 9 && day <= 22) {
        return "处女座";
      } else if (month === 9 && day >= 23 || month === 10 && day <= 23) {
        return "天秤座";
      } else if (month === 10 && day >= 24 || month === 11 && day <= 22) {
        return "天蝎座";
      } else if (month === 11 && day >= 23 || month === 12 && day <= 21) {
        return "射手座";
      } else {
        return "摩羯座";
      }
    };
    const showSettings = () => {
      settingsVisible.value = true;
    };
    const saveUserSettings = (settings) => {
      currentZodiac.value = settings.sign;
      birthDate.value = settings.birthDate;
      common_vendor.index.setStorageSync("userZodiac", {
        sign: settings.sign,
        birthDate: settings.birthDate
      });
      fetchZodiacData(settings.sign);
    };
    const fetchZodiacData = async (zodiacName = null) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      loading.value = true;
      try {
        const zodiacToFetch = zodiacName || currentZodiac.value;
        const { result } = await common_vendor.nr.callFunction({
          name: "getZodiacFortune",
          data: { zodiac: zodiacToFetch }
        });
        if (result.code === 0 && result.data) {
          const { zodiacInfo, fortune } = result.data;
          fortuneData.value = {
            date: fortune.date,
            summary: ((_a = fortune.overall) == null ? void 0 : _a.description) || "",
            overall: {
              level: ((_b = fortune.overall) == null ? void 0 : _b.level) || "一般",
              rating: Math.round((((_c = fortune.overall) == null ? void 0 : _c.index) || 50) / 20)
              // 转换为1-5星评级
            },
            love: {
              rating: Math.round((((_d = fortune.love) == null ? void 0 : _d.index) || 50) / 20),
              description: ((_e = fortune.love) == null ? void 0 : _e.description) || ""
            },
            career: {
              rating: Math.round((((_f = fortune.career) == null ? void 0 : _f.index) || 50) / 20),
              description: ((_g = fortune.career) == null ? void 0 : _g.description) || ""
            },
            wealth: {
              rating: Math.round((((_h = fortune.wealth) == null ? void 0 : _h.index) || 50) / 20),
              description: ((_i = fortune.wealth) == null ? void 0 : _i.description) || ""
            },
            health: {
              rating: Math.round((((_j = fortune.health) == null ? void 0 : _j.index) || 50) / 20),
              description: ((_k = fortune.health) == null ? void 0 : _k.description) || ""
            },
            luckyColor: fortune.luckyColor || "",
            luckyNumber: fortune.luckyNumber || "",
            luckyZodiac: getRandomZodiac(zodiacToFetch),
            // 随机选择一个幸运星座
            goodFor: fortune.goodFor || "",
            badFor: fortune.badFor || ""
          };
          common_vendor.index.__f__("log", "at pages/index/index.vue:414", "获取星座运势成功:", fortuneData.value);
        } else {
          common_vendor.index.__f__("error", "at pages/index/index.vue:416", "获取星座运势失败:", result.message);
          common_vendor.index.showToast({
            title: "获取星座运势失败: " + result.message,
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:423", "获取星座运势出错:", error);
        common_vendor.index.showToast({
          title: "网络异常，请稍后再试",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    const getRandomZodiac = (currentZodiac2) => {
      const otherZodiacs = zodiacSigns.filter((z) => z !== currentZodiac2);
      return otherZodiacs[Math.floor(Math.random() * otherZodiacs.length)];
    };
    common_vendor.onMounted(() => {
      const savedZodiac = common_vendor.index.getStorageSync("userZodiac");
      if (savedZodiac && savedZodiac.sign) {
        currentZodiac.value = savedZodiac.sign;
        birthDate.value = savedZodiac.birthDate || "2000-01-01";
      } else {
        currentZodiac.value = getCurrentDateZodiac();
      }
      fetchZodiacData(currentZodiac.value);
    });
    common_vendor.onShow(() => {
      fetchZodiacData(currentZodiac.value);
    });
    common_vendor.watch(currentZodiac, (newVal) => {
      fetchZodiacData(newVal);
    });
    const getRandomIcon = (type) => {
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
        "🏃",
        "🍺",
        "🎰",
        "😡",
        "💤",
        "🚬",
        "🍔",
        "🎭",
        "📺",
        "📱"
      ];
      const icons = type === "good" ? goodIcons : badIcons;
      return icons[Math.floor(Math.random() * icons.length)];
    };
    const getStarRating = (rating = 0, maxRating = 5) => {
      const validRating = Math.min(Math.max(Math.round(rating || 0), 0), maxRating);
      const fullStars = "★".repeat(validRating);
      const emptyStars = "☆".repeat(maxRating - validRating);
      return fullStars + emptyStars;
    };
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
      return common_vendor.e({
        a: common_vendor.o(showSettings),
        b: loading.value
      }, loading.value ? {} : {
        c: common_vendor.t(currentZodiac.value),
        d: common_vendor.t(getZodiacDateRange(currentZodiac.value)),
        e: common_vendor.t(getStarRating(((_b = (_a = fortuneData.value) == null ? void 0 : _a.overall) == null ? void 0 : _b.rating) || 4)),
        f: common_vendor.t(((_c = fortuneData.value) == null ? void 0 : _c.summary) || "今天你的直觉特别敏锐，适合做重要决策。人际关系方面会有意外惊喜，工作上可能遇到挑战但能顺利解决。建议保持积极心态，适当放松心情。"),
        g: common_vendor.t(((_d = fortuneData.value) == null ? void 0 : _d.luckyNumber) || "7"),
        h: common_vendor.t(((_e = fortuneData.value) == null ? void 0 : _e.luckyColor) || "深蓝色"),
        i: common_vendor.t(((_f = fortuneData.value) == null ? void 0 : _f.luckyZodiac) || "水瓶座")
      }, {
        j: getZodiacIconPath(currentZodiac.value),
        k: getZodiacGradient(currentZodiac.value),
        l: common_vendor.t(getStarRating(((_h = (_g = fortuneData.value) == null ? void 0 : _g.love) == null ? void 0 : _h.rating) || 4)),
        m: common_vendor.t(((_j = (_i = fortuneData.value) == null ? void 0 : _i.love) == null ? void 0 : _j.description) || "今天是增进感情的好时机，单身者可能会遇到有趣的人，已有伴侣的人可以计划一次约会，加深彼此了解。"),
        n: common_vendor.t(getStarRating(((_l = (_k = fortuneData.value) == null ? void 0 : _k.career) == null ? void 0 : _l.rating) || 3)),
        o: common_vendor.t(((_n = (_m = fortuneData.value) == null ? void 0 : _m.career) == null ? void 0 : _n.description) || "工作中可能会面临挑战，但你的解决问题能力很强。建议多与同事沟通，团队合作将帮助你度过难关。"),
        p: common_vendor.t(getStarRating(((_p = (_o = fortuneData.value) == null ? void 0 : _o.wealth) == null ? void 0 : _p.rating) || 4)),
        q: common_vendor.t(((_r = (_q = fortuneData.value) == null ? void 0 : _q.wealth) == null ? void 0 : _r.description) || "财运不错，但要避免冲动消费。适合做长期理财计划，投资决策需谨慎，可向专业人士咨询。"),
        r: common_vendor.t(getStarRating(((_t = (_s = fortuneData.value) == null ? void 0 : _s.health) == null ? void 0 : _t.rating) || 5)),
        s: common_vendor.t(((_v = (_u = fortuneData.value) == null ? void 0 : _u.health) == null ? void 0 : _v.description) || "身体状况良好，但注意不要过度劳累。建议多喝水，适量运动，保持良好的作息习惯有助于提高免疫力。"),
        t: (_w = fortuneData.value) == null ? void 0 : _w.goodFor
      }, ((_x = fortuneData.value) == null ? void 0 : _x.goodFor) ? {
        v: common_vendor.f(fortuneData.value.goodFor.split(","), (item, index, i0) => {
          return {
            a: common_vendor.t(item.trim()),
            b: "good-" + index
          };
        }),
        w: common_vendor.t(getRandomIcon("good"))
      } : {}, {
        x: (_y = fortuneData.value) == null ? void 0 : _y.badFor
      }, ((_z = fortuneData.value) == null ? void 0 : _z.badFor) ? {
        y: common_vendor.f(fortuneData.value.badFor.split(","), (item, index, i0) => {
          return {
            a: common_vendor.t(item.trim()),
            b: "bad-" + index
          };
        }),
        z: common_vendor.t(getRandomIcon("bad"))
      } : {}, {
        A: common_vendor.o(saveUserSettings),
        B: common_vendor.o(($event) => settingsVisible.value = $event),
        C: common_vendor.p({
          ["current-zodiac"]: currentZodiac.value,
          ["birth-date"]: birthDate.value,
          show: settingsVisible.value
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
