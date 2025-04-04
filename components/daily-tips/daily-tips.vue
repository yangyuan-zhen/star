<template>
  <view class="daily-tips-section">
    <text class="section-title">今日提示</text>
    <view class="tips-container">
      <view class="tips-group">
        <view class="tips-header">
          <text class="tips-icon good">✓</text>
          <text class="tips-title">今日宜</text>
        </view>
        <view class="tips-list">
          <template v-if="fortune?.goodFor">
            <view
              class="tip-item"
              v-for="(item, index) in fortune.goodFor.split(',')"
              :key="'good-' + index"
            >
              <text class="tip-icon">{{ getRandomIcon("good", index) }}</text>
              <text class="tip-text">{{ item.trim() }}</text>
            </view>
          </template>
          <template v-else>
            <view class="tip-item">
              <text class="tip-icon">📚</text>
              <text class="tip-text">学习新知识</text>
            </view>
            <view class="tip-item">
              <text class="tip-icon">👥</text>
              <text class="tip-text">社交活动</text>
            </view>
            <view class="tip-item">
              <text class="tip-icon">📝</text>
              <text class="tip-text">制定计划</text>
            </view>
          </template>
        </view>
      </view>
      <view class="tips-group">
        <view class="tips-header">
          <text class="tips-icon bad">✗</text>
          <text class="tips-title">今日忌</text>
        </view>
        <view class="tips-list">
          <template v-if="fortune?.badFor">
            <view
              class="tip-item"
              v-for="(item, index) in fortune.badFor.split(',')"
              :key="'bad-' + index"
            >
              <text class="tip-icon">{{ getRandomIcon("bad", index) }}</text>
              <text class="tip-text">{{ item.trim() }}</text>
            </view>
          </template>
          <template v-else>
            <view class="tip-item">
              <text class="tip-icon">💳</text>
              <text class="tip-text">冲动消费</text>
            </view>
            <view class="tip-item">
              <text class="tip-icon">💬</text>
              <text class="tip-text">言语冲突</text>
            </view>
            <view class="tip-item">
              <text class="tip-icon">🏃</text>
              <text class="tip-text">过度劳累</text>
            </view>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  fortune: { type: Object, default: () => ({}) },
});

// 获取随机图标函数
const getRandomIcon = (type, index = 0) => {
  const goodIcons = [
    "📚",
    "👥",
    "📝",
    "🧘",
    "🏃",
    "🛌",
    "📱",
    "🎮",
    "☕",
    "🎵",
    "🧠",
    "✍️",
  ];
  const badIcons = [
    "💳",
    "💬",
    "⚠️",
    "🍺",
    "🎰",
    "😡",
    "💤",
    "🚬",
    "🍔",
    "🎭",
    "📺",
    "⏰",
  ];

  const icons = type === "good" ? goodIcons : badIcons;
  return icons[index % icons.length];
};
</script>

<style lang="scss">
.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.daily-tips-section {
  margin-bottom: 40rpx;
}

.tips-container {
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  margin: 0 4rpx;
  width: calc(100% - 8rpx);
  box-sizing: border-box;
}

.tips-group {
  padding: 24rpx;

  &:not(:last-child) {
    border-bottom: 2rpx solid #f5f5f5;
  }

  .tips-header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .tips-icon {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12rpx;
      font-size: 24rpx;

      &.good {
        background-color: #dcfce7;
        color: #22c55e;
      }

      &.bad {
        background-color: #fee2e2;
        color: #ef4444;
      }
    }

    .tips-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
    }
  }
}

.tips-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.tip-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;

  .tip-icon {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
  }

  .tip-text {
    font-size: 24rpx;
    color: #666;
    text-align: center;
  }
}
</style>
