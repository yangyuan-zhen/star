<template>
  <view class="more-container">
    <view class="rest-card" @tap="showCustomDialog">
      <view class="card-header">
        <text class="title">休息时间</text>
        <view class="badge">工作日</view>
      </view>
      <view class="content">
        <view class="rest-info">
          <view class="info-item">
            <text class="value">{{ displaySettings.payday }}</text>
            <text class="label">发薪</text>
            <text class="unit">天</text>
          </view>
          <view class="info-item">
            <text class="value">{{ daysUntilFriday }}</text>
            <text class="label">周五</text>
            <text class="unit">天</text>
          </view>
          <view class="info-item">
            <!-- 下一个节日 -->
            <text class="value">11</text>
            <text class="label">平安夜</text>
            <text class="unit">天</text>
          </view>
          <view class="money-info">
            <text class="money-label">今天赚了</text>
            <text class="money">{{
              displaySettings.dailyIncome.toFixed(2)
            }}</text>
            <text class="unit">¥</text>
          </view>
          <image
            class="icon"
            src="../../static/tabs/offwork.png"
            mode="aspectFit"
          />
        </view>
      </view>
    </view>

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
          <text class="card-title">中英互译</text>
          <text class="card-desc">智能翻译助手</text>
        </view>
      </view>

      <view class="grid-card" @tap="handleNavigate('codeHelper')">
        <view class="card-content">
          <view class="icon-wrapper">
            <uni-icons
              type="settings"
              size="30"
              :color="getIconColor(5)"
            ></uni-icons>
          </view>
          <text class="card-title">代码prompt</text>
          <text class="card-desc">编程助手</text>
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
  };
  return colors[index] || "#007aff";
};

const popup = ref(null);
const customSettings = ref({
  payday: "",
  dailyIncome: "",
});

const displaySettings = ref({
  payday: 28,
  dailyIncome: 1000.0,
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

// 计算距离下个周五的天数
const daysUntilFriday = computed(() => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 是周日，5 是周五

  // 如果今天是周五，显示0
  if (currentDay === 5) {
    return 0;
  }

  // 计算到下个周五的天数
  if (currentDay < 5) {
    // 如果当前是周五之前
    return 5 - currentDay;
  } else {
    // 如果当前是周六或周日
    return 5 + (7 - currentDay);
  }
});

onMounted(() => {
  const savedSettings = uni.getStorageSync("customSettings");
  if (savedSettings) {
    displaySettings.value = savedSettings;
    customSettings.value = {
      payday: savedSettings.payday.toString(),
      dailyIncome: savedSettings.dailyIncome.toString(),
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

// 添加休息时间卡片样式
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
  }

  .unit {
    font-size: 26rpx;
    color: #ff6b6b;
  }
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
</style>
