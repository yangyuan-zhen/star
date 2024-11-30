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
        const auth = await new Promise((resolve) => {
          common_vendor.index.authorize({
            scope: "scope.writePhotosAlbum",
            success: () => resolve(true),
            fail: () => resolve(false)
          });
        });
        if (!auth) {
          common_vendor.index.showModal({
            title: "提示",
            content: "需要您授权保存图片到相册",
            success: (res) => {
              if (res.confirm) {
                common_vendor.index.openSetting();
              }
            }
          });
          return;
        }
        common_vendor.index.showLoading({
          title: "保存中...",
          mask: true
        });
        const cardNode = await new Promise((resolve) => {
          const query = common_vendor.index.createSelectorQuery().in(this);
          query.select("#shareCard").boundingClientRect((data) => {
            resolve(data);
          }).exec();
        });
        const canvas = await new Promise((resolve) => {
          const query = common_vendor.index.createSelectorQuery().in(this);
          query.select("#tempCanvas").fields({ node: true, size: true }).exec((res) => {
            resolve(res[0].node);
          });
        });
        const ctx = canvas.getContext("2d");
        const scale = 3;
        const imageWidth = cardNode.width;
        const imageHeight = Math.round(imageWidth * 0.75);
        const totalHeight = imageHeight + 150;
        canvas.width = imageWidth * scale;
        canvas.height = totalHeight * scale;
        ctx.scale(scale, scale);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const image = canvas.createImage();
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = reject;
          image.src = this.weatherData.img;
        });
        let drawWidth = imageWidth;
        let drawHeight = imageHeight;
        let offsetX = 0;
        let offsetY = 0;
        const imageRatio = image.width / image.height;
        const targetRatio = imageWidth / imageHeight;
        if (imageRatio > targetRatio) {
          drawHeight = imageHeight;
          drawWidth = imageHeight * imageRatio;
          offsetX = (imageWidth - drawWidth) / 2;
        } else {
          drawWidth = imageWidth;
          drawHeight = imageWidth / imageRatio;
          offsetY = (imageHeight - drawHeight) / 2;
        }
        ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
        ctx.textAlign = "center";
        const centerX = imageWidth / 2;
        const textStartY = imageHeight + 30;
        ctx.fillStyle = "#333333";
        ctx.font = `normal ${15 * scale / 3}px sans-serif`;
        const poetry = this.weatherData.poetry;
        if (poetry.length > 20) {
          const mid = Math.ceil(poetry.length / 2);
          const firstLine = poetry.substring(0, mid);
          const secondLine = poetry.substring(mid);
          ctx.fillText(firstLine, centerX, textStartY);
          ctx.fillText(secondLine, centerX, textStartY + 25);
          ctx.font = `bold ${18 * scale / 3}px sans-serif`;
          ctx.fillText(this.weatherData.city, centerX, textStartY + 60);
          ctx.fillStyle = "#666666";
          ctx.font = `normal ${14 * scale / 3}px sans-serif`;
          ctx.fillText(
            `${this.weatherData.date} ${this.weatherData.condition}`,
            centerX,
            textStartY + 85
          );
          ctx.fillText(
            `最高 ${this.weatherData.temp_high}°C 最低 ${this.weatherData.temp_low}°C`,
            centerX,
            textStartY + 105
          );
        } else {
          ctx.fillText(poetry, centerX, textStartY);
          ctx.font = `bold ${18 * scale / 3}px sans-serif`;
          ctx.fillText(this.weatherData.city, centerX, textStartY + 35);
          ctx.fillStyle = "#666666";
          ctx.font = `normal ${14 * scale / 3}px sans-serif`;
          ctx.fillText(
            `${this.weatherData.date} ${this.weatherData.condition}`,
            centerX,
            textStartY + 60
          );
          ctx.fillText(
            `最高 ${this.weatherData.temp_high}°C 最低 ${this.weatherData.temp_low}°C`,
            centerX,
            textStartY + 80
          );
        }
        const tempFilePath = await new Promise((resolve, reject) => {
          common_vendor.index.canvasToTempFilePath({
            canvas,
            quality: 1,
            success: (res) => resolve(res.tempFilePath),
            fail: reject
          });
        });
        await new Promise((resolve, reject) => {
          common_vendor.index.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: resolve,
            fail: reject
          });
        });
        common_vendor.index.showToast({
          title: "已保存到相册",
          icon: "success"
        });
      } catch (error) {
        console.error("保存失败:", error);
        common_vendor.index.showToast({
          title: "保存失败",
          icon: "none"
        });
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
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.cityName,
    b: common_vendor.o(($event) => $data.cityName = $event.detail.value),
    c: common_vendor.o((...args) => $options.getWeatherReport && $options.getWeatherReport(...args)),
    d: !$data.cityName,
    e: $data.weatherData
  }, $data.weatherData ? {
    f: $data.weatherData.img,
    g: common_vendor.t($data.weatherData.poetry),
    h: common_vendor.t($data.weatherData.city),
    i: common_vendor.t($data.weatherData.date),
    j: common_vendor.t($data.weatherData.condition),
    k: common_vendor.t($data.weatherData.temp_high),
    l: common_vendor.t($data.weatherData.temp_low),
    m: common_vendor.o((...args) => $options.saveImage && $options.saveImage(...args)),
    n: common_vendor.o((...args) => $options.shareImage && $options.shareImage(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-37d277d7"]]);
wx.createPage(MiniProgramPage);
