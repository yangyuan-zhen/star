<template>
  <view class="more-container">
    <view class="rest-card">
      <view class="card-header">
        <text class="title">休息时间</text>
        <view class="badge">工作日</view>
      </view>
      <view class="content">
        <view class="rest-info">
          <view class="info-item">
            <text class="value">28</text>
            <text class="label">发薪</text>
            <text class="unit">天</text>
          </view>
          <view class="info-item">
            <text class="value">0</text>
            <text class="label">周五</text>
            <text class="unit">天</text>
          </view>
          <view class="info-item">
            <!-- 下一个节日 -->
            <text class="value">11</text>
            <text class="label">平安夜</text>
            <text class="unit">天</text>
          </view>
          <view class="money-info">
            <text class="money-label">今天赚了</text>
            <text class="money">1000.00</text>
            <text class="unit">¥</text>
          </view>
          <image
            class="icon"
            src="../../static/tabs/offwork.png"
            mode="aspectFit"
          />
        </view>
      </view>
    </view>

    <view class="grid-container">
      <view class="grid-card" @tap="handleNavigate('textSnap')">
        <view class="card-content">
          <view class="icon-wrapper">
            <uni-icons
              type="compose"
              size="30"
              :color="getIconColor(1)"
            ></uni-icons>
          </view>
          <text class="card-title">文字图片</text>
          <text class="card-desc">快速生成文字图片</text>
        </view>
      </view>

      <view class="grid-card" @tap="handleNavigate('weather')">
        <view class="card-content">
          <view class="icon-wrapper">
            <uni-icons
              type="image"
              size="30"
              :color="getIconColor(2)"
            ></uni-icons>
          </view>
          <text class="card-title">天气画报</text>
          <text class="card-desc">今日天气预报</text>
        </view>
      </view>

      <view class="grid-card" @tap="handleNavigate('book')">
        <view class="card-content">
          <view class="icon-wrapper">
            <uni-icons
              type="bars"
              size="30"
              :color="getIconColor(3)"
            ></uni-icons>
          </view>
          <text class="card-title">AI荐书</text>
          <text class="card-desc">智能图书推荐</text>
        </view>
      </view>

      <view class="grid-card" @tap="handleNavigate('translation')">
        <view class="card-content">
          <view class="icon-wrapper">
            <uni-icons
              type="chat"
              size="30"
              :color="getIconColor(4)"
            ></uni-icons>
          </view>
          <text class="card-title">中英互译</text>
          <text class="card-desc">智能翻译助手</text>
        </view>
      </view>

      <view class="grid-card" @tap="handleNavigate('codeHelper')">
        <view class="card-content">
          <view class="icon-wrapper">
            <uni-icons
              type="settings"
              size="30"
              :color="getIconColor(5)"
            ></uni-icons>
          </view>
          <text class="card-title">代码prompt</text>
          <text class="card-desc">编程助手</text>
        </view>
      </view>

      <view class="grid-card" @tap="handleNavigate('movie')">
        <view class="card-content">
          <view class="icon-wrapper">
            <uni-icons
              type="videocam"
              size="30"
              :color="getIconColor(6)"
            ></uni-icons>
          </view>
          <text class="card-title">电影日历</text>
          <text class="card-desc">每日电影推荐</text>
        </view>
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

const getIconColor = (index) => {
  const colors = {
    1: "#007aff",
    2: "#ff6b6b",
    3: "#4caf50",
    4: "#9c27b0",
    5: "#ff9800",
    6: "#795548",
  };
  return colors[index] || "#007aff";
};
</script>

<style scoped lang="scss">
.more-container {
  min-height: 100vh;
  padding: 20rpx;
}

// 添加休息时间卡片样式
.rest-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 24rpx;
  padding: 30rpx;
  margin: 20rpx;
  box-shadow: 0 8rpx 32rpx -4rpx rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.6);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6rpx;
    background: linear-gradient(90deg, #007aff 0%, #00bcd4 100%);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;

    .title {
      font-size: 34rpx;
      color: #333;
      font-weight: 600;
    }

    .badge {
      background: rgba(0, 122, 255, 0.1);
      color: #007aff;
      font-size: 24rpx;
      padding: 4rpx 16rpx;
      border-radius: 20rpx;
    }
  }

  .icon {
    position: absolute;
    right: -20rpx;
    bottom: -30rpx;
    width: 140rpx;
    height: 140rpx;
    opacity: 0.8;
    transform: rotate(-5deg);
  }
}

.content {
  position: relative;
}

.rest-info {
  display: flex;
  flex-wrap: wrap;
  gap: 40rpx;
  position: relative;
  z-index: 1;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16rpx;
  backdrop-filter: blur(10px);
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }

  .value {
    font-size: 32rpx;
    color: #333;
    font-weight: 600;
    margin-bottom: 8rpx;
  }

  .label {
    font-size: 24rpx;
    color: #666;
    margin-bottom: 4rpx;
  }

  .unit {
    font-size: 22rpx;
    color: #999;
  }
}

.money-info {
  display: flex;
  align-items: center;
  background: rgba(255, 107, 107, 0.1);
  padding: 12rpx 24rpx;
  border-radius: 30rpx;
  margin-top: 20rpx;

  .money-label {
    font-size: 26rpx;
    color: #666;
  }

  .money {
    font-size: 32rpx;
    color: #ff6b6b;
    font-weight: 600;
    margin: 0 8rpx;
  }

  .unit {
    font-size: 26rpx;
    color: #ff6b6b;
  }
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
  padding: 20rpx;
  margin-top: 30rpx;
}

.grid-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.8) 100%
  );
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4rpx;
    background: linear-gradient(
      90deg,
      var(--card-color, #007aff) 0%,
      var(--card-color-secondary, #00bcd4) 100%
    );
    opacity: 0.8;
  }

  .card-content {
    padding: 30rpx 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
  }

  .icon-wrapper {
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 122, 255, 0.1);
    border-radius: 16rpx;
    margin-bottom: 8rpx;
  }

  .card-title {
    font-size: 28rpx;
    color: #333;
    font-weight: 600;
  }

  .card-desc {
    font-size: 22rpx;
    color: #666;
    margin-top: 4rpx;
  }
}

// 为不同卡片设置不同的主题色
.grid-card {
  &:nth-child(1) {
    --card-color: #007aff;
    --card-color-secondary: #00bcd4;
  }
  &:nth-child(2) {
    --card-color: #ff6b6b;
    --card-color-secondary: #ffd93d;
  }
  &:nth-child(3) {
    --card-color: #4caf50;
    --card-color-secondary: #8bc34a;
  }
  &:nth-child(4) {
    --card-color: #9c27b0;
    --card-color-secondary: #e91e63;
  }
  &:nth-child(5) {
    --card-color: #ff9800;
    --card-color-secondary: #ff5722;
  }
  &:nth-child(6) {
    --card-color: #795548;
    --card-color-secondary: #8d6e63;
  }
}
</style>
