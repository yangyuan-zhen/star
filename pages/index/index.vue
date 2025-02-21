<template>
  <view class="container">
    <!-- 顶部信息栏 -->
    <view class="header">
      <view class="date-time">
        <text class="date">{{ formatDate }}</text>
        <text class="time">{{ formatTime }}</text>
      </view>
      <view class="weather">
        <image src="/static/home/定位.svg" class="location-icon"></image>
        <text>{{ city }}</text>
        <text>{{ temperature }}°C {{ weatherText }}</text>
      </view>
    </view>
    <!-- 中间状态显示 -->
    <view class="status-container">
      <text class="status-text">下班倒计时</text>
      <text class="status-result">工作已结束!</text>
    </view>
    <!-- 待办事项 -->
    <TodoList />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getQWeather, getLocationId } from "@/api/search.js";
import TodoList from "@/components/home/TodoList.vue";

const currentDate = ref(new Date());
const temperature = ref("--");
const weatherText = ref("未知");
const city = ref("定位中...");

// 格式化日期
const formatDate = computed(() => {
  const date = currentDate.value;
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
});

// 格式化时间
const formatTime = computed(() => {
  const date = currentDate.value;
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
});

// 更新时间
const updateDateTime = () => {
  currentDate.value = new Date();
};

// 获取天气数据
const getWeatherData = async (locationId) => {
  try {
    const res = await getQWeather(locationId);
    if (res && res.now) {
      temperature.value = res.now.temp;
      weatherText.value = res.now.text;
    }
  } catch (error) {
    console.error("获取天气数据失败:", error);
    uni.showToast({
      title: "获取天气信息失败",
      icon: "none",
      duration: 2000,
    });
  }
};

// 获取位置信息
const getLocation = () => {
  // 先检查缓存
  const cachedLocation = uni.getStorageSync("locationCache");
  const cacheTime = uni.getStorageSync("locationCache_time");
  const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

  if (cachedLocation && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
    city.value = cachedLocation.name;
    return getWeatherData(cachedLocation.id);
  }

  return new Promise((resolve, reject) => {
    // 先请求授权
    uni.authorize({
      scope: "scope.userLocation",
      success: () => {
        // 授权成功后获取位置
        uni.getLocation({
          type: "wgs84",
          success: async (res) => {
            try {
              const cityData = await getLocationId(res.longitude, res.latitude);
              city.value = cityData.name;
              await getWeatherData(cityData.id);
              resolve(cityData);
            } catch (error) {
              console.error("位置信息处理失败:", error);
              city.value = "未知位置";
              await getWeatherData();
              reject(error);
            }
          },
          fail: (err) => {
            console.error("获取位置失败:", err);
            city.value = "未知位置";
            getWeatherData();
            reject(err);
          },
        });
      },
      fail: (err) => {
        console.error("位置授权失败:", err);
        // 如果是拒绝授权，显示打开设置的对话框
        uni.showModal({
          title: "提示",
          content:
            "需要获取您的位置才能显示准确的天气信息，是否打开设置页面重新授权？",
          success: (res) => {
            if (res.confirm) {
              uni.openSetting();
            }
          },
        });
        city.value = "未知位置";
        getWeatherData();
        reject(err);
      },
    });
  });
};

// 初始化函数
const init = async () => {
  try {
    await getLocation();
  } catch (error) {
    console.error("初始化位置或天气失败:", error);
  }
};

// 在组件挂载时初始化
onMounted(() => {
  // 初始化时间
  updateDateTime();
  // 设置定时器，每秒更新一次
  setInterval(updateDateTime, 1000);
  // 获取位置和天气
  init();
});
</script>

<style lang="scss">
.container {
  padding: 20px;
  background-color: $theme-color;
  min-height: 100vh;
  height: 100vh;
  color: $text-color;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  box-sizing: border-box;
}

.date-time {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.date,
.time {
  font-size: 16px;
  color: $brand-color;
}

.weather {
  font-size: 16px;
  display: flex;
  align-items: center;
  color: $brand-color;
  gap: 4rpx;

  .location-icon {
    width: 36rpx;
    height: 36rpx;
    display: inline-block;
    fill: $brand-color;
    transition: fill 0.3s ease;

    &:hover {
      fill: darken($brand-color, 10%);
    }
  }

  text {
    line-height: 36rpx;
  }
}

.status-container {
  text-align: center;
}

.status-text {
  font-size: 18px;
  margin-bottom: 10px;
  display: block;
  color: $text-color-secondary;
}

.status-result {
  font-size: 24px;
  font-weight: bold;
  display: block;
  color: $brand-color;
}
</style>
