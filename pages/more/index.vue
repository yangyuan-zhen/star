<template>
  <view class="more-container">
    <view class="grid-container">
      <view class="grid-item" @tap="handleNavigate('textSnap')">
        <image class="icon" src="../../static/tabs/textSnap.png" />
        <text>文字图片</text>
      </view>

      <view class="grid-item" @tap="handleNavigate('weather')">
        <image class="icon" src="../../static/tabs/weather.png" />
        <text>天气画报</text>
      </view>

      <view class="grid-item" @tap="handleNavigate('book')">
        <image class="icon" src="../../static/tabs/book.png" />
        <text>AI荐书</text>
      </view>

      <view class="grid-item" @tap="handleNavigate('translation')">
        <image class="icon" src="../../static/tabs/translation.png" />
        <text>中英互译</text>
      </view>

      <view class="grid-item" @tap="handleNavigate('codeHelper')">
        <image class="icon" src="../../static/tabs/code.png" />
        <text>代码prompt</text>
      </view>
      <view class="grid-item" @tap="handleNavigate('movie')">
        <image class="icon" src="../../static/tabs/movie.png" />
        <text>电影日历</text>
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
