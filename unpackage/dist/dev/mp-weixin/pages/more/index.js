"use strict";
const common_vendor = require("../../common/vendor.js");
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
  setup(__props, { expose: __expose }) {
    const handleNavigate = (type) => {
      const routes = {
        history: "/pages/history/index",
        textSnap: "/pages/textSnap/index",
        weather: "/pages/weather/index",
        book: "/pages/book/index",
        translation: "/pages/translation/index",
        codeHelper: "/pages/codeHelper/index",
        movie: "/pages/movie/index",
        shopping: "/pages/shopping/index"
      };
      if (routes[type]) {
        common_vendor.index.navigateTo({
          url: routes[type],
          animationType: "slide-in-right",
          animationDuration: 300,
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/more/index.vue:194", "页面跳转失败:", err);
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
        6: "#795548",
        7: "#00bcd4"
      };
      return colors[index] || "#007aff";
    };
    const popup = common_vendor.ref(null);
    const customSettings = common_vendor.ref({
      payday: "",
      dailyIncome: "",
      workStartTime: "09:00",
      workEndTime: "18:00"
    });
    const displaySettings = common_vendor.ref({
      payday: 0,
      dailyIncome: 0,
      workStartTime: "09:00",
      workEndTime: "18:00",
      workDays: [1, 2, 3, 4, 5]
    });
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
        dailyIncome,
        workStartTime: customSettings.value.workStartTime,
        workEndTime: customSettings.value.workEndTime,
        workDays: selectedWorkDays.value
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
    const shareInfo = {
      title: "工具小助手",
      path: "/pages/more/index",
      imageUrl: "",
      // 确保你有这个分享图片
      desc: "查看节假日、其他工具等信息"
    };
    const onShareAppMessage = () => {
      return {
        title: shareInfo.title,
        path: shareInfo.path,
        imageUrl: shareInfo.imageUrl,
        desc: shareInfo.desc
      };
    };
    const onShareTimeline = () => {
      return {
        title: shareInfo.title,
        path: shareInfo.path,
        imageUrl: shareInfo.imageUrl,
        query: ""
        // 可选：分享时携带的查询参数
      };
    };
    __expose({
      onShareAppMessage,
      onShareTimeline
    });
    const selectedWorkDays = common_vendor.ref([1, 2, 3, 4, 5]);
    const toggleWorkDay = (dayIndex) => {
      const index = selectedWorkDays.value.indexOf(dayIndex);
      if (index === -1) {
        selectedWorkDays.value.push(dayIndex);
      } else {
        selectedWorkDays.value.splice(index, 1);
      }
      selectedWorkDays.value.sort((a, b) => a - b);
    };
    const onWorkStartTimeChange = (e) => {
      customSettings.value.workStartTime = e.detail.value;
    };
    const onWorkEndTimeChange = (e) => {
      customSettings.value.workEndTime = e.detail.value;
    };
    common_vendor.onMounted(() => {
      var _a, _b;
      const savedSettings = common_vendor.index.getStorageSync("customSettings");
      if (savedSettings) {
        displaySettings.value = {
          payday: savedSettings.payday,
          dailyIncome: savedSettings.dailyIncome,
          workStartTime: savedSettings.workStartTime || "09:00",
          workEndTime: savedSettings.workEndTime || "18:00",
          workDays: savedSettings.workDays || [1, 2, 3, 4, 5]
        };
        customSettings.value = {
          payday: ((_a = savedSettings.payday) == null ? void 0 : _a.toString()) || "0",
          dailyIncome: ((_b = savedSettings.dailyIncome) == null ? void 0 : _b.toString()) || "0",
          workStartTime: savedSettings.workStartTime || "09:00",
          workEndTime: savedSettings.workEndTime || "18:00"
        };
        selectedWorkDays.value = savedSettings.workDays || [1, 2, 3, 4, 5];
      } else {
        customSettings.value = {
          payday: "0",
          dailyIncome: "0",
          workStartTime: "09:00",
          workEndTime: "18:00"
        };
      }
      common_vendor.index.__f__("log", "at pages/more/index.vue:400", "popup ref:", popup.value);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "compose",
          size: "30",
          color: getIconColor(1)
        }),
        b: common_vendor.o(($event) => handleNavigate("textSnap")),
        c: common_vendor.p({
          type: "image",
          size: "30",
          color: getIconColor(2)
        }),
        d: common_vendor.o(($event) => handleNavigate("weather")),
        e: common_vendor.p({
          type: "bars",
          size: "30",
          color: getIconColor(3)
        }),
        f: common_vendor.o(($event) => handleNavigate("book")),
        g: common_vendor.p({
          type: "chat",
          size: "30",
          color: getIconColor(4)
        }),
        h: common_vendor.o(($event) => handleNavigate("translation")),
        i: common_vendor.p({
          type: "videocam",
          size: "30",
          color: getIconColor(6)
        }),
        j: common_vendor.o(($event) => handleNavigate("movie")),
        k: common_vendor.p({
          type: "shop",
          size: "30",
          color: getIconColor(7)
        }),
        l: common_vendor.o(($event) => handleNavigate("shopping")),
        m: common_vendor.o([($event) => customSettings.value.payday = $event.detail.value, validatePayday]),
        n: customSettings.value.payday,
        o: common_vendor.o([($event) => customSettings.value.dailyIncome = $event.detail.value, validateDailyIncome]),
        p: customSettings.value.dailyIncome,
        q: common_vendor.f(["周日", "周一", "周二", "周三", "周四", "周五", "周六"], (day, index, i0) => {
          return {
            a: common_vendor.t(day),
            b: index,
            c: selectedWorkDays.value.includes(index) ? 1 : "",
            d: common_vendor.o(($event) => toggleWorkDay(index), index)
          };
        }),
        r: common_vendor.t(customSettings.value.workStartTime),
        s: customSettings.value.workStartTime,
        t: common_vendor.o(onWorkStartTimeChange),
        v: common_vendor.t(customSettings.value.workEndTime),
        w: customSettings.value.workEndTime,
        x: common_vendor.o(onWorkEndTimeChange),
        y: common_vendor.o(hideCustomDialog),
        z: common_vendor.o(saveCustomSettings),
        A: common_vendor.sr(popup, "9cb5c55a-6", {
          "k": "popup"
        }),
        B: common_vendor.p({
          type: "center"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9cb5c55a"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/more/index.js.map
