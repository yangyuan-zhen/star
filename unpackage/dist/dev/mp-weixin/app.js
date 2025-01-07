"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/note/index.js";
  "./pages/more/index.js";
  "./pages/textSnap/index.js";
  "./pages/weather/index.js";
  "./pages/book/index.js";
  "./pages/translation/index.js";
  "./pages/movie/index.js";
  "./pages/shopping/index.js";
}
const _sfc_main = {
  name: "App",
  components: {},
  onLaunch() {
    const updateManager = common_vendor.index.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        console.log("发现新版本");
      }
    });
    updateManager.onUpdateReady(() => {
      common_vendor.index.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        success: (res) => {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        }
      });
    });
    updateManager.onUpdateFailed(() => {
      common_vendor.index.showModal({
        title: "更新提示",
        content: "新版本下载失败，请检查网络后重试",
        showCancel: false
      });
    });
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.component("Icon", common_vendor.Icon);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
