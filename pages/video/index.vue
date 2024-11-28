<template>
  <view class="video-container">
    <swiper class="video-swiper" vertical @change="handleSwiperChange">
      <swiper-item v-for="(item, index) in videoList" :key="index">
        <video
          :id="'video-' + index"
          class="video-player"
          :src="item.videoUrl"
          :poster="item.coverUrl"
          object-fit="cover"
          @ended="handleVideoEnd"
          :show-play-btn="false"
          :controls="false"
          :loop="true"
          @click="handleVideoClick(index)"
        ></video>

        <image
          v-show="!isPlaying && currentVideoIndex === index"
          class="play-icon"
          src="/static/video-active.png"
          mode="aspectFit"
        ></image>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { videoResources } from "../../api/search.js";

const videoList = ref([]);
const currentVideoIndex = ref(0);
const isPlaying = ref(true);

// 获取视频列表
const getVideoList = async () => {
  try {
    const res = await videoResources();
    if (res.code === 200) {
      videoList.value.push({
        videoUrl: res.video,
        coverUrl: "", // 可选的封面图
      });
    }
  } catch (error) {
    console.error("获取视频失败：", error);
  }
};

// 处理视频切换
const handleSwiperChange = (e) => {
  const newIndex = e.detail.current;
  currentVideoIndex.value = newIndex;
  isPlaying.value = true;

  // 停止其他视频播放
  videoList.value.forEach((_, index) => {
    if (index !== newIndex) {
      const video = uni.createVideoContext(`video-${index}`);
      video?.pause();
    }
  });

  // 播放当前视频
  const currentVideo = uni.createVideoContext(`video-${newIndex}`);
  currentVideo?.play();

  // 如果快到底部了，加载更多视频
  if (newIndex >= videoList.value.length - 2) {
    getVideoList();
  }
};

onMounted(() => {
  // 初始加载视频
  for (let i = 0; i < 3; i++) {
    getVideoList();
  }
});

const handleTabClick = (tab) => {
  // 处理标签点击事件
  console.log("切换到:", tab);
};

const handleVideoClick = (index) => {
  if (index !== currentVideoIndex.value) return;

  const video = uni.createVideoContext(`video-${index}`);
  if (isPlaying.value) {
    video?.pause();
    isPlaying.value = false;
  } else {
    video?.play();
    isPlaying.value = true;
  }
};
</script>

<style lang="scss">
.video-container {
  width: 100vw;
  height: 100vh;
  background-color: #000;

  .video-swiper {
    width: 100%;
    height: 100%;
  }

  .video-player {
    width: 100%;
    height: 100%;
  }

  .video-info {
    position: absolute;
    right: 20rpx;
    bottom: 200rpx;
    z-index: 1;
    color: #fff;
  }

  .tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10;

    .tab-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10rpx 0;

      .tab-icon {
        width: 48rpx;
        height: 48rpx;
        margin-bottom: 4rpx;
      }

      .tab-text {
        font-size: 24rpx;
        color: #fff;
      }
    }
  }

  .play-icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 128rpx;
    height: 128rpx;
    z-index: 2;
  }
}
</style>
