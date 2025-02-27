"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_search = require("../../api/search.js");
if (!Math) {
  (TodoList + MyPopup)();
}
const TodoList = () => "../../components/home/TodoList.js";
const MyPopup = () => "../../components/my-popup/my-popup.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const currentDate = common_vendor.ref(/* @__PURE__ */ new Date());
    const temperature = common_vendor.ref("--");
    const weatherText = common_vendor.ref("未知");
    const city = common_vendor.ref("定位中...");
    const showTodoList = common_vendor.ref(false);
    const hasShown = common_vendor.ref(false);
    const popupVisible = common_vendor.ref(false);
    const isFirstVisit = common_vendor.ref(true);
    const customSettings = common_vendor.ref({
      workStartTime: "09:00",
      workEndTime: "18:00"
    });
    const selectedWorkDays = common_vendor.ref([1, 2, 3, 4, 5]);
    const currentTime = common_vendor.ref(/* @__PURE__ */ new Date());
    common_vendor.ref(null);
    const showHeader = common_vendor.ref(false);
    const formatDate = common_vendor.computed(() => {
      const date = currentDate.value;
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    });
    const formatTime = common_vendor.computed(() => {
      const date = currentDate.value;
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    });
    const getWeatherData = async (locationId) => {
      try {
        const res = await api_search.getQWeather(locationId);
        if (res && res.now) {
          temperature.value = res.now.temp;
          weatherText.value = res.now.text;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:150", "获取天气数据失败:", error);
        common_vendor.index.showToast({
          title: "获取天气信息失败",
          icon: "none",
          duration: 2e3
        });
      }
    };
    const getLocation = () => {
      const cachedLocation = common_vendor.index.getStorageSync("locationCache");
      const cacheTime = common_vendor.index.getStorageSync("locationCache_time");
      const CACHE_DURATION = 5 * 60 * 1e3;
      if (cachedLocation && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
        city.value = cachedLocation.name;
        return getWeatherData(cachedLocation.id);
      }
      return new Promise((resolve, reject) => {
        common_vendor.index.getLocation({
          type: "wgs84",
          success: async (res) => {
            try {
              const cityData = await api_search.getLocationId(res.longitude, res.latitude);
              if (cityData && cityData.name) {
                city.value = cityData.name;
                common_vendor.index.setStorageSync("locationCache", cityData);
                common_vendor.index.setStorageSync("locationCache_time", Date.now());
                await getWeatherData(cityData.id);
                resolve(cityData);
              } else {
                throw new Error("获取城市信息失败");
              }
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/index/index.vue:188", "位置信息处理失败:", error);
              city.value = "未知位置";
              reject(error);
            }
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/index/index.vue:194", "获取位置失败:", err);
            city.value = "未知位置";
            reject(err);
          }
        });
      });
    };
    const init = async () => {
      try {
        await getLocation();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:207", "初始化位置或天气失败:", error);
        city.value = "未知位置";
        temperature.value = "--";
        weatherText.value = "未知";
      }
    };
    const resetAnimation = () => {
      hasShown.value = false;
      showTodoList.value = false;
      showHeader.value = false;
      setTimeout(() => {
        hasShown.value = true;
        setTimeout(() => {
          showTodoList.value = true;
          showHeader.value = true;
        }, 50);
      }, 50);
    };
    common_vendor.onShow(() => {
      resetAnimation();
    });
    common_vendor.onTabItemTap(() => {
      resetAnimation();
    });
    const showPopup = () => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:244", "showPopup clicked");
      popupVisible.value = true;
    };
    const hideCustomDialog = () => {
      popupVisible.value = false;
    };
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
    const saveCustomSettings = () => {
      const settings = {
        workStartTime: customSettings.value.workStartTime,
        workEndTime: customSettings.value.workEndTime,
        workDays: selectedWorkDays.value
      };
      common_vendor.index.setStorageSync("customSettings", settings);
      isFirstVisit.value = false;
      common_vendor.index.showToast({
        title: "设置已保存",
        icon: "success"
      });
      hideCustomDialog();
    };
    const isWorkday = common_vendor.computed(() => {
      const today = currentTime.value.getDay();
      return selectedWorkDays.value.includes(today);
    });
    const getTodayWorkTime = () => {
      const today = new Date(currentTime.value);
      const [startHour, startMinute] = customSettings.value.workStartTime.split(":");
      const [endHour, endMinute] = customSettings.value.workEndTime.split(":");
      const workStartTime = new Date(today.setHours(startHour, startMinute, 0));
      const workEndTime = new Date(today.setHours(endHour, endMinute, 0));
      return {
        workStartTime,
        workEndTime
      };
    };
    const isBeforeWork = common_vendor.computed(() => {
      const { workStartTime } = getTodayWorkTime();
      return currentTime.value.getTime() < workStartTime.getTime();
    });
    const isAfterWork = common_vendor.computed(() => {
      const { workEndTime } = getTodayWorkTime();
      return currentTime.value.getTime() > workEndTime.getTime();
    });
    const updateCurrentTime = () => {
      currentTime.value = /* @__PURE__ */ new Date();
      if (isUpdating.value) {
        setTimeout(updateCurrentTime, 1e3);
      }
    };
    const isUpdating = common_vendor.ref(true);
    const countdownText = common_vendor.computed(() => {
      if (!isWorkday.value)
        return "享受假期!";
      const { workStartTime, workEndTime } = getTodayWorkTime();
      const now = currentTime.value.getTime();
      if (isBeforeWork.value) {
        return "工作未开始";
      } else if (isAfterWork.value) {
        return "工作已结束!";
      } else {
        return formatCountdown(workEndTime.getTime() - now);
      }
    });
    const formatCountdown = (ms) => {
      if (ms < 0)
        return "00:00:00";
      const hours = Math.floor(ms / 36e5);
      const minutes = Math.floor(ms % 36e5 / 6e4);
      const seconds = Math.floor(ms % 6e4 / 1e3);
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
    };
    common_vendor.onMounted(() => {
      init();
      if (isUpdating.value) {
        updateCurrentTime();
      }
      const savedSettings = common_vendor.index.getStorageSync("customSettings");
      if (savedSettings) {
        customSettings.value = {
          workStartTime: savedSettings.workStartTime || "09:00",
          workEndTime: savedSettings.workEndTime || "18:00"
        };
        selectedWorkDays.value = savedSettings.workDays || [1, 2, 3, 4, 5];
        isFirstVisit.value = false;
      } else {
        popupVisible.value = true;
      }
    });
    common_vendor.onUnmounted(() => {
      isUpdating.value = false;
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(formatDate.value),
        b: common_vendor.t(formatTime.value),
        c: common_assets._imports_0,
        d: common_vendor.t(city.value),
        e: common_vendor.t(temperature.value),
        f: common_vendor.t(weatherText.value),
        g: common_vendor.o(showPopup),
        h: !hasShown.value ? 1 : "",
        i: showHeader.value ? 1 : "",
        j: common_vendor.t(countdownText.value),
        k: showTodoList.value ? 1 : "",
        l: !hasShown.value ? 1 : "",
        m: common_vendor.f(["周日", "周一", "周二", "周三", "周四", "周五", "周六"], (day, index, i0) => {
          return {
            a: common_vendor.t(day),
            b: index,
            c: selectedWorkDays.value.includes(index) ? 1 : "",
            d: common_vendor.o(($event) => toggleWorkDay(index), index)
          };
        }),
        n: common_vendor.t(customSettings.value.workStartTime),
        o: customSettings.value.workStartTime,
        p: common_vendor.o(onWorkStartTimeChange),
        q: common_vendor.t(customSettings.value.workEndTime),
        r: customSettings.value.workEndTime,
        s: common_vendor.o(onWorkEndTimeChange),
        t: common_vendor.o(hideCustomDialog),
        v: common_vendor.o(saveCustomSettings),
        w: common_vendor.o(($event) => popupVisible.value = $event),
        x: common_vendor.p({
          show: popupVisible.value
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
