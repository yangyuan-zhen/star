"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_icons + MyPopup)();
}
const MyPopup = () => "../../components/my-popup/my-popup.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
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
    const getIconColor = (index) => {
      const colors = {
        1: "#007aff",
        2: "#ff6b6b",
        3: "#4caf50",
        4: "#9c27b0",
        5: "#ff9800",
        6: "#795548"
      };
      return colors[index] || "#007aff";
    };
    const popup = common_vendor.ref(null);
    const customSettings = common_vendor.ref({
      payday: "",
      dailyIncome: ""
    });
    const displaySettings = common_vendor.ref({
      payday: 28,
      dailyIncome: 1e3
    });
    const showCustomDialog = async () => {
      await common_vendor.nextTick$1();
      if (popup.value) {
        popup.value.open();
      } else {
        console.error("popup ref is not initialized");
      }
    };
    const hideCustomDialog = () => {
      popup.value.close();
    };
    const saveCustomSettings = () => {
      const payday = parseInt(customSettings.value.payday);
      const dailyIncome = parseFloat(customSettings.value.dailyIncome);
      if (isNaN(payday) || payday < 1 || payday > 31) {
        common_vendor.index.showToast({
          title: "请输入有效的发薪日期(1-31)",
          icon: "none"
        });
        return;
      }
      if (isNaN(dailyIncome) || dailyIncome < 0) {
        common_vendor.index.showToast({
          title: "请输入有效的收入金额",
          icon: "none"
        });
        return;
      }
      displaySettings.value = {
        payday,
        dailyIncome
      };
      common_vendor.index.setStorageSync("customSettings", displaySettings.value);
      common_vendor.index.showToast({
        title: "设置已保存",
        icon: "success"
      });
      hideCustomDialog();
    };
    const validatePayday = (e) => {
      let value = e.detail.value;
      value = value.replace(/[^\d]/g, "");
      let num = parseInt(value);
      if (num > 31) {
        num = 31;
      } else if (num < 1) {
        num = 1;
      }
      customSettings.value.payday = num.toString();
    };
    const validateDailyIncome = (e) => {
      let value = e.detail.value;
      value = value.replace(/[^\d.]/g, "");
      const parts = value.split(".");
      if (parts.length > 2) {
        value = parts[0] + "." + parts.slice(1).join("");
      }
      if (parts.length === 2 && parts[1].length > 2) {
        value = parts[0] + "." + parts[1].slice(0, 2);
      }
      customSettings.value.dailyIncome = value;
    };
    const daysUntilFriday = common_vendor.computed(() => {
      const today = /* @__PURE__ */ new Date();
      const currentDay = today.getDay();
      if (currentDay === 5) {
        return 0;
      }
      if (currentDay < 5) {
        return 5 - currentDay;
      } else {
        return 5 + (7 - currentDay);
      }
    });
    common_vendor.onMounted(() => {
      const savedSettings = common_vendor.index.getStorageSync("customSettings");
      if (savedSettings) {
        displaySettings.value = savedSettings;
        customSettings.value = {
          payday: savedSettings.payday.toString(),
          dailyIncome: savedSettings.dailyIncome.toString()
        };
      }
      console.log("popup ref:", popup.value);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(displaySettings.value.payday),
        b: common_vendor.t(daysUntilFriday.value),
        c: common_vendor.t(displaySettings.value.dailyIncome.toFixed(2)),
        d: common_assets._imports_0,
        e: common_vendor.o(showCustomDialog),
        f: common_vendor.p({
          type: "compose",
          size: "30",
          color: getIconColor(1)
        }),
        g: common_vendor.o(($event) => handleNavigate("textSnap")),
        h: common_vendor.p({
          type: "image",
          size: "30",
          color: getIconColor(2)
        }),
        i: common_vendor.o(($event) => handleNavigate("weather")),
        j: common_vendor.p({
          type: "bars",
          size: "30",
          color: getIconColor(3)
        }),
        k: common_vendor.o(($event) => handleNavigate("book")),
        l: common_vendor.p({
          type: "chat",
          size: "30",
          color: getIconColor(4)
        }),
        m: common_vendor.o(($event) => handleNavigate("translation")),
        n: common_vendor.p({
          type: "settings",
          size: "30",
          color: getIconColor(5)
        }),
        o: common_vendor.o(($event) => handleNavigate("codeHelper")),
        p: common_vendor.p({
          type: "videocam",
          size: "30",
          color: getIconColor(6)
        }),
        q: common_vendor.o(($event) => handleNavigate("movie")),
        r: common_vendor.o([($event) => customSettings.value.payday = $event.detail.value, validatePayday]),
        s: customSettings.value.payday,
        t: common_vendor.o([($event) => customSettings.value.dailyIncome = $event.detail.value, validateDailyIncome]),
        v: customSettings.value.dailyIncome,
        w: common_vendor.o(hideCustomDialog),
        x: common_vendor.o(saveCustomSettings),
        y: common_vendor.sr(popup, "9cb5c55a-6", {
          "k": "popup"
        }),
        z: common_vendor.p({
          type: "center"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9cb5c55a"]]);
wx.createPage(MiniProgramPage);
