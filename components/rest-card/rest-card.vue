<template>
  <view class="rest-card" @tap="handleCardTap">
    <view class="card-header">
      <text class="title">{{
        isWorkingHours ? "距离下班还有" + countdownTime : "休息时间"
      }}</text>
      <view class="badge" :class="{ working: isWorkingHours }">
        {{ isWorkingHours ? "工作中" : "休息中" }}
      </view>
    </view>
    <view class="content">
      <view class="rest-info">
        <view class="info-item">
          <text class="value">还有{{ daysUntilPayday }}天</text>
          <text class="label">距离发薪日</text>
        </view>
        <view class="info-item">
          <text class="value">{{
            daysUntilFriday === 0 ? "今天就是周五" : `还有${daysUntilFriday}天`
          }}</text>
          <text class="label">{{
            daysUntilFriday === 0 ? "" : "距离周五"
          }}</text>
        </view>
        <view class="info-item">
          <text class="value">还有{{ nextHoliday.days }}天</text>
          <text class="label">距离{{ nextHoliday.name }}</text>
        </view>
        <view class="money-info">
          <text class="money-label">今天赚了</text>
          <text class="money">{{ currentEarnings.toFixed(2) }}</text>
          <text class="unit">¥</text>
        </view>
        <image
          class="icon"
          :src="
            isWorkingHours
              ? '../../static/tabs/onwork.png'
              : '../../static/tabs/offwork.png'
          "
          mode="aspectFit"
        />
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from "vue";

const props = defineProps({
  displaySettings: {
    type: Object,
    required: true,
    default: () => ({
      workStartTime: "09:00",
      workEndTime: "18:00",
      workDays: [1, 2, 3, 4, 5],
    }),
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

const countdownTime = ref("--:--:--");
let timer = null;
const currentEarnings = ref(0);
const isFirstTime = ref(true);

// 计算倒计时
const calculateCountdown = () => {
  const now = new Date();
  const currentTime =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  const [endHours, endMinutes] = props.displaySettings.workEndTime
    .split(":")
    .map(Number);
  const endTime = endHours * 3600 + endMinutes * 60;

  if (!isWorkingHours.value) {
    countdownTime.value = "--:--:--";
    return;
  }

  const remainingSeconds = endTime - currentTime;

  if (remainingSeconds <= 0) {
    countdownTime.value = "00:00:00";
    return;
  }

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  countdownTime.value = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

// 判断当前是否在工作时间
const isWorkingHours = computed(() => {
  // 确保必要的属性存在
  if (
    !props.displaySettings?.workStartTime ||
    !props.displaySettings?.workEndTime ||
    !props.displaySettings?.workDays
  ) {
    return false;
  }

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  // 判断是否是工作日
  const currentDay = now.getDay();
  const isWorkday = props.displaySettings.workDays.includes(currentDay);

  // 如果不是工作日，直接返回 false
  if (!isWorkday) return false;

  // 转换时间字符串为分钟数，便于比较
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const currentMinutes = timeToMinutes(currentTime);
  const startMinutes = timeToMinutes(props.displaySettings.workStartTime);
  const endMinutes = timeToMinutes(props.displaySettings.workEndTime);

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
});

// 计算每秒收入
const calculateHourlyRate = () => {
  const [startHours, startMinutes] = props.displaySettings.workStartTime
    .split(":")
    .map(Number);
  const [endHours, endMinutes] = props.displaySettings.workEndTime
    .split(":")
    .map(Number);

  // 计算工作时长（分钟）
  const workMinutes =
    endHours * 60 + endMinutes - (startHours * 60 + startMinutes);

  // 计算每分钟收入
  const minuteRate = props.displaySettings.dailyIncome / workMinutes;

  // 返回每秒收入
  return minuteRate / 60;
};

// 更新当前收入
const updateEarnings = () => {
  // 如果没有 displaySettings 或者 dailyIncome，设置为 0
  if (!props.displaySettings?.dailyIncome) {
    currentEarnings.value = 0;
    return;
  }

  if (!isWorkingHours.value) {
    const now = new Date();
    const currentTime =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const [endHours, endMinutes] = props.displaySettings.workEndTime
      .split(":")
      .map(Number);
    const endTime = endHours * 3600 + endMinutes * 60;

    if (currentTime > endTime) {
      currentEarnings.value = props.displaySettings.dailyIncome;
    } else {
      currentEarnings.value = 0;
    }
    return;
  }

  // 在工作时间内，从0开始计算
  const now = new Date();
  const currentTime =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const [startHours, startMinutes] = props.displaySettings.workStartTime
    .split(":")
    .map(Number);
  const startTime = startHours * 3600 + startMinutes * 60;

  // 计算已工作的秒数
  const workedSeconds = currentTime - startTime;
  currentEarnings.value = workedSeconds * calculateHourlyRate();
};

// 检查是否首次使用
const checkFirstTimeUser = () => {
  try {
    const hasUsed = uni.getStorageSync("hasUsedRestCard");
    isFirstTime.value = !hasUsed;
    if (isFirstTime.value) {
      // 标记已使用
      uni.setStorageSync("hasUsedRestCard", true);
      // 显示提示
      uni.showModal({
        title: "欢迎使用",
        content: "您可以点击设置来自定义工作时间和收入信息",
        confirmText: "去设置",
        cancelText: "稍后再说",
        success: (res) => {
          if (res.confirm) {
            emit("tap");
          }
        },
      });
    }
  } catch (e) {
    console.error("Storage operation failed:", e);
  }
};

// 修改 onMounted
onMounted(() => {
  nextTick(() => {
    checkFirstTimeUser();
    calculateCountdown();
    updateEarnings();

    timer = setInterval(() => {
      calculateCountdown();
      updateEarnings();
    }, 1000);
  });
});

// 清理定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});

// 修改工作状态监听
watch(isWorkingHours, (newValue) => {
  if (!newValue) {
    // 检查是否已过下班时间
    const now = new Date();
    const currentTime =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const [endHours, endMinutes] = props.displaySettings.workEndTime
      .split(":")
      .map(Number);
    const endTime = endHours * 3600 + endMinutes * 60;

    if (currentTime > endTime) {
      currentEarnings.value = props.displaySettings.dailyIncome;
    } else {
      currentEarnings.value = 0;
    }
  } else {
    // 开始工作时，从0开始计算
    currentEarnings.value = 0;
  }
});

// 计算距离发薪日的天数
const daysUntilPayday = computed(() => {
  // 如果没有设置发薪日，返回 0
  if (!props.displaySettings?.payday) {
    return 0;
  }

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const payday = props.displaySettings.payday;

  // 如果今天的日期小于发薪日，计算本月剩余天数
  if (currentDay < payday) {
    return payday - currentDay;
  }
  // 如果今天的日期大于发薪日，计算到下个月发薪日的天数
  else {
    // 获取当月的最后一天
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    // 计算到下个月发薪日的天数 = (当月剩余天数 + 下月发薪日)
    return lastDayOfMonth - currentDay + parseInt(payday);
  }
});

// 处理点击事件
const handleCardTap = () => {
  emit("tap");
};

const emit = defineEmits(["tap"]);
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
    transition: all 0.3s ease;
  }

  .unit {
    font-size: 26rpx;
    color: #ff6b6b;
  }
}

.badge {
  &.working {
    background: rgba(0, 122, 255, 0.1);
    color: #007aff;
  }

  &:not(.working) {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
  }
}
</style>
