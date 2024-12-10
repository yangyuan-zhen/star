"use strict";
const common_vendor = require("../../common/vendor.js");
const api_search = require("../../api/search.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const currentDate = common_vendor.ref(/* @__PURE__ */ new Date());
    const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
    const currentDay = common_vendor.computed(() => currentDate.value.getDate());
    const currentMonth = common_vendor.computed(() => currentDate.value.getMonth());
    const weekDayText = common_vendor.computed(() => weekDays[currentDate.value.getDay()]);
    const todayMovie = common_vendor.ref(null);
    const fetchMovieData = async () => {
      try {
        const data = await api_search.getMovieData();
        todayMovie.value = data;
      } catch (error) {
        console.error("获取电影数据失败:", error);
        common_vendor.index.showToast({
          title: "获取电影数据失败",
          icon: "none"
        });
      }
    };
    const copyLink = () => {
      common_vendor.index.setClipboardData({
        data: "https://www.cikeee.com",
        success: () => {
          common_vendor.index.showToast({
            title: "链接已复制",
            icon: "success"
          });
        }
      });
    };
    common_vendor.onMounted(() => {
      fetchMovieData();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(currentDay.value),
        b: common_vendor.t(currentMonth.value + 1),
        c: common_vendor.t(weekDayText.value),
        d: todayMovie.value
      }, todayMovie.value ? {
        e: todayMovie.value.mov_pic,
        f: common_vendor.t(todayMovie.value.mov_title),
        g: common_vendor.t(todayMovie.value.mov_rating),
        h: common_vendor.t(todayMovie.value.mov_year),
        i: common_vendor.f(todayMovie.value.mov_type, (type, k0, i0) => {
          return {
            a: common_vendor.t(type),
            b: type
          };
        }),
        j: common_vendor.t(todayMovie.value.mov_text),
        k: common_vendor.t(todayMovie.value.mov_director),
        l: common_vendor.t(todayMovie.value.mov_area),
        m: common_vendor.o(copyLink)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a135a866"]]);
wx.createPage(MiniProgramPage);
