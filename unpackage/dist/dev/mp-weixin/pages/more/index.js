"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const handleNavigate = (type) => {
      const routes = {
        history: "/pages/history/index",
        textSnap: "/pages/textSnap/index",
        weather: "/pages/weather/index",
        book: "/pages/book/index",
        translation: "/pages/translation/index",
        codeHelper: "/pages/codeHelper/index",
        movie: "/pages/movie/index"
      };
      if (routes[type]) {
        common_vendor.index.navigateTo({
          url: routes[type],
          animationType: "slide-in-right",
          animationDuration: 300,
          fail: (err) => {
            console.error("页面跳转失败:", err);
            common_vendor.index.showToast({
              title: "页面跳转失败",
              icon: "none"
            });
          }
        });
      }
    };
    const getIconColor = (index) => {
      const colors = {
        1: "#007aff",
        2: "#ff6b6b",
        3: "#4caf50",
        4: "#9c27b0",
        5: "#ff9800",
        6: "#795548"
      };
      return colors[index] || "#007aff";
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.p({
          type: "compose",
          size: "30",
          color: getIconColor(1)
        }),
        c: common_vendor.o(($event) => handleNavigate("textSnap")),
        d: common_vendor.p({
          type: "image",
          size: "30",
          color: getIconColor(2)
        }),
        e: common_vendor.o(($event) => handleNavigate("weather")),
        f: common_vendor.p({
          type: "bars",
          size: "30",
          color: getIconColor(3)
        }),
        g: common_vendor.o(($event) => handleNavigate("book")),
        h: common_vendor.p({
          type: "chat",
          size: "30",
          color: getIconColor(4)
        }),
        i: common_vendor.o(($event) => handleNavigate("translation")),
        j: common_vendor.p({
          type: "settings",
          size: "30",
          color: getIconColor(5)
        }),
        k: common_vendor.o(($event) => handleNavigate("codeHelper")),
        l: common_vendor.p({
          type: "videocam",
          size: "30",
          color: getIconColor(6)
        }),
        m: common_vendor.o(($event) => handleNavigate("movie"))
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9cb5c55a"]]);
wx.createPage(MiniProgramPage);
