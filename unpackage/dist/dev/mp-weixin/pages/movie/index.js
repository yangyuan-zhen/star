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
    common_vendor.ref(false);
    common_vendor.ref([]);
    const isLoading = common_vendor.ref(true);
    const fetchMovieData = async () => {
      isLoading.value = true;
      try {
        const data = await api_search.getMovieData();
        todayMovie.value = data;
      } catch (error) {
        console.error("获取电影数据失败:", error);
        common_vendor.index.showToast({
          title: "获取电影数据失败",
          icon: "none"
        });
      } finally {
        isLoading.value = false;
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
    common_vendor.onShareAppMessage(() => {
      var _a, _b;
      return {
        title: ((_a = todayMovie.value) == null ? void 0 : _a.mov_title) || "今日电影推荐",
        path: "/pages/movie/index",
        imageUrl: (_b = todayMovie.value) == null ? void 0 : _b.mov_pic
        // 分享图片，使用电影海报
      };
    });
    common_vendor.onShareTimeline(() => {
      var _a, _b;
      return {
        title: ((_a = todayMovie.value) == null ? void 0 : _a.mov_title) || "今日电影推荐",
        query: "/pages/movie/index",
        imageUrl: (_b = todayMovie.value) == null ? void 0 : _b.mov_pic
      };
    });
    common_vendor.onMounted(() => {
      fetchMovieData();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(currentDay.value),
        b: common_vendor.t(currentMonth.value + 1),
        c: common_vendor.t(weekDayText.value),
        d: isLoading.value
      }, isLoading.value ? {
        e: common_vendor.f(3, (i, k0, i0) => {
          return {
            a: i
          };
        })
      } : todayMovie.value ? {
        g: todayMovie.value.mov_pic,
        h: common_vendor.t(todayMovie.value.mov_title),
        i: common_vendor.t(todayMovie.value.mov_rating),
        j: common_vendor.t(todayMovie.value.mov_year),
        k: common_vendor.f(todayMovie.value.mov_type, (type, k0, i0) => {
          return {
            a: common_vendor.t(type),
            b: type
          };
        }),
        l: common_vendor.t(todayMovie.value.mov_text),
        m: common_vendor.t(todayMovie.value.mov_director),
        n: common_vendor.t(todayMovie.value.mov_area),
        o: common_vendor.o(copyLink)
      } : {}, {
        f: todayMovie.value
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a135a866"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
