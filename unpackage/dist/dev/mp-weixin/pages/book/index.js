"use strict";
const common_vendor = require("../../common/vendor.js");
const api_search = require("../../api/search.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const bookName = common_vendor.ref("");
    const imageUrl = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const handleSearch = async () => {
      if (!bookName.value.trim()) {
        common_vendor.index.showToast({
          title: "请输入书名",
          icon: "none"
        });
        return;
      }
      loading.value = true;
      try {
        const res = await api_search.getBookRecommend(bookName.value);
        console.log("API返回结果:", res);
        if (typeof res === "string" && res.includes("Error")) {
          throw new Error("服务请求失败，请稍后重试");
        }
        let imageData;
        try {
          imageData = typeof res === "string" ? JSON.parse(res) : res;
          if (imageData.data) {
            const parsedData = JSON.parse(imageData.data);
            imageUrl.value = parsedData.output;
          } else if (imageData.output) {
            imageUrl.value = imageData.output;
          } else {
            throw new Error("未找到图片地址");
          }
        } catch (parseError) {
          console.error("数据解析错误:", parseError);
          throw new Error("数据格式错误");
        }
      } catch (error) {
        console.error("处理错误:", error);
        common_vendor.index.showToast({
          title: error.message || "请求失败，请稍后重试",
          icon: "none",
          duration: 2e3
        });
      } finally {
        loading.value = false;
      }
    };
    const handleSaveImage = async () => {
      try {
        const settingRes = await common_vendor.index.getSetting({});
        if (!settingRes.authSetting["scope.writePhotosAlbum"]) {
          try {
            await common_vendor.index.authorize({
              scope: "scope.writePhotosAlbum"
            });
          } catch (authError) {
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
        }
        try {
          await common_vendor.index.showLoading({ title: "保存中..." });
          const downloadRes = await common_vendor.index.downloadFile({
            url: imageUrl.value
          });
          if (downloadRes.statusCode === 200) {
            await common_vendor.index.saveImageToPhotosAlbum({
              filePath: downloadRes.tempFilePath
            });
            common_vendor.index.showToast({
              title: "保存成功",
              icon: "success"
            });
          } else {
            throw new Error("下载失败");
          }
        } catch (saveError) {
          console.error("保存过程错误:", saveError);
          try {
            const ctx = common_vendor.index.createCanvasContext("saveCanvas");
            ctx.drawImage(imageUrl.value, 0, 0, 300, 300);
            ctx.draw(false, async () => {
              try {
                const canvasRes = await common_vendor.index.canvasToTempFilePath({
                  canvasId: "saveCanvas"
                });
                await common_vendor.index.saveImageToPhotosAlbum({
                  filePath: canvasRes.tempFilePath
                });
                common_vendor.index.showToast({
                  title: "保存成功",
                  icon: "success"
                });
              } catch (err) {
                throw new Error("canvas保存失败");
              }
            });
          } catch (canvasError) {
            common_vendor.index.showToast({
              title: "保存失败，请截图保存",
              icon: "none"
            });
          }
        }
      } catch (error) {
        console.error("整体错误:", error);
        common_vendor.index.showToast({
          title: "保存失败",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const handleImageLoad = () => {
      console.log("图片加载成功");
    };
    const handleImageError = () => {
      console.error("图片加载失败");
      common_vendor.index.showToast({
        title: "图片加载失败",
        icon: "none"
      });
    };
    common_vendor.onShareAppMessage(() => {
      return {
        title: "为你推荐好书",
        path: "/pages/book/index",
        imageUrl: imageUrl.value
      };
    });
    common_vendor.onShareTimeline(() => {
      return {
        title: "为你推荐好书",
        imageUrl: imageUrl.value
      };
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch),
        b: bookName.value,
        c: common_vendor.o(($event) => bookName.value = $event.detail.value),
        d: common_vendor.t(loading.value ? "生成中..." : "生成"),
        e: common_vendor.o(handleSearch),
        f: loading.value,
        g: imageUrl.value
      }, imageUrl.value ? {
        h: imageUrl.value,
        i: common_vendor.o(handleImageLoad),
        j: common_vendor.o(handleImageError),
        k: common_vendor.o(handleSaveImage)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0452ab4c"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
