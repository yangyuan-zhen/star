<template>
  <view class="more-container">
    <view class="grid-container">
      <view class="grid-item" @tap="handleNavigate('history')">
        <image class="icon" src="../../static/tabs/today.png" />
        <text>历史上的今天</text>
      </view>

      <view class="grid-item" @tap="handleNavigate('textSnap')">
        <image class="icon" src="../../static/tabs/textSnap.png" />
        <text>文字转图片</text>
      </view>

      <view class="grid-item" @tap="handleNavigate('weather')">
        <image class="icon" src="../../static/tabs/weather.png" />
        <text>天气画报</text>
      </view>
    </view>
  </view>
</template>

<script setup>
const handleNavigate = (type) => {
  const routes = {
    history: "/pages/history/index",
    textSnap: "/pages/textSnap/index",
    weather: "/pages/weather/index",
  };

  if (routes[type]) {
    uni.navigateTo({
      url: routes[type],
    });
  }
};
</script>

<style scoped lang="scss">
.more-container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  padding: 10rpx;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 8rpx;
}

.icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 10rpx;
}

text {
  font-size: 24rpx;
  color: #333;
}
</style>
