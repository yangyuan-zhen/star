<template>
  <view class="nav-bar">
    <view class="title-section">
      <text class="icon-star">★</text>
      <text class="title">星座运势</text>
    </view>
    <view class="action-section">
      <slot name="action"></slot>
    </view>
  </view>
</template>

<script setup>
const emit = defineEmits(["settings"]);

const onSettings = () => {
  emit("settings");
};
</script>

<style lang="scss">
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);

  .title-section {
    display: flex;
    align-items: center;

    .icon-star {
      color: #6366f1;
      font-size: 40rpx;
      margin-right: 10rpx;
    }

    .title {
      font-size: 36rpx;
      font-weight: bold;
      color: #6366f1;
    }
  }

  .action-section {
    display: flex;
    gap: 30rpx;
    .icon-settings {
      font-size: 40rpx;
      color: #666;
    }
  }
}
</style>
