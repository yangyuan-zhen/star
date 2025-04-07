"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  (ZodiacNavBar + ZodiacCard + FortuneDetails + DailyTips + ZodiacSettings)();
}
const ZodiacSettings = () => "../../components/zodiac-settings/zodiac-settings.js";
const ZodiacNavBar = () => "../../components/zodiac-nav-bar/zodiac-nav-bar.js";
const ZodiacCard = () => "../../components/zodiac-card/zodiac-card.js";
const FortuneDetails = () => "../../components/fortune-details/fortune-details.js";
const DailyTips = () => "../../components/daily-tips/daily-tips.js";
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
    const isFirstTimeUser = common_vendor.ref(false);
    common_vendor.ref("");
    const zodiacCardRef = common_vendor.ref(null);
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
    const generateShareImage = async () => {
      try {
        return new Promise((resolve) => {
          var _a, _b;
          const ctx = common_vendor.index.createCanvasContext("shareCanvas");
          const element = zodiacElements[currentZodiac.value];
          let bgColor = "#6366f1";
          if (element === "fire")
            bgColor = "#ff7700";
          else if (element === "earth")
            bgColor = "#77aa33";
          else if (element === "air")
            bgColor = "#33ccff";
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, 300, 400);
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 24px sans-serif";
          ctx.fillText(currentZodiac.value, 30, 50);
          ctx.font = "18px sans-serif";
          ctx.fillText("今日运势", 30, 90);
          ctx.font = "bold 20px sans-serif";
          ctx.fillText(((_b = (_a = fortuneData.value) == null ? void 0 : _a.overall) == null ? void 0 : _b.level) || "普通", 30, 140);
          ctx.draw(false, () => {
            common_vendor.index.canvasToTempFilePath({
              canvasId: "shareCanvas",
              success: (res) => {
                common_vendor.index.__f__("log", "at pages/index/index.vue:223", "生成分享图片成功:", res.tempFilePath);
                resolve(res.tempFilePath);
              },
              fail: (err) => {
                common_vendor.index.__f__("error", "at pages/index/index.vue:227", "生成分享图片失败:", err);
                resolve(`/static/share/${currentZodiac.value}.png`);
              }
            });
          });
        });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:234", "分享图片生成错误:", e);
        return `/static/share/${currentZodiac.value}.png`;
      }
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
        common_vendor.index.__f__("log", "at pages/index/index.vue:258", "开始获取星座数据:", zodiacToFetch);
        const currentDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        const cacheKey = `zodiac_fortune_${zodiacToFetch}_${currentDate}`;
        const cachedData = common_vendor.index.getStorageSync(cacheKey);
        if (cachedData) {
          common_vendor.index.__f__("log", "at pages/index/index.vue:267", "使用缓存数据:", zodiacToFetch);
          fortuneData.value = JSON.parse(cachedData);
          loading.value = false;
          return;
        }
        let retryCount = 0;
        const maxRetry = 2;
        let result = null;
        while (retryCount <= maxRetry) {
          try {
            const callResult = await common_vendor.nr.callFunction({
              name: "getZodiacFortune",
              data: {
                zodiac: zodiacToFetch,
                zodiacSign: zodiacToFetch
                // 同时提供两个参数名以兼容不同环境
              }
            });
            result = callResult.result;
            common_vendor.index.__f__("log", "at pages/index/index.vue:289", "云函数返回结果:", result);
            break;
          } catch (callError) {
            common_vendor.index.__f__("error", "at pages/index/index.vue:292", `第${retryCount + 1}次调用失败:`, callError);
            retryCount++;
            if (retryCount > maxRetry) {
              throw callError;
            }
            await new Promise((resolve) => setTimeout(resolve, 1e3));
          }
        }
        if (result && result.code === 0 && result.data) {
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
          common_vendor.index.setStorageSync(cacheKey, JSON.stringify(fortuneData.value));
          common_vendor.index.__f__("log", "at pages/index/index.vue:342", "获取星座运势成功:", fortuneData.value);
          common_vendor.nextTick$1(() => {
            generateShareImage().catch(() => {
              common_vendor.index.__f__("log", "at pages/index/index.vue:348", "预生成分享图片失败，将使用静态图片");
            });
          });
        } else {
          common_vendor.index.__f__("error", "at pages/index/index.vue:352", "获取星座运势失败:", result.message);
          common_vendor.index.showToast({
            title: "获取星座运势失败: " + result.message,
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:359", "获取星座运势出错:", error);
        let errorMsg = "网络异常，请稍后再试";
        if (error && error.message) {
          errorMsg += "(" + error.message + ")";
          common_vendor.index.__f__("log", "at pages/index/index.vue:364", "详细错误信息:", JSON.stringify(error));
        }
        common_vendor.index.showToast({
          title: errorMsg,
          icon: "none",
          duration: 3e3
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
        settingsVisible.value = true;
        isFirstTimeUser.value = true;
      }
      common_vendor.index.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"]
      });
      fetchZodiacData(currentZodiac.value);
    });
    common_vendor.onShow(() => {
      fetchZodiacData(currentZodiac.value);
    });
    common_vendor.watch(currentZodiac, (newVal) => {
      fetchZodiacData(newVal);
    });
    common_vendor.onShareAppMessage(() => {
      var _a, _b;
      return {
        title: `${currentZodiac.value}今日运势 - ${((_b = (_a = fortuneData.value) == null ? void 0 : _a.overall) == null ? void 0 : _b.level) || "查看你的星座运势"}`,
        path: "/pages/index/index",
        imageUrl: `/static/share/${currentZodiac.value}.png`
        // 确保路径正确
      };
    });
    common_vendor.onShareTimeline(() => {
      return {
        title: `${currentZodiac.value}今日运势分析 - 星座运势`,
        query: `zodiac=${encodeURIComponent(currentZodiac.value)}`,
        imageUrl: `/static/share/${currentZodiac.value}.png`
        // 确保路径正确
      };
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(showSettings),
        b: common_vendor.sr(zodiacCardRef, "75df3941-1", {
          "k": "zodiacCardRef"
        }),
        c: common_vendor.p({
          ["zodiac-name"]: currentZodiac.value,
          ["date-range"]: getZodiacDateRange(currentZodiac.value),
          fortune: fortuneData.value,
          loading: loading.value,
          gradient: getZodiacGradient(currentZodiac.value),
          ["icon-path"]: getZodiacIconPath(currentZodiac.value)
        }),
        d: common_vendor.p({
          fortune: fortuneData.value
        }),
        e: common_vendor.p({
          fortune: fortuneData.value
        }),
        f: common_vendor.o(saveUserSettings),
        g: common_vendor.o(($event) => settingsVisible.value = $event),
        h: common_vendor.p({
          ["current-zodiac"]: currentZodiac.value,
          ["birth-date"]: birthDate.value,
          ["is-first-time"]: isFirstTimeUser.value,
          show: settingsVisible.value
        })
      };
    };
  }
};
_sfc_main.__runtimeHooks = 6;
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
