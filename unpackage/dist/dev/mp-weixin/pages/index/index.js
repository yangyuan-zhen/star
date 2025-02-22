"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_search = require("../../api/search.js");
if (!Math) {
  TodoList();
}
const TodoList = () => "../../components/home/TodoList.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const currentDate = common_vendor.ref(/* @__PURE__ */ new Date());
    const temperature = common_vendor.ref("--");
    const weatherText = common_vendor.ref("未知");
    const city = common_vendor.ref("定位中...");
    const showTodoList = common_vendor.ref(false);
    const hasShown = common_vendor.ref(false);
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
    const updateDateTime = () => {
      currentDate.value = /* @__PURE__ */ new Date();
    };
    const getWeatherData = async (locationId) => {
      try {
        const res = await api_search.getQWeather(locationId);
        if (res && res.now) {
          temperature.value = res.now.temp;
          weatherText.value = res.now.text;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:72", "获取天气数据失败:", error);
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
        common_vendor.index.authorize({
          scope: "scope.userLocation",
          success: () => {
            common_vendor.index.getLocation({
              type: "wgs84",
              success: async (res) => {
                try {
                  const cityData = await api_search.getLocationId(res.longitude, res.latitude);
                  city.value = cityData.name;
                  await getWeatherData(cityData.id);
                  resolve(cityData);
                } catch (error) {
                  common_vendor.index.__f__("error", "at pages/index/index.vue:108", "位置信息处理失败:", error);
                  city.value = "未知位置";
                  await getWeatherData();
                  reject(error);
                }
              },
              fail: (err) => {
                common_vendor.index.__f__("error", "at pages/index/index.vue:115", "获取位置失败:", err);
                city.value = "未知位置";
                getWeatherData();
                reject(err);
              }
            });
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/index/index.vue:123", "位置授权失败:", err);
            common_vendor.index.showModal({
              title: "提示",
              content: "需要获取您的位置才能显示准确的天气信息，是否打开设置页面重新授权？",
              success: (res) => {
                if (res.confirm) {
                  common_vendor.index.openSetting();
                }
              }
            });
            city.value = "未知位置";
            getWeatherData();
            reject(err);
          }
        });
      });
    };
    const init = async () => {
      try {
        await getLocation();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:148", "初始化位置或天气失败:", error);
      }
    };
    const resetAnimation = () => {
      hasShown.value = false;
      showTodoList.value = false;
      setTimeout(() => {
        hasShown.value = true;
        setTimeout(() => {
          showTodoList.value = true;
        }, 50);
      }, 50);
    };
    common_vendor.onShow(() => {
      resetAnimation();
    });
    common_vendor.onTabItemTap(() => {
      resetAnimation();
    });
    common_vendor.onMounted(() => {
      updateDateTime();
      setInterval(updateDateTime, 1e3);
      init();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(formatDate.value),
        b: common_vendor.t(formatTime.value),
        c: common_assets._imports_0,
        d: common_vendor.t(city.value),
        e: common_vendor.t(temperature.value),
        f: common_vendor.t(weatherText.value),
        g: showTodoList.value ? 1 : "",
        h: !hasShown.value ? 1 : ""
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
