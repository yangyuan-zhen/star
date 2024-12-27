<template>
  <view class="weather-container">
    <view class="weather-header">
      <text class="title">每日天气壁纸</text>
      <text class="subtitle">根据你所在的城市，每天推送精美的诗句和壁纸</text>
    </view>

    <view class="input-section">
      <input
        v-model="cityName"
        type="text"
        placeholder="请输入你的城市名：如 北京、上海、成都"
        placeholder-class="placeholder-style"
        class="city-input"
        auto-focus
        @focus="handleFocus"
        @blur="handleBlur"
        @confirm="getWeatherReport"
      />
      <text class="required">*</text>
    </view>

    <button @tap="getWeatherReport" class="submit-btn" :disabled="!cityName">
      确定
    </button>

    <!-- 结果展示 -->
    <view v-if="weatherData" class="result-section">
      <view class="share-card" id="shareCard">
        <image :src="weatherData.img" mode="widthFix" class="bg-image" />
        <view class="info-section">
          <view class="poetry">{{ weatherData.poetry }}</view>
          <view class="city">{{ weatherData.city }}</view>
          <view class="date"
            >{{ weatherData.date }} {{ weatherData.condition }}</view
          >
          <view class="temperature">
            最高 {{ weatherData.temp_high }}°C 最低 {{ weatherData.temp_low }}°C
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getWeatherReport } from "@/api/search.js";

export default {
  data() {
    return {
      cityName: "",
      weatherData: null,
    };
  },
  methods: {
    async getWeatherReport() {
      if (!this.cityName) {
        uni.showToast({
          title: "请输入城市名称",
          icon: "none",
        });
        return;
      }

      try {
        uni.showLoading({
          title: "加载中...",
        });
        const result = await getWeatherReport(this.cityName);
        this.weatherData = result;
      } catch (error) {
        uni.showToast({
          title: error.message || "获取天气数据失败",
          icon: "none",
        });
      } finally {
        uni.hideLoading();
      }
    },

    handleFocus() {
      // 输入框获取焦点时的处理
      this.$refs.cityInput &&
        (this.$refs.cityInput.style.borderColor = "#409eff");
    },

    handleBlur() {
      // 输入框失去焦点时的处理
      this.$refs.cityInput && (this.$refs.cityInput.style.borderColor = "#eee");
    },
  },
};
</script>

<style lang="scss" scoped>
.weather-container {
  padding: 32rpx;
}

.weather-header {
  text-align: center;
  margin-bottom: 48rpx;

  .title {
    font-size: 40rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 16rpx;
    display: block;
  }

  .subtitle {
    font-size: 28rpx;
    color: #666;
  }
}

.input-section {
  position: relative;
  margin-bottom: 24rpx;
  background: #ffffff;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  .city-input {
    width: 100%;
    height: 88rpx;
    background: #ffffff;
    border: 2rpx solid #eee;
    border-radius: 8rpx;
    padding: 0 30rpx;
    font-size: 28rpx;
    box-sizing: border-box;
    transition: all 0.3s ease;

    &:focus {
      border-color: #409eff;
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
  }

  .placeholder-style {
    color: #999;
    font-size: 26rpx;
  }

  .required {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 12rpx;
    color: #ff4d4f;
  }
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  background: #5b6c8b;
  color: #ffffff;
  font-size: 32rpx;
  border-radius: 8rpx;
  border: none;
  margin: 0;
  padding: 0;
  line-height: 88rpx;

  &::after {
    border: none;
  }

  &:disabled {
    opacity: 0.6;
  }
}

.result-section {
  margin-top: 32rpx;
}

.share-card {
  border-radius: 12rpx;
  overflow: hidden;
  background: #ffffff;

  .bg-image {
    width: 100%;
    display: block;
  }

  .info-section {
    padding: 32rpx;
    text-align: center;

    .poetry {
      font-size: 28rpx;
      color: #333;
      line-height: 1.6;
      margin-bottom: 24rpx;
    }

    .city {
      font-size: 36rpx;
      color: #333;
      margin-bottom: 16rpx;
    }

    .date,
    .temperature {
      font-size: 24rpx;
      color: #666;
      margin-bottom: 8rpx;
    }
  }
}
</style>
