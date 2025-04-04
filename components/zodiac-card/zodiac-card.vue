<template>
  <view class="zodiac-card" :style="{ background: gradient }" ref="cardRef">
    <view v-if="loading" class="loading-container">
      <view class="loading-icon"></view>
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else class="zodiac-header">
      <view class="zodiac-name-date">
        <text class="zodiac-name">{{ zodiacName }}</text>
        <text class="zodiac-date">{{ dateRange }}</text>
      </view>
      <view class="zodiac-fortune">
        <text class="fortune-label">今日综合运势</text>
        <view class="star-rating">
          {{ getStarRating(fortune?.overall?.rating || 4) }}
        </view>
      </view>
      <text class="zodiac-description">
        {{
          fortune?.summary ||
          "今天你的直觉特别敏锐，适合做重要决策。人际关系方面会有意外惊喜，工作上可能遇到挑战但能顺利解决。建议保持积极心态，适当放松心情。"
        }}
      </text>
      <view class="tag-container">
        <text class="tag">🔢 幸运数字：{{ fortune?.luckyNumber || "7" }}</text>
        <text class="tag"
          >🎨 幸运色：{{ fortune?.luckyColor || "深蓝色" }}</text
        >
        <text class="tag"
          >👥 今日贵人：{{ fortune?.luckyZodiac || "水瓶座" }}</text
        >
      </view>
    </view>

    <view class="zodiac-image-section">
      <view class="zodiac-image-container">
        <image :src="iconPath" class="zodiac-image" mode="aspectFit"></image>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  zodiacName: { type: String, required: true },
  dateRange: { type: String, default: "" },
  fortune: { type: Object, default: () => ({}) },
  loading: { type: Boolean, default: false },
  gradient: { type: String, required: true },
  iconPath: { type: String, required: true },
});

// 星级评分生成函数
const getStarRating = (rating = 0, maxRating = 5) => {
  const validRating = Math.min(Math.max(Math.round(rating || 0), 0), maxRating);
  const fullStars = "★".repeat(validRating);
  const emptyStars = "☆".repeat(maxRating - validRating);
  return fullStars + emptyStars;
};
</script>

<style lang="scss">
.zodiac-card {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 24rpx;
  overflow: hidden;
  margin: 0 4rpx 40rpx 4rpx;
  color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  width: calc(100% - 8rpx);
  box-sizing: border-box;

  .zodiac-header {
    padding: 30rpx;

    .zodiac-name-date {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;

      .zodiac-name {
        font-size: 40rpx;
        font-weight: bold;
        margin-right: 20rpx;
      }

      .zodiac-date {
        font-size: 24rpx;
        background: rgba(255, 255, 255, 0.2);
        padding: 4rpx 16rpx;
        border-radius: 100rpx;
      }
    }

    .zodiac-fortune {
      margin-bottom: 20rpx;

      .fortune-label {
        font-size: 28rpx;
        display: block;
        margin-bottom: 8rpx;
      }
    }

    .zodiac-description {
      font-size: 28rpx;
      line-height: 1.6;
      margin-bottom: 20rpx;
    }

    .tag-container {
      display: flex;
      flex-wrap: wrap;
      gap: 16rpx;
      margin-top: 20rpx;

      .tag {
        background: rgba(255, 255, 255, 0.2);
        padding: 8rpx 20rpx;
        border-radius: 100rpx;
        font-size: 24rpx;
      }
    }
  }

  .zodiac-image-section {
    width: 100%;
    height: 200rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20rpx;
    margin-bottom: 30rpx;
    position: relative;
    background-color: rgba(0, 0, 0, 0.1);

    &::before {
      content: "";
      position: absolute;
      width: 170rpx;
      height: 170rpx;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.15);
      border: 4rpx solid rgba(255, 255, 255, 0.3);
      z-index: 0;
    }

    .zodiac-image {
      position: relative;
      z-index: 1;
      width: 100rpx;
      height: 100rpx;
      filter: brightness(0) invert(1);
      opacity: 0.9;
    }
  }
}

.star-rating {
  color: #f59e0b;
  font-size: 36rpx;
  line-height: 1;

  &.small {
    font-size: 30rpx;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50rpx 0;

  .loading-icon {
    width: 60rpx;
    height: 60rpx;
    border: 6rpx solid rgba(255, 255, 255, 0.3);
    border-top: 6rpx solid #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    color: #fff;
    margin-top: 20rpx;
    font-size: 28rpx;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
