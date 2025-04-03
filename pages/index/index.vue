<template>
  <view class="container">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <view class="title-section">
        <text class="icon-star">★</text>
        <text class="title">星座运势</text>
      </view>
      <view class="action-section">
        <text class="icon-settings" @tap="showSettings">⚙️</text>
      </view>
    </view>

    <!-- 主内容区 -->
    <scroll-view scroll-y class="content-area">
      <!-- 当前星座运势卡片 -->
      <view
        class="zodiac-card"
        :style="{ background: getZodiacGradient(currentZodiac) }"
      >
        <view v-if="loading" class="loading-container">
          <view class="loading-icon"></view>
          <text class="loading-text">加载中...</text>
        </view>

        <view v-else class="zodiac-header">
          <view class="zodiac-name-date">
            <text class="zodiac-name">{{ currentZodiac }}</text>
            <text class="zodiac-date">{{
              getZodiacDateRange(currentZodiac)
            }}</text>
          </view>
          <view class="zodiac-fortune">
            <text class="fortune-label">今日综合运势</text>
            <view class="star-rating">
              {{ getStarRating(fortuneData?.overall?.rating || 4) }}
            </view>
          </view>
          <text class="zodiac-description">
            {{
              fortuneData?.summary ||
              "今天你的直觉特别敏锐，适合做重要决策。人际关系方面会有意外惊喜，工作上可能遇到挑战但能顺利解决。建议保持积极心态，适当放松心情。"
            }}
          </text>
          <view class="tag-container">
            <text class="tag"
              >🔢 幸运数字：{{ fortuneData?.luckyNumber || "7" }}</text
            >
            <text class="tag"
              >🎨 幸运色：{{ fortuneData?.luckyColor || "深蓝色" }}</text
            >
            <text class="tag"
              >👥 今日贵人：{{ fortuneData?.luckyZodiac || "水瓶座" }}</text
            >
          </view>
        </view>
        <!-- 星座图标 -->
        <view class="zodiac-image-section">
          <view class="zodiac-image-container">
            <image
              :src="getZodiacIconPath(currentZodiac)"
              class="zodiac-image"
              mode="aspectFit"
            ></image>
          </view>
        </view>
      </view>

      <!-- 详细运势 -->
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
              {{ getStarRating(fortuneData?.love?.rating || 4) }}
            </view>
            <text class="card-description">
              {{
                fortuneData?.love?.description ||
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
              {{ getStarRating(fortuneData?.career?.rating || 3) }}
            </view>
            <text class="card-description">
              {{
                fortuneData?.career?.description ||
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
              {{ getStarRating(fortuneData?.wealth?.rating || 4) }}
            </view>
            <text class="card-description">
              {{
                fortuneData?.wealth?.description ||
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
              {{ getStarRating(fortuneData?.health?.rating || 5) }}
            </view>
            <text class="card-description">
              {{
                fortuneData?.health?.description ||
                "身体状况良好，但注意不要过度劳累。建议多喝水，适量运动，保持良好的作息习惯有助于提高免疫力。"
              }}
            </text>
          </view>
        </view>
      </view>

      <!-- 今日提示 -->
      <view class="daily-tips-section">
        <text class="section-title">今日提示</text>
        <view class="tips-container">
          <view class="tips-group">
            <view class="tips-header">
              <text class="tips-icon good">✓</text>
              <text class="tips-title">今日宜</text>
            </view>
            <view class="tips-list">
              <template v-if="fortuneData?.goodFor">
                <view
                  class="tip-item"
                  v-for="(item, index) in fortuneData.goodFor.split(',')"
                  :key="'good-' + index"
                >
                  <text class="tip-icon">{{ getRandomIcon("good") }}</text>
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
              <template v-if="fortuneData?.badFor">
                <view
                  class="tip-item"
                  v-for="(item, index) in fortuneData.badFor.split(',')"
                  :key="'bad-' + index"
                >
                  <text class="tip-icon">{{ getRandomIcon("bad") }}</text>
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
    </scroll-view>

    <!-- 使用星座设置组件 -->
    <zodiac-settings
      v-model:show="settingsVisible"
      :current-zodiac="currentZodiac"
      :birth-date="birthDate"
      @save="saveUserSettings"
    />
  </view>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { onShow } from "@dcloudio/uni-app";
import ZodiacSettings from "../../components/zodiac-settings/zodiac-settings.vue";

// 星座相关数据
const zodiacSigns = [
  "白羊座",
  "金牛座",
  "双子座",
  "巨蟹座",
  "狮子座",
  "处女座",
  "天秤座",
  "天蝎座",
  "射手座",
  "摩羯座",
  "水瓶座",
  "双鱼座",
];

// 星座元素映射
const zodiacElements = {
  白羊座: "fire",
  狮子座: "fire",
  射手座: "fire",
  金牛座: "earth",
  处女座: "earth",
  摩羯座: "earth",
  双子座: "air",
  天秤座: "air",
  水瓶座: "air",
  巨蟹座: "water",
  天蝎座: "water",
  双鱼座: "water",
};

// 星座日期范围映射
const zodiacDateRanges = {
  白羊座: "3月21日-4月19日",
  金牛座: "4月20日-5月20日",
  双子座: "5月21日-6月21日",
  巨蟹座: "6月22日-7月22日",
  狮子座: "7月23日-8月22日",
  处女座: "8月23日-9月22日",
  天秤座: "9月23日-10月23日",
  天蝎座: "10月24日-11月22日",
  射手座: "11月23日-12月21日",
  摩羯座: "12月22日-1月19日",
  水瓶座: "1月20日-2月18日",
  双鱼座: "2月19日-3月20日",
};

// 状态变量
const currentZodiac = ref("天蝎座");
const birthDate = ref("2000-01-01");
const settingsVisible = ref(false);
const loading = ref(false);
const fortuneData = ref(null); // 星座运势数据

// 获取星座图标路径
const getZodiacIconPath = (zodiac) => {
  return `/static/stars/${zodiac}.svg`;
};

// 获取星座日期范围
const getZodiacDateRange = (zodiac) => {
  return zodiacDateRanges[zodiac] || "";
};

// 根据星座元素获取渐变色
const getZodiacGradient = (zodiac) => {
  const element = zodiacElements[zodiac];
  switch (element) {
    case "fire":
      return "linear-gradient(135deg, #ff7700 0%, #ff3300 100%)";
    case "earth":
      return "linear-gradient(135deg, #77aa33 0%, #336633 100%)";
    case "air":
      return "linear-gradient(135deg, #33ccff 0%, #3366ff 100%)";
    case "water":
      return "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"; // 默认紫色渐变
    default:
      return "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)";
  }
};

// 根据当前日期获取对应的星座
const getCurrentDateZodiac = () => {
  const now = new Date();
  const month = now.getMonth() + 1; // 月份从0开始，需要+1
  const day = now.getDate();

  return getZodiacByDate(month, day);
};

// 根据日期计算星座
const getZodiacByDate = (month, day) => {
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return "水瓶座";
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return "双鱼座";
  } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return "白羊座";
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return "金牛座";
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
    return "双子座";
  } else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
    return "巨蟹座";
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return "狮子座";
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return "处女座";
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
    return "天秤座";
  } else if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) {
    return "天蝎座";
  } else if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) {
    return "射手座";
  } else {
    return "摩羯座";
  }
};

// 设置相关
const showSettings = () => {
  settingsVisible.value = true;
};

// 保存用户设置
const saveUserSettings = (settings) => {
  currentZodiac.value = settings.sign;
  birthDate.value = settings.birthDate;

  uni.setStorageSync("userZodiac", {
    sign: settings.sign,
    birthDate: settings.birthDate,
  });

  fetchZodiacData(settings.sign);
};

// 从云函数获取星座运势数据
const fetchZodiacData = async (zodiacName = null) => {
  loading.value = true;
  try {
    const zodiacToFetch = zodiacName || currentZodiac.value;

    const { result } = await uniCloud.callFunction({
      name: "getZodiacFortune",
      data: { zodiac: zodiacToFetch },
    });

    if (result.code === 0 && result.data) {
      // 适配新的数据结构
      const { zodiacInfo, fortune } = result.data;

      // 将数据映射到页面所需格式
      fortuneData.value = {
        date: fortune.date,
        summary: fortune.overall?.description || "",
        overall: {
          level: fortune.overall?.level || "一般",
          rating: Math.round((fortune.overall?.index || 50) / 20), // 转换为1-5星评级
        },
        love: {
          rating: Math.round((fortune.love?.index || 50) / 20),
          description: fortune.love?.description || "",
        },
        career: {
          rating: Math.round((fortune.career?.index || 50) / 20),
          description: fortune.career?.description || "",
        },
        wealth: {
          rating: Math.round((fortune.wealth?.index || 50) / 20),
          description: fortune.wealth?.description || "",
        },
        health: {
          rating: Math.round((fortune.health?.index || 50) / 20),
          description: fortune.health?.description || "",
        },
        luckyColor: fortune.luckyColor || "",
        luckyNumber: fortune.luckyNumber || "",
        luckyZodiac: getRandomZodiac(zodiacToFetch), // 随机选择一个幸运星座
        goodFor: fortune.goodFor || "",
        badFor: fortune.badFor || "",
      };

      console.log("获取星座运势成功:", fortuneData.value);
    } else {
      console.error("获取星座运势失败:", result.message);
      uni.showToast({
        title: "获取星座运势失败: " + result.message,
        icon: "none",
      });
    }
  } catch (error) {
    console.error("获取星座运势出错:", error);
    uni.showToast({
      title: "网络异常，请稍后再试",
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
};

// 获取随机的幸运星座（除了自己）
const getRandomZodiac = (currentZodiac) => {
  // 排除当前星座
  const otherZodiacs = zodiacSigns.filter((z) => z !== currentZodiac);
  // 随机选择一个
  return otherZodiacs[Math.floor(Math.random() * otherZodiacs.length)];
};

// 初始化加载
onMounted(() => {
  // 加载保存的星座设置
  const savedZodiac = uni.getStorageSync("userZodiac");

  if (savedZodiac && savedZodiac.sign) {
    currentZodiac.value = savedZodiac.sign;
    birthDate.value = savedZodiac.birthDate || "2000-01-01";
  } else {
    // 如果用户没有设置星座，使用当前日期的星座
    currentZodiac.value = getCurrentDateZodiac();
  }

  // 获取星座运势数据
  fetchZodiacData(currentZodiac.value);
});

// 页面显示时刷新数据
onShow(() => {
  fetchZodiacData(currentZodiac.value);
});

// 当星座变化时，刷新数据
watch(currentZodiac, (newVal) => {
  fetchZodiacData(newVal);
});

// 获取随机图标
const getRandomIcon = (type) => {
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
    "🏃",
    "🍺",
    "🎰",
    "😡",
    "💤",
    "🚬",
    "🍔",
    "🎭",
    "📺",
    "📱",
  ];

  const icons = type === "good" ? goodIcons : badIcons;
  return icons[Math.floor(Math.random() * icons.length)];
};

// 添加一个生成星级评分的方法
const getStarRating = (rating = 0, maxRating = 5) => {
  const validRating = Math.min(Math.max(Math.round(rating || 0), 0), maxRating);
  const fullStars = "★".repeat(validRating);
  const emptyStars = "☆".repeat(maxRating - validRating);
  return fullStars + emptyStars;
};
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  max-width: 100%;
  overflow-x: hidden;
}

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

    .icon-user,
    .icon-settings {
      font-size: 40rpx;
      color: #666;
    }
  }
}

.content-area {
  flex: 1;
  padding: 30rpx 40rpx;
  box-sizing: border-box;
  width: 100%;
}

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
    height: 300rpx;
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
      filter: brightness(0) invert(1); // 使SVG图标变为白色
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
