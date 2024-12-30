"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "rest-card",
  props: {
    displaySettings: {
      type: Object,
      required: true,
      default: () => ({
        workStartTime: "09:00",
        workEndTime: "18:00",
        workDays: [1, 2, 3, 4, 5]
      })
    },
    daysUntilFriday: {
      type: Number,
      required: true
    },
    nextHoliday: {
      type: Object,
      required: true
    }
  },
  emits: ["tap"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const countdownTime = common_vendor.ref("--:--:--");
    let timer = null;
    const currentEarnings = common_vendor.ref(0);
    const isFirstTime = common_vendor.ref(true);
    const calculateCountdown = () => {
      const now = /* @__PURE__ */ new Date();
      const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const [endHours, endMinutes] = props.displaySettings.workEndTime.split(":").map(Number);
      const endTime = endHours * 3600 + endMinutes * 60;
      if (!isWorkingHours.value) {
        countdownTime.value = "--:--:--";
        return;
      }
      const remainingSeconds = endTime - currentTime;
      if (remainingSeconds <= 0) {
        countdownTime.value = "00:00:00";
        return;
      }
      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor(remainingSeconds % 3600 / 60);
      const seconds = remainingSeconds % 60;
      countdownTime.value = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };
    const isWorkingHours = common_vendor.computed(() => {
      var _a, _b, _c;
      if (!((_a = props.displaySettings) == null ? void 0 : _a.workStartTime) || !((_b = props.displaySettings) == null ? void 0 : _b.workEndTime) || !((_c = props.displaySettings) == null ? void 0 : _c.workDays)) {
        return false;
      }
      const now = /* @__PURE__ */ new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
      const currentDay = now.getDay();
      const isWorkday = props.displaySettings.workDays.includes(currentDay);
      if (!isWorkday)
        return false;
      const timeToMinutes = (timeStr) => {
        if (!timeStr)
          return 0;
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
      };
      const currentMinutes = timeToMinutes(currentTime);
      const startMinutes = timeToMinutes(props.displaySettings.workStartTime);
      const endMinutes = timeToMinutes(props.displaySettings.workEndTime);
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    });
    const calculateHourlyRate = () => {
      const [startHours, startMinutes] = props.displaySettings.workStartTime.split(":").map(Number);
      const [endHours, endMinutes] = props.displaySettings.workEndTime.split(":").map(Number);
      const workMinutes = endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
      const minuteRate = props.displaySettings.dailyIncome / workMinutes;
      return minuteRate / 60;
    };
    const updateEarnings = () => {
      var _a;
      if (!((_a = props.displaySettings) == null ? void 0 : _a.dailyIncome)) {
        currentEarnings.value = 0;
        return;
      }
      if (!isWorkingHours.value) {
        const now2 = /* @__PURE__ */ new Date();
        const currentTime2 = now2.getHours() * 3600 + now2.getMinutes() * 60 + now2.getSeconds();
        const [endHours, endMinutes] = props.displaySettings.workEndTime.split(":").map(Number);
        const endTime = endHours * 3600 + endMinutes * 60;
        if (currentTime2 > endTime) {
          currentEarnings.value = props.displaySettings.dailyIncome;
        } else {
          currentEarnings.value = 0;
        }
        return;
      }
      const now = /* @__PURE__ */ new Date();
      const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const [startHours, startMinutes] = props.displaySettings.workStartTime.split(":").map(Number);
      const startTime = startHours * 3600 + startMinutes * 60;
      const workedSeconds = currentTime - startTime;
      currentEarnings.value = workedSeconds * calculateHourlyRate();
    };
    const checkFirstTimeUser = () => {
      try {
        const hasUsed = common_vendor.index.getStorageSync("hasUsedRestCard");
        isFirstTime.value = !hasUsed;
        if (isFirstTime.value) {
          common_vendor.index.setStorageSync("hasUsedRestCard", true);
          common_vendor.index.showModal({
            title: "欢迎使用",
            content: "您可以点击设置来自定义工作时间和收入信息",
            confirmText: "去设置",
            cancelText: "稍后再说",
            success: (res) => {
              if (res.confirm) {
                emit("tap");
              }
            }
          });
        }
      } catch (e) {
        console.error("Storage operation failed:", e);
      }
    };
    common_vendor.onMounted(() => {
      common_vendor.nextTick$1(() => {
        checkFirstTimeUser();
        calculateCountdown();
        updateEarnings();
        timer = setInterval(() => {
          calculateCountdown();
          updateEarnings();
        }, 1e3);
      });
    });
    common_vendor.onUnmounted(() => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    });
    common_vendor.watch(isWorkingHours, (newValue) => {
      if (!newValue) {
        const now = /* @__PURE__ */ new Date();
        const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        const [endHours, endMinutes] = props.displaySettings.workEndTime.split(":").map(Number);
        const endTime = endHours * 3600 + endMinutes * 60;
        if (currentTime > endTime) {
          currentEarnings.value = props.displaySettings.dailyIncome;
        } else {
          currentEarnings.value = 0;
        }
      } else {
        currentEarnings.value = 0;
      }
    });
    const daysUntilPayday = common_vendor.computed(() => {
      var _a;
      if (!((_a = props.displaySettings) == null ? void 0 : _a.payday)) {
        return 0;
      }
      const today = /* @__PURE__ */ new Date();
      const currentDay = today.getDate();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const payday = props.displaySettings.payday;
      if (currentDay < payday) {
        return payday - currentDay;
      } else {
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        return lastDayOfMonth - currentDay + parseInt(payday);
      }
    });
    const handleCardTap = () => {
      emit("tap");
    };
    const emit = __emit;
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(isWorkingHours.value ? "距离下班还有" + countdownTime.value : "休息时间"),
        b: common_vendor.t(isWorkingHours.value ? "工作中" : "休息中"),
        c: isWorkingHours.value ? 1 : "",
        d: common_vendor.t(daysUntilPayday.value),
        e: common_vendor.t(__props.daysUntilFriday === 0 ? "今天就是周五" : `还有${__props.daysUntilFriday}天`),
        f: common_vendor.t(__props.daysUntilFriday === 0 ? "" : "距离周五"),
        g: common_vendor.t(__props.nextHoliday.days),
        h: common_vendor.t(__props.nextHoliday.name),
        i: common_vendor.t(currentEarnings.value.toFixed(2)),
        j: isWorkingHours.value ? "../../static/tabs/onwork.png" : "../../static/tabs/offwork.png",
        k: common_vendor.o(handleCardTap)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c9d65e26"]]);
wx.createComponent(Component);
