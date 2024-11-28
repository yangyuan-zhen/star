<template>
  <view class="home">
    <view class="news-list">
      <view
        v-for="(item, index) in newsList"
        :key="index"
        class="news-item"
        @tap="handleNewsClick(item)"
      >
        <view class="news-content">
          <view class="news-text">
            <view class="news-title">
              <text class="rank">{{ index + 1 }}</text>
              {{ item.word }}
            </view>
            <view class="news-info">
              <text class="hot-score">{{ formatHotScore(item.hotScore) }}</text>
              <image
                v-if="item.hotTagImg"
                :src="item.hotTagImg"
                class="hot-tag-img"
                mode="aspectFit"
              />
            </view>
          </view>
          <image
            v-if="item.img"
            :src="item.img"
            class="news-image"
            mode="aspectFill"
          />
        </view>
      </view>
    </view>

    <view class="loading" v-if="isLoading">加载中...</view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { searchResources } from "../../api/search";

const newsList = ref([]);
const isLoading = ref(false);

const checkLastFetchTime = () => {
  const lastFetchTime = uni.getStorageSync("lastFetchTime");
  const currentTime = new Date().getTime();

  if (!lastFetchTime || currentTime - lastFetchTime > 24 * 60 * 60 * 1000) {
    uni.setStorageSync("lastFetchTime", currentTime);
    return true;
  }
  return false;
};

const fetchNews = async () => {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    const response = await searchResources();
    if (response.code === 200) {
      newsList.value = response.data;
    }
  } catch (error) {
    uni.showToast({
      title: error.message || "获取热榜失败，请稍后重试",
      icon: "none",
      duration: 2000,
    });
  } finally {
    isLoading.value = false;
    uni.stopPullDownRefresh();
  }
};

const handleNewsClick = (item) => {
  // 复制链接到剪贴板
  uni.setClipboardData({
    data: item.url,
    success: function () {
      uni.showModal({
        title: "提示",
        content: "链接已复制，请在浏览器中打开",
        showCancel: false,
      });
    },
  });
};

const formatHotScore = (score) => {
  const num = parseInt(score);
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "万";
  }
  return score;
};

const handleImageError = () => {
  console.log("图片加载失败");
};

onMounted(() => {
  fetchNews();
});

defineExpose({
  onPullDownRefresh() {
    if (checkLastFetchTime()) {
      fetchNews();
    } else {
      uni.showToast({
        title: "请稍后再试",
        icon: "none",
      });
      uni.stopPullDownRefresh();
    }
  },
});
</script>

<style lang="scss">
.home {
  padding: 20rpx;

  .news-list {
    .news-item {
      padding: 20rpx 0;
      border-bottom: 1px solid #eee;

      .news-content {
        display: flex;
        align-items: center;
        gap: 20rpx;

        .news-text {
          flex: 1;

          .news-title {
            font-size: 28rpx;
            margin-bottom: 10rpx;
            display: flex;
            gap: 10rpx;

            .rank {
              color: #ff4444;
              font-weight: bold;
            }
          }

          .news-info {
            display: flex;
            align-items: center;
            gap: 10rpx;

            .hot-score {
              color: #ff4444;
              font-size: 24rpx;
            }

            .hot-tag-img {
              width: 32rpx;
              height: 32rpx;
            }
          }
        }

        .news-image {
          width: 160rpx;
          height: 120rpx;
          border-radius: 8rpx;
        }
      }
    }
  }

  .loading {
    text-align: center;
    padding: 20rpx;
    color: #999;
  }
}
</style>
