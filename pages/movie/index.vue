<template>
  <div class="movie-calendar">
    <div class="header-container">
      <div class="date-header">
        <view class="date-number">{{ currentDay }}</view>
        <view class="date-info">
          <text>{{ currentMonth + 1 }}月</text>
          <text class="ml-2">周{{ weekDayText }}</text>
        </view>
      </div>
    </div>
    <!-- 添加 loading 骨架屏 -->
    <div v-if="isLoading" class="movie-card skeleton">
      <view class="skeleton-poster"></view>
      <view class="skeleton-content">
        <view class="skeleton-title"></view>
        <view class="skeleton-tags">
          <view class="skeleton-tag" v-for="i in 3" :key="i"></view>
        </view>
        <view class="skeleton-text"></view>
        <view class="skeleton-text"></view>
        <view class="skeleton-meta"></view>
      </view>
    </div>
    <!-- 今日电影卡片 -->
    <div v-else-if="todayMovie" class="movie-card">
      <image :src="todayMovie.mov_pic" class="movie-poster" mode="aspectFill" />
      <div class="movie-content">
        <view class="movie-title">{{ todayMovie.mov_title }}</view>
        <view class="movie-tags">
          <text class="tag rating">{{ todayMovie.mov_rating }} 分</text>
          <text class="tag year">{{ todayMovie.mov_year }}</text>
          <text
            v-for="type in todayMovie.mov_type"
            :key="type"
            class="tag type"
          >
            {{ type }}
          </text>
        </view>
        <view class="movie-quote">{{ todayMovie.mov_text }}</view>
        <view class="movie-meta">
          <text>导演：{{ todayMovie.mov_director }} &nbsp</text>
          <text class="ml-2">地区：{{ todayMovie.mov_area }}</text>
        </view>
      </div>
      <view class="source-info" @longpress="copyLink">
        数据来源：此刻电影日历（长按复制链接）
      </view>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getMovieData } from "@/api/search.js";
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
const currentDate = ref(new Date());
const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

const currentDay = computed(() => currentDate.value.getDate());
const currentMonth = computed(() => currentDate.value.getMonth());
const weekDayText = computed(() => weekDays[currentDate.value.getDay()]);
const todayMovie = ref(null);
const isLoading = ref(true);

// 获取电影数据
const fetchMovieData = async () => {
  isLoading.value = true;
  try {
    const data = await getMovieData();
    todayMovie.value = data;
  } catch (error) {
    console.error("获取电影数据失败:", error);
    uni.showToast({
      title: "获取电影数据失败",
      icon: "none",
    });
  } finally {
    isLoading.value = false;
  }
};

// 添加复制链接功能
const copyLink = () => {
  uni.setClipboardData({
    data: "https://www.cikeee.com",
    success: () => {
      uni.showToast({
        title: "链接已复制",
        icon: "success",
      });
    },
  });
};

// 分享给好友
onShareAppMessage(() => {
  return {
    title: todayMovie.value?.mov_title || "今日电影推荐",
    path: "/pages/movie/index",
    imageUrl: todayMovie.value?.mov_pic, // 分享图片，使用电影海报
  };
});

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: todayMovie.value?.mov_title || "今日电影推荐",
    query: "/pages/movie/index",
    imageUrl: todayMovie.value?.mov_pic,
  };
});

onMounted(() => {
  fetchMovieData();
});
</script>

<style scoped lang="scss">
.movie-calendar {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.date-header {
  margin-bottom: 1px;
}

.date-number {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.date-info {
  font-size: 16px;
  color: #666;
}

.movie-card {
  background: white;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.movie-poster {
  width: 100%;
  height: 900rpx;
  border-radius: 8rpx;
  margin-bottom: 16rpx;
  object-fit: cover;
}

.movie-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.movie-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.rating {
  background: #ffe1b3;
  color: #ff9900;
}

.year {
  background: #e8f3ff;
  color: #2196f3;
}

.type {
  background: #f0f0f0;
  color: #666;
}

.movie-quote {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 12px 0;
  font-style: italic;
}

.movie-meta {
  font-size: 12px;
  color: #999;
}

.calendar-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.nav-btn {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: white;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.today-btn {
  padding: 8px 20px;
  background: #333;
  color: white;
  border-radius: 20px;
  font-size: 14px;
}

.source-info {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1px solid #eee;
  font-size: 24rpx;
  color: #999;
  text-align: center;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.history-icon {
  width: 32px;
  height: 32px;
  padding: 10px;
  opacity: 0.6;
}

.history-icon-hover {
  opacity: 1;
  transform: scale(1.1);
  transition: transform 0.2s, opacity 0.2s;
}

// 添加骨架屏样式
.skeleton {
  .skeleton-poster {
    width: 100%;
    height: 900rpx;
    background: #f0f0f0;
    border-radius: 8rpx;
    margin-bottom: 16rpx;
  }

  .skeleton-content {
    padding: 10px;
  }

  .skeleton-title {
    height: 24px;
    background: #f0f0f0;
    margin-bottom: 12px;
    width: 60%;
    border-radius: 4px;
  }

  .skeleton-tags {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .skeleton-tag {
    width: 60px;
    height: 20px;
    background: #f0f0f0;
    border-radius: 4px;
  }

  .skeleton-text {
    height: 16px;
    background: #f0f0f0;
    margin-bottom: 8px;
    border-radius: 4px;

    &:nth-child(2) {
      width: 90%;
    }
  }

  .skeleton-meta {
    height: 14px;
    background: #f0f0f0;
    width: 70%;
    border-radius: 4px;
  }

  .skeleton-poster,
  .skeleton-title,
  .skeleton-tag,
  .skeleton-text,
  .skeleton-meta {
    position: relative;
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      animation: shimmer 1.5s infinite;
    }
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
