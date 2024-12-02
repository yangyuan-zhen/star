"use strict";
const common_vendor = require("../../common/vendor.js");
const api_search = require("../../api/search.js");
const _sfc_main = {
  data() {
    return {
      cityName: "",
      weatherData: null,
      cardWidth: 300,
      cardHeight: 400
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
    // 修改保存图片方法
    async saveImage() {
      try {
        if (!this.weatherData || !this.weatherData.img) {
          throw new Error("图片数据不存在");
        }
        await common_vendor.index.showLoading({
          title: "保存中...",
          mask: true
        });
        const { result } = await common_vendor.Zs.callFunction({
          name: "downloadImage",
          data: {
            imageUrl: this.weatherData.img
          }
        });
        console.log("云函数调用结果:", result);
        if (!result || !result.data) {
          throw new Error("云函数返回结果为空");
        }
        if (result.code !== 0) {
          throw new Error(result.msg || "处理图片失败");
        }
        const settingRes = await common_vendor.index.getSetting({});
        if (!settingRes.authSetting["scope.writePhotosAlbum"]) {
          await common_vendor.index.authorize({ scope: "scope.writePhotosAlbum" });
        }
        const downloadRes = await common_vendor.index.downloadFile({
          url: result.data.tempFileURL
        });
        if (downloadRes.statusCode !== 200) {
          throw new Error("下载图片失败");
        }
        await common_vendor.index.saveImageToPhotosAlbum({
          filePath: downloadRes.tempFilePath
        });
        common_vendor.index.showToast({
          title: "已保存到相册",
          icon: "success"
        });
      } catch (error) {
        console.error("保存失败:", error);
        common_vendor.index.showToast({
          title: error.message || "保存失败",
          icon: "none",
          duration: 3e3
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    // 分享给朋友
    shareImage() {
      return {
        title: `${this.weatherData.city}天气画报`,
        path: "/pages/weather/index",
        imageUrl: this.weatherData.img
      };
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
    o: common_vendor.t($data.weatherData.temp_low),
    p: common_vendor.o((...args) => $options.saveImage && $options.saveImage(...args)),
    q: common_vendor.o((...args) => $options.shareImage && $options.shareImage(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-37d277d7"]]);
wx.createPage(MiniProgramPage);
