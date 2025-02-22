"use strict";
const common_vendor = require("../../common/vendor.js");
const api_search = require("../../api/search.js");
const _sfc_main = {
  data() {
    return {
      cityName: "",
      weatherData: null
    };
  },
  methods: {
    async getWeatherReport() {
      if (!this.cityName) {
        common_vendor.index.showToast({
          title: "请输入城市名称",
          icon: "none"
        });
        return;
      }
      try {
        common_vendor.index.showLoading({
          title: "加载中..."
        });
        const result = await api_search.getWeatherReport(this.cityName);
        this.weatherData = result;
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "获取天气数据失败",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    handleFocus() {
      this.$refs.cityInput && (this.$refs.cityInput.style.borderColor = "#409eff");
    },
    handleBlur() {
      this.$refs.cityInput && (this.$refs.cityInput.style.borderColor = "#eee");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleFocus && $options.handleFocus(...args)),
    b: common_vendor.o((...args) => $options.handleBlur && $options.handleBlur(...args)),
    c: common_vendor.o((...args) => $options.getWeatherReport && $options.getWeatherReport(...args)),
    d: $data.cityName,
    e: common_vendor.o(($event) => $data.cityName = $event.detail.value),
    f: common_vendor.o((...args) => $options.getWeatherReport && $options.getWeatherReport(...args)),
    g: !$data.cityName,
    h: $data.weatherData
  }, $data.weatherData ? {
    i: $data.weatherData.img,
    j: common_vendor.t($data.weatherData.poetry),
    k: common_vendor.t($data.weatherData.city),
    l: common_vendor.t($data.weatherData.date),
    m: common_vendor.t($data.weatherData.condition),
    n: common_vendor.t($data.weatherData.temp_high),
    o: common_vendor.t($data.weatherData.temp_low)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-37d277d7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/weather/index.js.map
