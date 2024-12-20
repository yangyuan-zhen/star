<template>
  <view class="rest-card" @tap="$emit('tap')">
    <view class="card-header">
      <text class="title">休息时间</text>
      <view class="badge">工作日</view>
    </view>
    <view class="content">
      <view class="rest-info">
        <view class="info-item">
          <text class="value">还有{{ displaySettings.payday }}天</text>
          <text class="label">距离发薪日</text>
        </view>
        <view class="info-item">
          <text class="value">还有{{ daysUntilFriday }}天</text>
          <text class="label">距离周五</text>
        </view>
        <view class="info-item">
          <text class="value">还有{{ nextHoliday.days }}天</text>
          <text class="label">距离{{ nextHoliday.name }}</text>
        </view>
        <view class="money-info">
          <text class="money-label">今天赚了</text>
          <text class="money">{{
            displaySettings.dailyIncome.toFixed(2)
          }}</text>
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
</template>

<script setup>
defineProps({
  displaySettings: {
    type: Object,
    required: true,
  },
  daysUntilFriday: {
    type: Number,
    required: true,
  },
  nextHoliday: {
    type: Object,
    required: true,
  },
});

defineEmits(["tap"]);
</script>

<style scoped lang="scss">
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
</style>
