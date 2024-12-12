"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const content = common_vendor.ref("");
    const themeIndex = common_vendor.ref(0);
    const themes = ["简约浅色", "暗黑模式"];
    const themeStyles = {
      0: {
        // 简约浅色
        background: "#ffffff",
        textColor: "#333333"
      },
      1: {
        // 暗黑模式
        background: "#282c34",
        textColor: "#ffffff"
      }
    };
    const fontSize = common_vendor.ref(14);
    const opacity = common_vendor.ref(1);
    const showPreview = common_vendor.ref(false);
    const previewImage = common_vendor.ref("");
    const inputStyle = common_vendor.computed(() => {
      const style = {
        fontSize: `${fontSize.value}px`,
        backgroundColor: themeIndex.value === 1 ? `rgba(40, 44, 52, ${opacity.value})` : `rgba(255, 255, 255, ${opacity.value})`,
        color: themeIndex.value === 1 ? "#ffffff" : "#333333"
      };
      return style;
    });
    const onThemeChange = (e) => {
      themeIndex.value = e.detail.value;
    };
    const onFontSizeChange = (e) => {
      fontSize.value = e.detail.value;
    };
    const onOpacityChange = (e) => {
      opacity.value = e.detail.value / 100;
    };
    const drawText = async () => {
      const query = common_vendor.index.createSelectorQuery();
      const canvas = await new Promise((resolve) => {
        query.select("#myCanvas").fields({ node: true, size: true }).exec((res) => {
          if (res[0]) {
            resolve(res[0].node);
          } else {
            common_vendor.index.showToast({
              title: "获取画布失败",
              icon: "none"
            });
          }
        });
      });
      if (!canvas)
        return null;
      const ctx = canvas.getContext("2d");
      const dpr = common_vendor.index.getSystemInfoSync().pixelRatio;
      const canvasWidth = 300 * dpr;
      const canvasHeight = 400 * dpr;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = themeStyles[themeIndex.value].background;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.font = `${fontSize.value}px sans-serif`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillStyle = themeStyles[themeIndex.value].textColor;
      const text = content.value;
      const maxWidth = 260;
      const lineHeight = fontSize.value + 10;
      const topMargin = 40;
      const lines = [];
      let currentLine = "";
      const paragraphs = text.split("\n");
      for (let paragraph of paragraphs) {
        if (paragraph === "") {
          lines.push("");
          continue;
        }
        for (let char of paragraph) {
          const testLine = currentLine + char;
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = char;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) {
          lines.push(currentLine);
          currentLine = "";
        }
      }
      lines.forEach((line, index) => {
        const y = topMargin + index * lineHeight;
        ctx.fillText(line, 150, y);
      });
      ctx.save();
      ctx.font = "14px sans-serif";
      ctx.fillStyle = themeIndex.value === 1 ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText("Free信息", canvas.width / dpr - 20, canvas.height / dpr - 20);
      ctx.restore();
      return canvas;
    };
    const generatePreview = async () => {
      if (!content.value.trim()) {
        common_vendor.index.showToast({
          title: "请输入内容",
          icon: "none"
        });
        return;
      }
      try {
        common_vendor.index.showLoading({ title: "生成中..." });
        const canvas = await drawText();
        if (!canvas) {
          throw new Error("Canvas creation failed");
        }
        const res = await new Promise((resolve, reject) => {
          common_vendor.index.canvasToTempFilePath({
            canvas,
            success: resolve,
            fail: reject
          });
        });
        previewImage.value = res.tempFilePath;
        showPreview.value = true;
        common_vendor.index.hideLoading();
      } catch (error) {
        console.error("生成预览失败:", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "生成预览失败",
          icon: "none"
        });
      }
    };
    const saveImage = async () => {
      if (!previewImage.value)
        return;
      try {
        common_vendor.index.showLoading({ title: "保存中..." });
        await new Promise((resolve, reject) => {
          common_vendor.index.saveImageToPhotosAlbum({
            filePath: previewImage.value,
            success: resolve,
            fail: reject
          });
        });
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "保存成功",
          icon: "success"
        });
        closePreview();
      } catch (error) {
        console.error("保存失败:", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "保存失败",
          icon: "none"
        });
      }
    };
    const closePreview = () => {
      showPreview.value = false;
    };
    const shareToWechat = () => {
      if (!previewImage.value)
        return;
      common_vendor.index.showModal({
        title: "分享提示",
        content: '点击右上角"..."按钮进行分享',
        showCancel: false,
        success: () => {
          common_vendor.index.$emit("setShareImage", previewImage.value);
        }
      });
    };
    common_vendor.onShareAppMessage(() => {
      return {
        title: "文字图片",
        imageUrl: previewImage.value,
        path: "/pages/textSnap/index"
      };
    });
    common_vendor.onShareTimeline(() => {
      return {
        title: "文字图片",
        imageUrl: previewImage.value,
        path: "/pages/textSnap/index"
      };
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.s(inputStyle.value),
        b: -1,
        c: content.value,
        d: common_vendor.o(($event) => content.value = $event.detail.value),
        e: common_vendor.t(themes[themeIndex.value]),
        f: themeIndex.value,
        g: themes,
        h: common_vendor.o(onThemeChange),
        i: common_vendor.t(fontSize.value),
        j: fontSize.value,
        k: common_vendor.o(onFontSizeChange),
        l: common_vendor.t(Math.round(opacity.value * 100)),
        m: opacity.value * 100,
        n: common_vendor.o(onOpacityChange),
        o: common_vendor.o(generatePreview),
        p: previewImage.value
      }, previewImage.value ? {
        q: common_vendor.o(shareToWechat)
      } : {}, {
        r: previewImage.value
      }, previewImage.value ? {
        s: common_vendor.o(saveImage)
      } : {}, {
        t: showPreview.value
      }, showPreview.value ? {
        v: previewImage.value,
        w: common_vendor.o(() => {
        }),
        x: common_vendor.o(closePreview),
        y: common_vendor.o(closePreview)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d8f14a53"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
