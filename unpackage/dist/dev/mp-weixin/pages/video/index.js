"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_search = require("../../api/search.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const videoList = common_vendor.ref([]);
    const currentVideoIndex = common_vendor.ref(0);
    const isPlaying = common_vendor.ref(true);
    const getVideoList = async () => {
      try {
        const res = await api_search.videoResources();
        if (res.code === 200) {
          videoList.value.push({
            videoUrl: res.video,
            coverUrl: ""
            // 可选的封面图
          });
        }
      } catch (error) {
        console.error("获取视频失败：", error);
      }
    };
    const handleSwiperChange = (e) => {
      const newIndex = e.detail.current;
      currentVideoIndex.value = newIndex;
      isPlaying.value = true;
      videoList.value.forEach((_, index) => {
        if (index !== newIndex) {
          const video = common_vendor.index.createVideoContext(`video-${index}`);
          video == null ? void 0 : video.pause();
        }
      });
      const currentVideo = common_vendor.index.createVideoContext(`video-${newIndex}`);
      currentVideo == null ? void 0 : currentVideo.play();
      if (newIndex >= videoList.value.length - 2) {
        getVideoList();
      }
    };
    common_vendor.onMounted(() => {
      for (let i = 0; i < 3; i++) {
        getVideoList();
      }
    });
    const handleVideoClick = (index) => {
      if (index !== currentVideoIndex.value)
        return;
      const video = common_vendor.index.createVideoContext(`video-${index}`);
      if (isPlaying.value) {
        video == null ? void 0 : video.pause();
        isPlaying.value = false;
      } else {
        video == null ? void 0 : video.play();
        isPlaying.value = true;
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(videoList.value, (item, index, i0) => {
          return {
            a: "video-" + index,
            b: item.videoUrl,
            c: item.coverUrl,
            d: common_vendor.o((...args) => _ctx.handleVideoEnd && _ctx.handleVideoEnd(...args), index),
            e: common_vendor.o(($event) => handleVideoClick(index), index),
            f: !isPlaying.value && currentVideoIndex.value === index,
            g: index
          };
        }),
        b: common_assets._imports_0,
        c: common_vendor.o(handleSwiperChange)
      };
    };
  }
};
wx.createPage(_sfc_main);
