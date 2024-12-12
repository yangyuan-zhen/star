<template>
  <view class="more-container">
    <!-- 年度进度卡片 -->
    <view class="progress-card" :style="backgroundStyle">
      <view class="content-wrapper">
        <view class="year-info">
          <text class="year">{{ currentYear }}年余额</text>
          <view class="days-wrapper">
            <text class="days">{{ remainingDays }}</text>
            <text class="days-unit">天</text>
          </view>
          <view class="time-details">
            {{ hours }}时{{ minutes }}分{{ seconds }}秒
          </view>
        </view>
        <view class="progress-circle">
          <view class="circle-wrapper">
            <view class="circle-bg"></view>
            <view
              class="circle-progress"
              :style="{
                transform: `rotate(${progressDegrees}deg)`,
              }"
            ></view>
            <view class="percentage-wrapper">
              <text class="percentage-number">{{ progressPercentage }}</text>
              <text class="percentage-sign">%</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 原有的网格布局 -->
    <view class="grid-container">
      <view class="grid-item" @tap="handleNavigate('textSnap')">
        <image class="icon" src="../../static/tabs/textSnap.png" />
        <text class="grid-text">文字图片</text>
      </view>

      <view class="grid-item" @tap="handleNavigate('weather')">
        <image class="icon" src="../../static/tabs/weather.png" />
        <text class="grid-text">天气画报</text>
      </view>

      <view class="grid-item" @tap="handleNavigate('book')">
        <image class="icon" src="../../static/tabs/book.png" />
        <text class="grid-text">AI荐书</text>
      </view>

      <view class="grid-item" @tap="handleNavigate('translation')">
        <image class="icon" src="../../static/tabs/translation.png" />
        <text class="grid-text">中英互译</text>
      </view>

      <view class="grid-item" @tap="handleNavigate('codeHelper')">
        <image class="icon" src="../../static/tabs/code.png" />
        <text class="grid-text">代码prompt</text>
      </view>
      <view class="grid-item" @tap="handleNavigate('movie')">
        <image class="icon" src="../../static/tabs/movie.png" />
        <text class="grid-text">电影日历</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const currentYear = ref(new Date().getFullYear());
const remainingDays = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const progressPercentage = ref(0);
const progressDegrees = ref(0);
let timer = null;

// 直接使用本地图片路径
const backgroundStyle = computed(() => ({
  backgroundImage: "url(../../static/tabs/background03_larg.jpg)",
}));

// 计算年度进度
const calculateProgress = () => {
  const now = new Date();
  currentYear.value = now.getFullYear(); // 更新当前年份
  const startOfYear = new Date(currentYear.value, 0, 1);
  const endOfYear = new Date(currentYear.value, 11, 31, 23, 59, 59, 999);

  // 计算剩余时间（精确到毫秒）
  const timeLeft = endOfYear - now;
  remainingDays.value = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  hours.value = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  minutes.value = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  seconds.value = Math.floor((timeLeft % (1000 * 60)) / 1000);

  // 计算进度百分比（精确到毫秒）
  const totalMilliseconds = endOfYear - startOfYear;
  const elapsedMilliseconds = now - startOfYear;

  // 计算精确的百分比，包括小时、分钟和秒的影响
  const percentage = (elapsedMilliseconds / totalMilliseconds) * 100;
  progressPercentage.value = percentage.toFixed(2);

  // 计算精确的角度
  progressDegrees.value = (percentage / 100) * 360;
};

onMounted(() => {
  calculateProgress(); // 初始计算
  // 每秒更新一次
  timer = setInterval(calculateProgress, 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});

const handleNavigate = (type) => {
  const routes = {
    history: "/pages/history/index",
    textSnap: "/pages/textSnap/index",
    weather: "/pages/weather/index",
    book: "/pages/book/index",
    translation: "/pages/translation/index",
    codeHelper: "/pages/codeHelper/index",
    movie: "/pages/movie/index",
  };

  const preloadRoutes = {
    textSnap: "/pages/textSnap/index",
    weather: "/pages/weather/index",
    book: "/pages/book/index",
  };

  if (routes[type]) {
    uni.navigateTo({
      url: routes[type],
      animationType: "slide-in-right",
      animationDuration: 300,
      fail: (err) => {
        console.error("页面跳转失败:", err);
        uni.showToast({
          title: "页面跳转失败",
          icon: "none",
        });
      },
    });
  }
};
</script>

<style scoped lang="scss">
.more-container {
  min-height: 100vh;
  padding: 20rpx;
}

.progress-card {
  position: relative;
  border-radius: 32rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 260rpx;

  .content-wrapper {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.year-info {
  position: relative;
  z-index: 2;

  .year {
    font-size: 32rpx;
    color: #ffffff;
    margin-bottom: 16rpx;
    display: block;
    opacity: 0.9;
  }

  .days-wrapper {
    display: flex;
    align-items: baseline;
    margin-bottom: 16rpx;

    .days {
      font-size: 80rpx;
      font-weight: bold;
      color: #ffffff;
      line-height: 1;
    }

    .days-unit {
      font-size: 32rpx;
      color: #ffffff;
      margin-left: 8rpx;
      opacity: 0.9;
    }
  }

  .time-details {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.9);
  }
}

.progress-circle {
  position: relative;
  z-index: 2;
  margin-right: -20rpx;

  .circle-wrapper {
    position: relative;
    width: 140rpx;
    height: 140rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .circle-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 6rpx solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    box-sizing: border-box;
  }

  .circle-progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 6rpx solid #ffffff;
    border-radius: 50%;
    box-sizing: border-box;
    clip: rect(0, 70rpx, 140rpx, 0);
    transform-origin: center;
  }

  .percentage-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .percentage-number {
      font-size: 36rpx;
      color: #ffffff;
      font-weight: bold;
      line-height: 1;
    }

    .percentage-sign {
      font-size: 24rpx;
      color: #ffffff;
      margin-top: 4rpx;
    }
  }
}

.grid-container {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  padding: 10rpx;
}

.grid-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .icon {
    width: 60rpx;
    height: 60rpx;
    margin-bottom: 10rpx;
  }

  .grid-text {
    font-size: 24rpx;
    color: #333333;
    margin-top: 8rpx;
  }
}
</style>
