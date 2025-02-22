<template>
  <view class="more-container">
    <view class="grid-container">
      <view class="grid-card" @tap="handleNavigate('textSnap')">
        <view class="card-content">
          <view class="icon-wrapper">
            <uni-icons
              type="compose"
              size="30"
              :color="getIconColor(1)"
            ></uni-icons>
          </view>
          <text class="card-title">文字图片</text>
          <text class="card-desc">快速生成文字图片</text>
        </view>
      </view>

      <view class="grid-card" @tap="handleNavigate('weather')">
        <view class="card-content">
          <view class="icon-wrapper">
            <uni-icons
              type="image"
              size="30"
              :color="getIconColor(2)"
            ></uni-icons>
          </view>
          <text class="card-title">天气画报</text>
          <text class="card-desc">今日天气预报</text>
        </view>
      </view>

      <view class="grid-card" @tap="handleNavigate('book')">
        <view class="card-content">
          <view class="icon-wrapper">
            <uni-icons
              type="bars"
              size="30"
              :color="getIconColor(3)"
            ></uni-icons>
          </view>
          <text class="card-title">AI荐书</text>
          <text class="card-desc">智能图书推荐</text>
        </view>
      </view>

      <view class="grid-card" @tap="handleNavigate('translation')">
        <view class="card-content">
          <view class="icon-wrapper">
            <uni-icons
              type="chat"
              size="30"
              :color="getIconColor(4)"
            ></uni-icons>
          </view>
          <text class="card-title">AI智能翻译</text>
          <text class="card-desc">智能翻译助手</text>
        </view>
      </view>

      <view class="grid-card" @tap="handleNavigate('movie')">
        <view class="card-content">
          <view class="icon-wrapper">
            <uni-icons
              type="videocam"
              size="30"
              :color="getIconColor(6)"
            ></uni-icons>
          </view>
          <text class="card-title">电影日历</text>
          <text class="card-desc">每日电影推荐</text>
        </view>
      </view>

      <view class="grid-card" @tap="handleNavigate('shopping')">
        <view class="card-content">
          <view class="icon-wrapper">
            <uni-icons
              type="shop"
              size="30"
              :color="getIconColor(7)"
            ></uni-icons>
          </view>
          <text class="card-title">买什么</text>
          <text class="card-desc">智能购物建议</text>
        </view>
      </view>
    </view>

    <my-popup ref="popup" type="center">
      <view class="custom-dialog">
        <view class="dialog-header">
          <text class="dialog-title">自定义设置</text>
        </view>
        <view class="dialog-content">
          <view class="input-group">
            <text class="label">发薪日期</text>
            <input
              type="number"
              v-model="customSettings.payday"
              class="input"
              placeholder="请输入发薪日期(1-31)"
              @input="validatePayday"
              maxlength="2"
            />
          </view>
          <view class="input-group">
            <text class="label">日收入</text>
            <input
              type="digit"
              v-model="customSettings.dailyIncome"
              class="input"
              placeholder="请输入日收入金额"
              @input="validateDailyIncome"
            />
          </view>
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
import { ref, onMounted, nextTick, computed } from "vue";
import MyPopup from "../../components/my-popup/my-popup.vue";

const handleNavigate = (type) => {
  const routes = {
    history: "/pages/history/index",
    textSnap: "/pages/textSnap/index",
    weather: "/pages/weather/index",
    book: "/pages/book/index",
    translation: "/pages/translation/index",
    codeHelper: "/pages/codeHelper/index",
    movie: "/pages/movie/index",
    shopping: "/pages/shopping/index",
  };

  if (routes[type]) {
    uni.navigateTo({
      url: routes[type],
      animationType: "slide-in-right",
      animationDuration: 300,
      fail: (err) => {
        console.error("页面跳转失败:", err);
        uni.showToast({
          title: "页面跳转失败",
          icon: "none",
        });
      },
    });
  }
};

const getIconColor = (index) => {
  const colors = {
    1: "#007aff",
    2: "#ff6b6b",
    3: "#4caf50",
    4: "#9c27b0",
    5: "#ff9800",
    6: "#795548",
    7: "#00bcd4",
  };
  return colors[index] || "#007aff";
};

const popup = ref(null);
const customSettings = ref({
  payday: "",
  dailyIncome: "",
  workStartTime: "09:00",
  workEndTime: "18:00",
});

const displaySettings = ref({
  payday: 0,
  dailyIncome: 0,
  workStartTime: "09:00",
  workEndTime: "18:00",
  workDays: [1, 2, 3, 4, 5],
});

const showCustomDialog = async () => {
  await nextTick();
  if (popup.value) {
    popup.value.open();
  } else {
    console.error("popup ref is not initialized");
  }
};

const hideCustomDialog = () => {
  popup.value.close();
};

const saveCustomSettings = () => {
  // 验证输入
  const payday = parseInt(customSettings.value.payday);
  const dailyIncome = parseFloat(customSettings.value.dailyIncome);

  if (isNaN(payday) || payday < 1 || payday > 31) {
    uni.showToast({
      title: "请输入有效的发薪日期(1-31)",
      icon: "none",
    });
    return;
  }

  if (isNaN(dailyIncome) || dailyIncome < 0) {
    uni.showToast({
      title: "请输入有效的收入金额",
      icon: "none",
    });
    return;
  }

  // 更新显示设置
  displaySettings.value = {
    payday: payday,
    dailyIncome: dailyIncome,
    workStartTime: customSettings.value.workStartTime,
    workEndTime: customSettings.value.workEndTime,
    workDays: selectedWorkDays.value,
  };

  // 保存设置到本地存储
  uni.setStorageSync("customSettings", displaySettings.value);

  uni.showToast({
    title: "设置已保存",
    icon: "success",
  });

  hideCustomDialog();
};

// 验证发薪日期输入
const validatePayday = (e) => {
  let value = e.detail.value;
  // 只允许输入数字
  value = value.replace(/[^\d]/g, "");
  // 限制范围在 1-31
  let num = parseInt(value);
  if (num > 31) {
    num = 31;
  } else if (num < 1) {
    num = 1;
  }
  customSettings.value.payday = num.toString();
};

// 验证日收入输入
const validateDailyIncome = (e) => {
  let value = e.detail.value;
  // 只允许输入数字和小数点
  value = value.replace(/[^\d.]/g, "");
  // 确保只有一个小数点
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }
  // 限制小数位数为2位
  if (parts.length === 2 && parts[1].length > 2) {
    value = parts[0] + "." + parts[1].slice(0, 2);
  }
  customSettings.value.dailyIncome = value;
};

const shareInfo = {
  title: "工具小助手",
  path: "/pages/more/index",
  imageUrl: "", // 确保你有这个分享图片
  desc: "查看节假日、其他工具等信息",
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
    query: "", // 可选：分享时携带的查询参数
  };
};

// 将这两个方法定义为页面选项
defineExpose({
  onShareAppMessage,
  onShareTimeline,
});

const selectedWorkDays = ref([1, 2, 3, 4, 5]); // 默认周一到周五

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

onMounted(() => {
  const savedSettings = uni.getStorageSync("customSettings");
  if (savedSettings) {
    displaySettings.value = {
      payday: savedSettings.payday,
      dailyIncome: savedSettings.dailyIncome,
      workStartTime: savedSettings.workStartTime || "09:00",
      workEndTime: savedSettings.workEndTime || "18:00",
      workDays: savedSettings.workDays || [1, 2, 3, 4, 5],
    };

    customSettings.value = {
      payday: savedSettings.payday?.toString() || "0",
      dailyIncome: savedSettings.dailyIncome?.toString() || "0",
      workStartTime: savedSettings.workStartTime || "09:00",
      workEndTime: savedSettings.workEndTime || "18:00",
    };
    selectedWorkDays.value = savedSettings.workDays || [1, 2, 3, 4, 5];
  } else {
    // 首次使用时，设置为 0
    customSettings.value = {
      payday: "0",
      dailyIncome: "0",
      workStartTime: "09:00",
      workEndTime: "18:00",
    };
  }

  console.log("popup ref:", popup.value);
});
</script>

<style scoped lang="scss">
.more-container {
  min-height: 100vh;
  padding: 20rpx;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
  padding: 20rpx;
  margin-top: 30rpx;
}

.grid-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.8) 100%
  );
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4rpx;
    background: linear-gradient(
      90deg,
      var(--card-color, #007aff) 0%,
      var(--card-color-secondary, #00bcd4) 100%
    );
    opacity: 0.8;
  }

  .card-content {
    padding: 30rpx 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
  }

  .icon-wrapper {
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 122, 255, 0.1);
    border-radius: 16rpx;
    margin-bottom: 8rpx;
  }

  .card-title {
    font-size: 28rpx;
    color: #333;
    font-weight: 600;
  }

  .card-desc {
    font-size: 22rpx;
    color: #666;
    margin-top: 4rpx;
  }
}

// 为不同卡片设置不同的主题色
.grid-card {
  &:nth-child(1) {
    --card-color: #007aff;
    --card-color-secondary: #00bcd4;
  }
  &:nth-child(2) {
    --card-color: #ff6b6b;
    --card-color-secondary: #ffd93d;
  }
  &:nth-child(3) {
    --card-color: #4caf50;
    --card-color-secondary: #8bc34a;
  }
  &:nth-child(4) {
    --card-color: #9c27b0;
    --card-color-secondary: #e91e63;
  }
  &:nth-child(5) {
    --card-color: #ff9800;
    --card-color-secondary: #ff5722;
  }
  &:nth-child(6) {
    --card-color: #795548;
    --card-color-secondary: #8d6e63;
  }
  &:nth-child(7) {
    --card-color: #00bcd4;
    --card-color-secondary: #03a9f4;
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

/* 确保输入框和选择器样式统一 */
.input,
picker {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #eee;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.picker-value {
  height: 100%;
  line-height: 80rpx;
  padding: 0 20rpx;
}
</style>
