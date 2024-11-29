"use strict";
const api_search = require("../../api/search.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      historyList: []
    };
  },
  onLoad() {
    this.fetchHistory();
  },
  methods: {
    async fetchHistory() {
      try {
        const response = await api_search.historyToday();
        if (response.code === 1) {
          this.historyList = response.data;
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.historyList, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.year),
        b: common_vendor.t(item.month),
        c: common_vendor.t(item.day),
        d: common_vendor.t(item.title),
        e: item.title
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b37acf1c"]]);
wx.createPage(MiniProgramPage);
