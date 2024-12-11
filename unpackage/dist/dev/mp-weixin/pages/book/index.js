"use strict";
const common_vendor = require("../../common/vendor.js");
const api_search = require("../../api/search.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const bookName = common_vendor.ref("");
    const imageUrl = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const imageLoaded = common_vendor.ref(false);
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
        if (!imageUrl.value) {
          throw new Error("图片地址不能为空");
        }
        await common_vendor.index.showLoading({ title: "处理中..." });
        const callFunctionResult = await common_vendor.Zs.callFunction({
          name: "downloadImage",
          data: {
            imageUrl: imageUrl.value
          }
        });
        console.log("云函数调用结果:", callFunctionResult);
        if (!callFunctionResult || !callFunctionResult.result) {
          throw new Error("云函数返回结果为空");
        }
        const result = callFunctionResult.result;
        console.log("云函数返回数据:", result);
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
          title: "保存成功",
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
    };
    const handleImageLoad = () => {
      imageLoaded.value = true;
      console.log("图片加载成功");
    };
    const handleImageError = async (retryCount = 0) => {
      if (retryCount < 3) {
        console.log(`图片加载失败，第${retryCount + 1}次重试`);
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        imageUrl.value = `${imageUrl.value}?retry=${retryCount}`;
      } else {
        console.error("图片加载失败");
        common_vendor.index.showToast({
          title: "图片加载失败",
          icon: "none"
        });
      }
    };
    common_vendor.onShareAppMessage(() => {
      return {
        title: "AI荐书",
        path: "/pages/book/index",
        imageUrl: imageUrl.value
      };
    });
    common_vendor.onShareTimeline(() => {
      return {
        title: "AI荐书",
        query: "path=/pages/book/index",
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
        i: imageLoaded.value ? 1 : 0,
        j: common_vendor.o(handleImageLoad),
        k: common_vendor.o(handleImageError),
        l: common_vendor.o(handleSaveImage)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0452ab4c"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
