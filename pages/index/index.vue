<template>
  <view class="container">
    <!-- 顶部信息栏 -->
    <view
      class="header"
      @tap="showPopup"
      :class="{ init: !hasShown, show: showHeader }"
    >
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
      <!-- <text class="status-text">距离下班还有</text> -->
      <text class="status-result">{{ countdownText }}</text>
    </view>
    <!-- 待办事项 -->
    <view
      class="todo-list-container"
      :class="{ show: showTodoList, init: !hasShown }"
    >
      <TodoList />
    </view>

    <!-- 添加弹窗组件 -->
    <my-popup v-model:show="popupVisible">
      <view class="custom-dialog">
        <view class="dialog-header">
          <text class="dialog-title">自定义设置</text>
        </view>
        <view class="dialog-content">
          <view class="input-group">
            <text class="label">工作日</text>
            <view class="weekday-selector">
              <view
                v-for="(day, index) in [
                  '周日',
                  '周一',
                  '周二',
                  '周三',
                  '周四',
                  '周五',
                  '周六',
                ]"
                :key="index"
                class="weekday-item"
                :class="{ active: selectedWorkDays.includes(index) }"
                @tap="toggleWorkDay(index)"
              >
                {{ day }}
              </view>
            </view>
          </view>
          <view class="input-group">
            <text class="label">上班时间</text>
            <picker
              mode="time"
              :value="customSettings.workStartTime"
              @change="onWorkStartTimeChange"
              class="input"
            >
              <view class="picker-value">{{
                customSettings.workStartTime
              }}</view>
            </picker>
          </view>
          <view class="input-group">
            <text class="label">下班时间</text>
            <picker
              mode="time"
              :value="customSettings.workEndTime"
              @change="onWorkEndTimeChange"
              class="input"
            >
              <view class="picker-value">{{ customSettings.workEndTime }}</view>
            </picker>
          </view>
        </view>
        <view class="dialog-footer">
          <button class="btn cancel" @tap="hideCustomDialog">取消</button>
          <button class="btn confirm" @tap="saveCustomSettings">确定</button>
        </view>
      </view>
    </my-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { onShow, onTabItemTap } from "@dcloudio/uni-app";
import { getQWeather, getLocationId } from "@/api/search.js";
import TodoList from "@/components/home/TodoList.vue";
import MyPopup from "@/components/my-popup/my-popup.vue";

const currentDate = ref(new Date());
const temperature = ref("--");
const weatherText = ref("未知");
const city = ref("定位中...");
const showTodoList = ref(false);
const hasShown = ref(false);
const popupVisible = ref(false);
const isFirstVisit = ref(true); // 添加标记是否首次访问

// 添加新的响应式变量
const customSettings = ref({
  workStartTime: "09:00",
  workEndTime: "18:00",
});

const selectedWorkDays = ref([1, 2, 3, 4, 5]); // 默认周一到周五

// 添加计算属性和响应式变量
const currentTime = ref(new Date());
const countdownTimer = ref(null);

// 添加 header 动画控制变量
const showHeader = ref(false);

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
    uni.getLocation({
      type: "wgs84",
      success: async (res) => {
        try {
          const cityData = await getLocationId(res.longitude, res.latitude);
          if (cityData && cityData.name) {
            city.value = cityData.name;
            // 保存到缓存
            uni.setStorageSync("locationCache", cityData);
            uni.setStorageSync("locationCache_time", Date.now());
            await getWeatherData(cityData.id);
            resolve(cityData);
          } else {
            throw new Error("获取城市信息失败");
          }
        } catch (error) {
          console.error("位置信息处理失败:", error);
          city.value = "未知位置";
          reject(error);
        }
      },
      fail: (err) => {
        console.error("获取位置失败:", err);
        city.value = "未知位置";
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
    // 设置默认值
    city.value = "未知位置";
    temperature.value = "--";
    weatherText.value = "未知";
  }
};

// 修改重置动画的函数
const resetAnimation = () => {
  // 完全重置状态
  hasShown.value = false;
  showTodoList.value = false;
  showHeader.value = false;

  // 使用两个 setTimeout 来确保动画重置和触发
  setTimeout(() => {
    hasShown.value = true;
    setTimeout(() => {
      showTodoList.value = true;
      showHeader.value = true;
    }, 50);
  }, 50);
};

// 当页面显示时
onShow(() => {
  resetAnimation();
});

// 当点击 tabbar 时
onTabItemTap(() => {
  resetAnimation();
});

// 修改 showPopup 方法
const showPopup = () => {
  console.log("showPopup clicked"); // 添加调试日志
  popupVisible.value = true;
};

// 添加新的方法
const hideCustomDialog = () => {
  popupVisible.value = false;
};

const toggleWorkDay = (dayIndex) => {
  const index = selectedWorkDays.value.indexOf(dayIndex);
  if (index === -1) {
    selectedWorkDays.value.push(dayIndex);
  } else {
    selectedWorkDays.value.splice(index, 1);
  }
  selectedWorkDays.value.sort((a, b) => a - b);
};

const onWorkStartTimeChange = (e) => {
  customSettings.value.workStartTime = e.detail.value;
};

const onWorkEndTimeChange = (e) => {
  customSettings.value.workEndTime = e.detail.value;
};

const saveCustomSettings = () => {
  const settings = {
    workStartTime: customSettings.value.workStartTime,
    workEndTime: customSettings.value.workEndTime,
    workDays: selectedWorkDays.value,
  };

  uni.setStorageSync("customSettings", settings);
  isFirstVisit.value = false; // 保存设置后更新首次访问状态

  uni.showToast({
    title: "设置已保存",
    icon: "success",
  });

  hideCustomDialog();
};

// 计算是否是工作日
const isWorkday = computed(() => {
  const today = currentTime.value.getDay();
  return selectedWorkDays.value.includes(today);
});

// 获取今天的上下班时间
const getTodayWorkTime = () => {
  const today = new Date(currentTime.value);
  const [startHour, startMinute] =
    customSettings.value.workStartTime.split(":");
  const [endHour, endMinute] = customSettings.value.workEndTime.split(":");

  const workStartTime = new Date(today.setHours(startHour, startMinute, 0));
  const workEndTime = new Date(today.setHours(endHour, endMinute, 0));

  return {
    workStartTime,
    workEndTime,
  };
};

// 计算是否在上班前
const isBeforeWork = computed(() => {
  const { workStartTime } = getTodayWorkTime();
  return currentTime.value.getTime() < workStartTime.getTime();
});

// 计算是否在下班后
const isAfterWork = computed(() => {
  const { workEndTime } = getTodayWorkTime();
  return currentTime.value.getTime() > workEndTime.getTime();
});

// 修改更新频率为秒级
const updateCurrentTime = () => {
  currentTime.value = new Date();
  // 使用 setTimeout 实现秒级更新
  if (isUpdating.value) {
    setTimeout(updateCurrentTime, 1000);
  }
};

// 添加控制变量
const isUpdating = ref(true);

// 倒计时文本
const countdownText = computed(() => {
  if (!isWorkday.value) return "享受假期!";

  const { workStartTime, workEndTime } = getTodayWorkTime();
  const now = currentTime.value.getTime();

  if (isBeforeWork.value) {
    return "工作未开始";
  } else if (isAfterWork.value) {
    return "工作已结束!";
  } else {
    return formatCountdown(workEndTime.getTime() - now);
  }
});

// 修改格式化倒计时函数，移除毫秒显示
const formatCountdown = (ms) => {
  if (ms < 0) return "00:00:00";

  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

onMounted(() => {
  init();
  // 启动时间更新
  if (isUpdating.value) {
    updateCurrentTime();
  }

  // 加载保存的设置
  const savedSettings = uni.getStorageSync("customSettings");
  if (savedSettings) {
    customSettings.value = {
      workStartTime: savedSettings.workStartTime || "09:00",
      workEndTime: savedSettings.workEndTime || "18:00",
    };
    selectedWorkDays.value = savedSettings.workDays || [1, 2, 3, 4, 5];
    isFirstVisit.value = false; // 有缓存，不是首次访问
  } else {
    // 首次访问，显示弹窗
    popupVisible.value = true;
  }
});

// 修改 onUnmounted
onUnmounted(() => {
  // 停止更新
  isUpdating.value = false;
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
  transform: translateX(-100%); // 初始位置在屏幕左侧
  transition: transform 0.3s ease-out;
  background-color: $theme-color;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  margin: 20rpx;

  &.init {
    transition: none; // 初始状态不需要过渡动画
  }

  &.show {
    transform: translateX(0); // 滑动到原位
  }
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
  margin: 30rpx 0;

  .status-text {
    font-size: 32rpx;
    color: $text-color-secondary;
    margin-bottom: 20rpx;
  }

  .status-result {
    font-size: 48rpx;
    font-weight: bold;
    color: $brand-color;
    font-family: "Courier New", Courier, monospace;
    letter-spacing: 1px;
  }
}

.todo-list-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 70vh;
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
  background-color: $theme-color;
  border-radius: 32rpx 32rpx 0 0;
  padding: 20px;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.1);

  &.init {
    transition: none; // 初始状态不需要过渡动画
  }

  &.show {
    transform: translateY(10%);
  }
}

.custom-dialog {
  background: #fff;
  width: 600rpx;
  border-radius: 24rpx;
  overflow: hidden;

  .dialog-header {
    padding: 30rpx;
    text-align: center;
    border-bottom: 1rpx solid #eee;

    .dialog-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
  }

  .dialog-content {
    padding: 30rpx;

    .input-group {
      margin-bottom: 20rpx;

      .label {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 10rpx;
        display: block;
      }

      .input {
        width: 100%;
        height: 80rpx;
        border: 1rpx solid #eee;
        border-radius: 12rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
      }
    }
  }

  .dialog-footer {
    display: flex;
    border-top: 1rpx solid #eee;

    .btn {
      flex: 1;
      height: 90rpx;
      line-height: 90rpx;
      text-align: center;
      font-size: 32rpx;
      border: none;
      background: none;

      &.cancel {
        color: #666;
        border-right: 1rpx solid #eee;
      }

      &.confirm {
        color: #007aff;
      }

      &:active {
        background-color: #f5f5f5;
      }
    }
  }
}

.weekday-selector {
  display: flex;
  gap: 10rpx;
  margin-top: 10rpx;
}

.weekday-item {
  flex: 1;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 8rpx;
  font-size: 24rpx;
  background-color: #f5f5f5;
  color: #666;
  transition: all 0.3s ease;

  &.active {
    background-color: #007aff;
    color: #fff;
  }
}

.picker-value {
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
}

.input,
picker {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #eee;
  border-radius: 12rpx;
  font-size: 28rpx;
}

// 添加数字跳动动画
@keyframes numberPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.number-animate {
  animation: numberPulse 0.5s ease-in-out;
}
</style>
