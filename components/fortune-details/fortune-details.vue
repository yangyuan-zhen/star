<template>
  <view class="fortune-detail-section">
    <text class="section-title">详细运势</text>
    <view class="fortune-cards">
      <!-- 爱情运势 -->
      <view class="fortune-card">
        <view class="card-header">
          <text class="card-icon love-icon">♥</text>
          <text class="card-title">爱情运势</text>
        </view>
        <view class="star-rating small">
          {{ getStarRating(fortune?.love?.rating || 4) }}
        </view>
        <text class="card-description">
          {{
            fortune?.love?.description ||
            "今天是增进感情的好时机，单身者可能会遇到有趣的人，已有伴侣的人可以计划一次约会，加深彼此了解。"
          }}
        </text>
      </view>

      <!-- 事业运势 -->
      <view class="fortune-card">
        <view class="card-header">
          <text class="card-icon career-icon">💼</text>
          <text class="card-title">事业运势</text>
        </view>
        <view class="star-rating small">
          {{ getStarRating(fortune?.career?.rating || 3) }}
        </view>
        <text class="card-description">
          {{
            fortune?.career?.description ||
            "工作中可能会面临挑战，但你的解决问题能力很强。建议多与同事沟通，团队合作将帮助你度过难关。"
          }}
        </text>
      </view>

      <!-- 财运分析 -->
      <view class="fortune-card">
        <view class="card-header">
          <text class="card-icon wealth-icon">💰</text>
          <text class="card-title">财运分析</text>
        </view>
        <view class="star-rating small">
          {{ getStarRating(fortune?.wealth?.rating || 4) }}
        </view>
        <text class="card-description">
          {{
            fortune?.wealth?.description ||
            "财运不错，但要避免冲动消费。适合做长期理财计划，投资决策需谨慎，可向专业人士咨询。"
          }}
        </text>
      </view>

      <!-- 健康运势 -->
      <view class="fortune-card">
        <view class="card-header">
          <text class="card-icon health-icon">❤️</text>
          <text class="card-title">健康运势</text>
        </view>
        <view class="star-rating small">
          {{ getStarRating(fortune?.health?.rating || 5) }}
        </view>
        <text class="card-description">
          {{
            fortune?.health?.description ||
            "身体状况良好，但注意不要过度劳累。建议多喝水，适量运动，保持良好的作息习惯有助于提高免疫力。"
          }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  fortune: { type: Object, default: () => ({}) },
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
.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.fortune-detail-section {
  margin-bottom: 40rpx;
}

.fortune-cards {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.fortune-card {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin: 0 4rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  width: calc(100% - 8rpx);
  box-sizing: border-box;

  &:active {
    transform: translateY(-5rpx);
  }

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;

    .card-icon {
      width: 50rpx;
      height: 50rpx;
      border-radius: 50%;
      font-size: 28rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12rpx;

      &.love-icon {
        background-color: #fee2e2;
        color: #ef4444;
      }

      &.career-icon {
        background-color: #dbeafe;
        color: #3b82f6;
      }

      &.wealth-icon {
        background-color: #fef3c7;
        color: #f59e0b;
      }

      &.health-icon {
        background-color: #dcfce7;
        color: #22c55e;
      }
    }

    .card-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .card-description {
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
    margin-top: 12rpx;
    padding-right: 10rpx;
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
</style>
