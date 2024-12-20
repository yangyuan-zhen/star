<template>
  <view class="home">
    <page-loading :show="isPageLoading" title="热搜榜" />

    <view class="news-list" v-show="!isPageLoading">
      <view
        v-for="(item, index) in newsList"
        :key="index"
        class="news-item"
        :class="{ 'news-item-expanded': item.isExpanded }"
      >
        <view class="news-content" @tap="handleNewsClick(item)">
          <view class="rank-column">
            <text class="rank" :class="{ 'top-three': index < 3 }">{{
              index + 1
            }}</text>
            <view class="expand-btn" @tap.stop="toggleExpand(index)">
              <text class="expand-icon" :class="{ expanded: item.isExpanded }"
                >▼</text
              >
            </view>
          </view>

          <view class="news-main">
            <view class="news-text">
              <view class="news-title">{{ item.word }}</view>
              <view class="news-info">
                <text class="hot-score">{{
                  formatHotScore(item.hotScore)
                }}</text>
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

        <view v-if="item.isExpanded" class="news-desc">
          {{ item.desc || "暂无描述" }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import PageLoading from "../../components/page-loading/page-loading.vue";
import { searchResources } from "../../api/search";

const newsList = ref([]);
const isLoading = ref(false);
const isPageLoading = ref(true);

// 分享配置
const shareInfo = {
  title: "实时热搜榜",
  path: "/pages/index/index",
  imageUrl: "", // 可以添加分享图片的路径
  desc: "查看最新热搜话题",
};

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
      newsList.value = response.data.map((item) => ({
        ...item,
        isExpanded: false,
      }));
    }
  } catch (error) {
    uni.showToast({
      title: error.message || "获取热榜失败，请稍后重试",
      icon: "none",
      duration: 2000,
    });
  } finally {
    isLoading.value = false;
    isPageLoading.value = false;
    uni.stopPullDownRefresh();
  }
};

const handleNewsClick = (item) => {
  // 复制链接到剪贴板
  uni.setClipboardData({
    data: item.url,
    success: () => {
      uni.showModal({
        title: "提示",
        content:
          "链接已复制到剪贴板。由于微信小程序政策限制，个人小程序不支持直接打开网页，请在浏览器中粘贴链接查看。",
        showCancel: false,
        confirmText: "我知道了",
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

const toggleExpand = (index) => {
  newsList.value[index] = {
    ...newsList.value[index],
    isExpanded: !newsList.value[index].isExpanded,
  };
};

// 分享给朋友
const onShareAppMessage = () => {
  return {
    title: shareInfo.title,
    path: shareInfo.path,
    imageUrl: shareInfo.imageUrl,
    desc: shareInfo.desc,
  };
};

// 分享到朋友圈
const onShareTimeline = () => {
  return {
    title: shareInfo.title,
    path: shareInfo.path,
    imageUrl: shareInfo.imageUrl,
    query: "", // 可选：分享��携带的查询参数
  };
};

onMounted(() => {
  Promise.all([
    fetchNews(),
    new Promise((resolve) => setTimeout(resolve, 1500)),
  ]).then(() => {
    isPageLoading.value = false;
  });
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
  onShareAppMessage,
  onShareTimeline,
});
</script>

<style lang="scss">
.home {
  padding: 30rpx 20rpx;
  background: #f6f7f9;
  min-height: 100vh;

  .news-list {
    .news-item {
      background: #fff;
      border-radius: 16rpx;
      padding: 24rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
      transition: all 0.3s ease;

      &-expanded {
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
      }

      .news-content {
        display: flex;
        gap: 20rpx;
      }

      .rank-column {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30rpx;
        padding-top: 6rpx;

        .rank {
          font-size: 32rpx;
          font-weight: 600;
          color: #999;

          &.top-three {
            color: #ff4444;
          }
        }

        .expand-btn {
          padding: 8rpx;
          margin-top: 10rpx;

          .expand-icon {
            display: block;
            color: #999;
            font-size: 24rpx;
            transition: transform 0.3s ease;

            &.expanded {
              transform: rotate(180deg);
            }
          }
        }
      }

      .news-main {
        flex: 1;
        display: flex;
        gap: 20rpx;
      }

      .news-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .news-title {
          font-size: 30rpx;
          line-height: 1.5;
          font-weight: 500;
          color: #333;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .news-info {
          display: flex;
          align-items: center;
          gap: 12rpx;
          margin-top: 12rpx;

          .hot-score {
            color: #ff4444;
            font-size: 26rpx;
            font-weight: 500;
          }

          .hot-tag-img {
            width: 32rpx;
            height: 32rpx;
          }
        }
      }

      .news-image {
        width: 180rpx;
        height: 140rpx;
        border-radius: 12rpx;
        object-fit: cover;
      }

      .news-desc {
        font-size: 28rpx;
        color: #666;
        line-height: 1.6;
        padding: 20rpx;
        background-color: #f8f9fa;
        border-radius: 12rpx;
        margin-top: 20rpx;
      }
    }
  }

  .loading {
    text-align: center;
    padding: 30rpx;
    color: #999;
    font-size: 28rpx;
  }
}
</style>
