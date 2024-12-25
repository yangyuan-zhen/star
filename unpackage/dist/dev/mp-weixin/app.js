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
  components: {}
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
