<template>
  <view class="quick-access">
    <view class="section-title">快捷功能</view>
    <view class="grid-container">
      <view
        class="grid-item"
        v-for="(item, index) in quickLinks"
        :key="index"
        @tap="navigateTo(item.path)"
      >
        <image :src="item.icon" class="grid-icon"></image>
        <text class="grid-text">{{ item.title }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
const quickLinks = [
  { title: "备忘录", icon: "/static/home/note.svg", path: "/pages/note/index" },
  {
    title: "天气画报",
    icon: "/static/home/weather.svg",
    path: "/pages/weather/index",
  },
  { title: "AI荐书", icon: "/static/home/book.svg", path: "/pages/book/index" },
  {
    title: "智能翻译",
    icon: "/static/home/translate.svg",
    path: "/pages/translation/index",
  },
];

const navigateTo = (path) => {
  uni.navigateTo({ url: path });
};
</script>

<style lang="scss" scoped>
.quick-access {
  padding: 20rpx;
  background-color: $uni-color-white;
  border-radius: $uni-radius-lg;
  margin: 20rpx;

  .section-title {
    font-size: $uni-font-size-lg;
    color: $text-color;
    margin-bottom: 20rpx;
    font-weight: 500;
  }

  .grid-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;
  }

  .grid-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx;

    &:active {
      opacity: 0.7;
    }
  }

  .grid-icon {
    width: 48rpx;
    height: 48rpx;
    margin-bottom: 10rpx;
  }

  .grid-text {
    font-size: $uni-font-size-sm;
    color: $text-color-secondary;
  }
}
</style>
