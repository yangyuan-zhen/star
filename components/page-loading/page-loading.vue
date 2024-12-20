<template>
  <view class="loading-container" v-if="show">
    <image class="logo" src="../../static/tabs/logo.png" mode="aspectFit" />
    <text class="title">{{ title }}</text>
    <view class="loading-dots">
      <text v-for="i in 3" :key="i" class="dot"></text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "热搜榜",
  },
});
</script>

<style lang="scss" scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  .logo {
    width: 120rpx;
    height: 120rpx;
    margin-bottom: 30rpx;
  }

  .title {
    font-size: 32rpx;
    color: #333;
    margin-bottom: 20rpx;
  }

  .loading-dots {
    display: flex;
    gap: 8rpx;

    .dot {
      width: 8rpx;
      height: 8rpx;
      background-color: #999;
      border-radius: 50%;
      animation: loading 1.4s infinite;

      &:nth-child(2) {
        animation-delay: 0.2s;
      }

      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }
}

@keyframes loading {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>
