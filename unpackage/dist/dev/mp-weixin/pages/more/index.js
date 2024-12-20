"use strict";
const common_vendor = require("../../common/vendor.js");
const api_search = require("../../api/search.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
if (!Math) {
  (RestCard + _easycom_uni_icons + MyPopup)();
}
const MyPopup = () => "../../components/my-popup/my-popup.js";
const RestCard = () => "../../components/rest-card/rest-card.js";
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
    const holidayData = common_vendor.ref(null);
    const fetchHolidayData = async () => {
      try {
        const response = await api_search.getHolidayData();
        if (response.code === 0) {
          holidayData.value = response.holiday;
        }
      } catch (error) {
        console.error("获取节假日数据失败:", error);
      }
    };
    const nextHoliday = common_vendor.computed(() => {
      if (!holidayData.value) {
        return { name: "加载中", days: "-" };
      }
      const today = /* @__PURE__ */ new Date();
      `${String(today.getMonth() + 1).padStart(2, "0")}-${String(
        today.getDate()
      ).padStart(2, "0")}`;
      const currentYear = today.getFullYear();
      const holidays = Object.entries(holidayData.value).filter(
        ([_, info]) => info.holiday && !info.name.includes("后补班") && !info.name.includes("前补班")
      ).map(([date, info]) => ({
        date,
        fullDate: `${currentYear}-${date}`,
        name: info.name.replace(/[初一二三四五六七八九十]/, ""),
        rest: info.rest
      })).filter((holiday) => {
        const holidayDate = new Date(holiday.fullDate);
        return holidayDate >= today;
      });
      holidays.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));
      if (holidays.length === 0) {
        const nextNewYear = new Date(currentYear + 1, 0, 1);
        const daysUntilNewYear = Math.ceil(
          (nextNewYear - today) / (1e3 * 60 * 60 * 24)
        );
        return {
          name: "元旦",
          days: daysUntilNewYear
        };
      }
      const nextHoliday2 = holidays[0];
      const days = nextHoliday2.rest || Math.ceil((new Date(nextHoliday2.fullDate) - today) / (1e3 * 60 * 60 * 24));
      return {
        name: nextHoliday2.name,
        days
      };
    });
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
      fetchHolidayData();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(showCustomDialog),
        b: common_vendor.p({
          ["display-settings"]: displaySettings.value,
          ["days-until-friday"]: daysUntilFriday.value,
          ["next-holiday"]: nextHoliday.value
        }),
        c: common_vendor.p({
          type: "compose",
          size: "30",
          color: getIconColor(1)
        }),
        d: common_vendor.o(($event) => handleNavigate("textSnap")),
        e: common_vendor.p({
          type: "image",
          size: "30",
          color: getIconColor(2)
        }),
        f: common_vendor.o(($event) => handleNavigate("weather")),
        g: common_vendor.p({
          type: "bars",
          size: "30",
          color: getIconColor(3)
        }),
        h: common_vendor.o(($event) => handleNavigate("book")),
        i: common_vendor.p({
          type: "chat",
          size: "30",
          color: getIconColor(4)
        }),
        j: common_vendor.o(($event) => handleNavigate("translation")),
        k: common_vendor.p({
          type: "settings",
          size: "30",
          color: getIconColor(5)
        }),
        l: common_vendor.o(($event) => handleNavigate("codeHelper")),
        m: common_vendor.p({
          type: "videocam",
          size: "30",
          color: getIconColor(6)
        }),
        n: common_vendor.o(($event) => handleNavigate("movie")),
        o: common_vendor.o([($event) => customSettings.value.payday = $event.detail.value, validatePayday]),
        p: customSettings.value.payday,
        q: common_vendor.o([($event) => customSettings.value.dailyIncome = $event.detail.value, validateDailyIncome]),
        r: customSettings.value.dailyIncome,
        s: common_vendor.o(hideCustomDialog),
        t: common_vendor.o(saveCustomSettings),
        v: common_vendor.sr(popup, "9cb5c55a-7", {
          "k": "popup"
        }),
        w: common_vendor.p({
          type: "center"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9cb5c55a"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
