"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const currentYear = common_vendor.ref((/* @__PURE__ */ new Date()).getFullYear());
    const remainingDays = common_vendor.ref(0);
    const hours = common_vendor.ref(0);
    const minutes = common_vendor.ref(0);
    const seconds = common_vendor.ref(0);
    const progressPercentage = common_vendor.ref(0);
    const progressDegrees = common_vendor.ref(0);
    let timer = null;
    const backgroundStyle = common_vendor.computed(() => ({
      backgroundImage: "url(../../static/tabs/background03_larg.jpg)"
    }));
    const calculateProgress = () => {
      const now = /* @__PURE__ */ new Date();
      currentYear.value = now.getFullYear();
      const startOfYear = new Date(currentYear.value, 0, 1);
      const endOfYear = new Date(currentYear.value, 11, 31, 23, 59, 59, 999);
      const timeLeft = endOfYear - now;
      remainingDays.value = Math.floor(timeLeft / (1e3 * 60 * 60 * 24));
      hours.value = Math.floor(
        timeLeft % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60)
      );
      minutes.value = Math.floor(timeLeft % (1e3 * 60 * 60) / (1e3 * 60));
      seconds.value = Math.floor(timeLeft % (1e3 * 60) / 1e3);
      const totalMilliseconds = endOfYear - startOfYear;
      const elapsedMilliseconds = now - startOfYear;
      const percentage = elapsedMilliseconds / totalMilliseconds * 100;
      progressPercentage.value = percentage.toFixed(2);
      progressDegrees.value = percentage / 100 * 360;
    };
    common_vendor.onMounted(() => {
      calculateProgress();
      timer = setInterval(calculateProgress, 1e3);
    });
    common_vendor.onUnmounted(() => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    });
    const handleNavigate = (type) => {
      const routes = {
        history: "/pages/history/index",
        textSnap: "/pages/textSnap/index",
        weather: "/pages/weather/index",
        book: "/pages/book/index",
        translation: "/pages/translation/index",
        codeHelper: "/pages/codeHelper/index",
        movie: "/pages/movie/index"
      };
      if (routes[type]) {
        common_vendor.index.navigateTo({
          url: routes[type],
          animationType: "slide-in-right",
          animationDuration: 300,
          fail: (err) => {
            console.error("页面跳转失败:", err);
            common_vendor.index.showToast({
              title: "页面跳转失败",
              icon: "none"
            });
          }
        });
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(currentYear.value),
        b: common_vendor.t(remainingDays.value),
        c: common_vendor.t(hours.value),
        d: common_vendor.t(minutes.value),
        e: common_vendor.t(seconds.value),
        f: `rotate(${progressDegrees.value}deg)`,
        g: common_vendor.t(progressPercentage.value),
        h: common_vendor.s(backgroundStyle.value),
        i: common_assets._imports_0,
        j: common_vendor.o(($event) => handleNavigate("textSnap")),
        k: common_assets._imports_1,
        l: common_vendor.o(($event) => handleNavigate("weather")),
        m: common_assets._imports_2,
        n: common_vendor.o(($event) => handleNavigate("book")),
        o: common_assets._imports_3,
        p: common_vendor.o(($event) => handleNavigate("translation")),
        q: common_assets._imports_4,
        r: common_vendor.o(($event) => handleNavigate("codeHelper")),
        s: common_assets._imports_5,
        t: common_vendor.o(($event) => handleNavigate("movie"))
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9cb5c55a"]]);
wx.createPage(MiniProgramPage);
