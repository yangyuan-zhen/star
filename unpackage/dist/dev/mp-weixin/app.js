"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/note/index.js";
  "./pages/more/index.js";
  "./pages/textSnap/index.js";
  "./pages/book/index.js";
  "./pages/movie/index.js";
  "./pages/shopping/index.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(() => {
      const updateManager = common_vendor.index.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          common_vendor.index.__f__("log", "at App.vue:13", "发现新版本");
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
    });
    return (_ctx, _cache) => {
      return {};
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.component("Icon", common_vendor.Icon);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
