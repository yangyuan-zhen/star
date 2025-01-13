"use strict";
const common_vendor = require("../../common/vendor.js");
const fontSize = 12;
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const content = common_vendor.ref("");
    const showPreview = common_vendor.ref(false);
    const previewImage = common_vendor.ref("");
    const backgroundColor = common_vendor.ref("#ffffff");
    const inputStyle = common_vendor.computed(() => {
      return {
        fontSize: `${fontSize}px`,
        backgroundColor: "#ffffff"
      };
    });
    const drawText = async () => {
      const dpr = common_vendor.index.getSystemInfoSync().pixelRatio;
      const canvasWidth = 300 * dpr;
      const fontSize2 = 12;
      const lineHeight = fontSize2 * 1.5;
      const leftMargin = 20 * dpr;
      const rightMargin = 20 * dpr;
      const topMargin = 20 * dpr;
      const maxWidth = (canvasWidth - leftMargin - rightMargin) / dpr;
      try {
        const query = common_vendor.index.createSelectorQuery();
        const canvas2 = await new Promise((resolve) => {
          query.select("#myCanvas").fields({ node: true, size: true }).exec((res) => {
            if (res[0]) {
              const canvas3 = res[0].node;
              const ctx2 = canvas3.getContext("2d");
              resolve({ canvas: canvas3, ctx: ctx2 });
            }
          });
        });
        const { canvas, ctx } = canvas2;
        const textLines = [];
        const paragraphs = content.value.split("\n");
        ctx.font = `${fontSize2}px sans-serif`;
        for (let paragraph of paragraphs) {
          let currentLine = "";
          let chars = paragraph.split("");
          for (let char of chars) {
            const testLine = currentLine + char;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && currentLine) {
              textLines.push(currentLine);
              currentLine = char;
            } else {
              currentLine = testLine;
            }
          }
          if (currentLine) {
            textLines.push(currentLine);
          }
          if (currentLine.trim()) {
            textLines.push("");
          }
        }
        const logoImage = await new Promise((resolve, reject) => {
          const img = canvas.createImage();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = "/static/tabs/logo.png";
        });
        const lastTextY = topMargin / dpr + (textLines.length - 1) * lineHeight;
        const lineY = lastTextY + lineHeight + 20;
        const dateY = lineY + 20;
        const logoSize = 80;
        const logoX = (canvasWidth / dpr - logoSize) / 2;
        const logoY = dateY + 20;
        const totalHeight = logoY + logoSize + 20;
        canvas.width = canvasWidth;
        canvas.height = totalHeight * dpr;
        ctx.scale(dpr, dpr);
        ctx.fillStyle = backgroundColor.value;
        ctx.fillRect(0, 0, canvasWidth / dpr, totalHeight);
        ctx.font = `${fontSize2}px sans-serif`;
        ctx.fillStyle = "#333333";
        ctx.textBaseline = "top";
        ctx.textAlign = "left";
        textLines.forEach((line, index) => {
          const y = topMargin / dpr + index * lineHeight;
          ctx.fillText(line, leftMargin / dpr, y);
        });
        ctx.beginPath();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.moveTo(30, lineY);
        ctx.lineTo(canvasWidth / dpr - 30, lineY);
        ctx.stroke();
        const date = /* @__PURE__ */ new Date();
        const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
        ctx.textAlign = "center";
        ctx.fillText(dateStr, canvasWidth / (2 * dpr), dateY);
        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
        return canvas;
      } catch (error) {
        console.error("绘制失败:", error);
        throw error;
      }
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
      const hasAuth = await checkPhotoAlbumAuth();
      if (!hasAuth)
        return;
      try {
        common_vendor.index.showLoading({ title: "保存中..." });
        await new Promise((resolve, reject) => {
          common_vendor.index.saveImageToPhotosAlbum({
            filePath: previewImage.value,
            success: resolve,
            fail: (error) => {
              console.error("保存图片详细错误：", error);
              reject(error);
            }
          });
        });
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "保存成功", icon: "success" });
      } catch (error) {
        common_vendor.index.hideLoading();
        console.error("保存失败:", error);
        common_vendor.index.showToast({
          title: `保存失败: ${error.errMsg || "未知错误"}`,
          icon: "none",
          duration: 2e3
        });
      }
    };
    let isCheckingAuth = false;
    const checkPhotoAlbumAuth = () => {
      if (isCheckingAuth)
        return Promise.resolve(false);
      isCheckingAuth = true;
      return new Promise((resolve) => {
        common_vendor.index.getSetting({
          success(res) {
            const authStatus = res.authSetting["scope.writePhotosAlbum"];
            if (authStatus === true) {
              resolve(true);
            } else if (authStatus === false) {
              common_vendor.index.showModal({
                title: "权限提示",
                content: "保存图片需要相册权限，请到设置页面开启权限。",
                confirmText: "去设置",
                cancelText: "取消",
                success(modalRes) {
                  if (modalRes.confirm) {
                    common_vendor.index.openSetting({
                      success(settingRes) {
                        const newAuthStatus = settingRes.authSetting["scope.writePhotosAlbum"];
                        if (newAuthStatus) {
                          common_vendor.index.showToast({
                            title: "权限开启成功",
                            icon: "success"
                          });
                          resolve(true);
                        } else {
                          common_vendor.index.showToast({
                            title: "权限未开启",
                            icon: "none"
                          });
                          resolve(false);
                        }
                      },
                      fail: () => {
                        common_vendor.index.showToast({
                          title: "设置失败，请重试",
                          icon: "none"
                        });
                        resolve(false);
                      }
                    });
                  } else {
                    resolve(false);
                  }
                }
              });
            } else {
              common_vendor.index.authorize({
                scope: "scope.writePhotosAlbum",
                success: () => resolve(true),
                fail: () => {
                  common_vendor.index.showToast({
                    title: "您已拒绝授权",
                    icon: "none"
                  });
                  resolve(false);
                }
              });
            }
          },
          fail: () => {
            common_vendor.index.showToast({
              title: "获取权限状态失败，请重试",
              icon: "none"
            });
            resolve(false);
          },
          complete: () => isCheckingAuth = false
          // 状态复位
        });
      });
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
    const handleShare = () => {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      if (currentPage && currentPage.options && currentPage.options.text) {
        content.value = decodeURIComponent(currentPage.options.text);
      }
    };
    common_vendor.onMounted(() => {
      handleShare();
    });
    common_vendor.onShareAppMessage(() => {
      return {
        title: "文字分享",
        imageUrl: previewImage.value,
        // 将当前文本内容作为参数传递
        path: `/pages/textSnap/index?text=${encodeURIComponent(content.value)}`
      };
    });
    common_vendor.onShareTimeline(() => {
      return {
        title: "文字分享",
        imageUrl: previewImage.value,
        // 将当前文本内容作为参数传递
        query: `text=${encodeURIComponent(content.value)}`
      };
    });
    const showColorPicker = common_vendor.ref(false);
    const currentPickerColor = common_vendor.ref("#ffffff");
    const currentPickerType = common_vendor.ref("");
    const presetColors = [
      "#FFFFFF",
      // 白色
      "#FFF8DC",
      // 奶油
      "#FAF3E0",
      // 淡米色
      "#F5F5F5",
      // 浅灰色
      "#E0E0E0",
      // 中灰色
      "#FDF6E3",
      // 米黄色
      "#FFFDE7",
      // 浅米色
      "#E0F7FA",
      // 淡蓝色
      "#B3E5FC",
      // 浅蓝色
      "#E8F5E9",
      // 淡绿色
      "#C8E6C9"
      // 浅绿色
    ];
    const showBackgroundColorPicker = () => {
      currentPickerColor.value = backgroundColor.value;
      currentPickerType.value = "background";
      showColorPicker.value = true;
    };
    const closeColorPicker = () => {
      showColorPicker.value = false;
    };
    const selectColor = (color) => {
      backgroundColor.value = color;
      closeColorPicker();
    };
    const onColorInput = (e) => {
      const color = e.target.value;
      backgroundColor.value = color;
      closeColorPicker();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.s(inputStyle.value),
        b: -1,
        c: content.value,
        d: common_vendor.o(($event) => content.value = $event.detail.value),
        e: backgroundColor.value,
        f: common_vendor.o(showBackgroundColorPicker),
        g: common_vendor.o(generatePreview),
        h: content.value.trim() && previewImage.value
      }, content.value.trim() && previewImage.value ? {
        i: common_vendor.o(shareToWechat)
      } : {}, {
        j: content.value.trim() && previewImage.value
      }, content.value.trim() && previewImage.value ? {
        k: common_vendor.o(saveImage)
      } : {}, {
        l: showPreview.value
      }, showPreview.value ? {
        m: previewImage.value,
        n: common_vendor.o(() => {
        }),
        o: common_vendor.o(closePreview),
        p: common_vendor.o(closePreview)
      } : {}, {
        q: showColorPicker.value
      }, showColorPicker.value ? {
        r: common_vendor.o(closeColorPicker),
        s: common_vendor.f(presetColors, (color, k0, i0) => {
          return {
            a: color,
            b: color,
            c: common_vendor.o(($event) => selectColor(color), color)
          };
        }),
        t: currentPickerColor.value,
        v: common_vendor.o(onColorInput),
        w: common_vendor.o(() => {
        }),
        x: common_vendor.o(closeColorPicker)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d8f14a53"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
