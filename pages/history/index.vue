<template>
  <view class="history-container">
    <view class="history-list">
      <view v-for="item in historyList" :key="item.title" class="history-item">
        <view class="history-item__year">
          <text class="history-item__year-text">[{{ item.year }}年]</text>
          <text class="history-item__date"
            >{{ item.month }}月{{ item.day }}日</text
          >
        </view>
        <view class="history-item__title">{{ item.title }}</view>
        <view class="history-item__divider"></view>
      </view>
    </view>
  </view>
</template>

<script>
import { historyToday } from "../../api/search.js";

export default {
  data() {
    return {
      historyList: [],
    };
  },
  onLoad() {
    this.fetchHistory();
  },
  methods: {
    async fetchHistory() {
      try {
        const response = await historyToday();
        if (response.code === 1) {
          this.historyList = response.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.history {
  &-container {
    min-height: 100vh;
    background-color: #fff;
  }

  &-list {
    padding: 0 32rpx;
  }

  &-item {
    padding: 20rpx 0;
    width: 100%;
    box-sizing: border-box;

    &__year {
      display: flex;
      align-items: center;
      margin-bottom: 8rpx;
      flex-wrap: wrap;

      &-text {
        color: rgb(177, 124, 67);
        font-size: 28rpx;
        margin-right: 8rpx;
      }
    }

    &__date {
      font-size: 28rpx;
      color: #000;
    }

    &__title {
      font-size: 28rpx;
      color: #000;
      line-height: 1.5;
      padding-top: 4rpx;
      word-wrap: break-word;
      word-break: break-all;
      white-space: pre-wrap;
    }

    &__divider {
      margin-top: 20rpx;
      height: 2rpx;
      background: #f5f5f5;
      background-image: linear-gradient(
        to right,
        #eeeeee 0%,
        #eeeeee 50%,
        transparent 50%
      );
      background-size: 8rpx 2rpx;
      background-repeat: repeat-x;
    }

    &:last-child {
      .history-item__divider {
        display: none;
      }
    }
  }
}
</style>
