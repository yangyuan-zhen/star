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
      />
      <text class="required">*</text>
    </view>

    <button @tap="getWeatherReport" class="submit-btn" :disabled="!cityName">
      输入
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

      <!-- 按钮 -->
      <view class="action-buttons">
        <button class="action-btn save-btn" @tap="saveImage">保存到相册</button>
        <button
          class="action-btn share-btn"
          @tap="shareImage"
          open-type="share"
        >
          分享给朋友
        </button>
      </view>
    </view>

    <!-- 用于生成图片的隐藏canvas -->
    <canvas
      type="2d"
      id="tempCanvas"
      :style="{
        position: 'fixed',
        left: '-9999px',
        width: '300px',
        height: '400px',
      }"
    />
  </view>
</template>

<script>
import { getWeatherReport } from "@/api/search.js";

export default {
  data() {
    return {
      cityName: "",
      weatherData: null,
      cardWidth: 300,
      cardHeight: 400,
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

    // 修改保存图片方法
    async saveImage() {
      // 检查相册授权
      try {
        const auth = await new Promise((resolve) => {
          uni.authorize({
            scope: "scope.writePhotosAlbum",
            success: () => resolve(true),
            fail: () => resolve(false),
          });
        });

        if (!auth) {
          uni.showModal({
            title: "提示",
            content: "需要您授权保存图片到相册",
            success: (res) => {
              if (res.confirm) {
                uni.openSetting();
              }
            },
          });
          return;
        }

        // 显示加载中
        uni.showLoading({
          title: "保存中...",
          mask: true,
        });

        const cardNode = await new Promise((resolve) => {
          const query = uni.createSelectorQuery().in(this);
          query
            .select("#shareCard")
            .boundingClientRect((data) => {
              resolve(data);
            })
            .exec();
        });

        const canvas = await new Promise((resolve) => {
          const query = uni.createSelectorQuery().in(this);
          query
            .select("#tempCanvas")
            .fields({ node: true, size: true })
            .exec((res) => {
              resolve(res[0].node);
            });
        });

        const ctx = canvas.getContext("2d");
        const scale = 3;
        const imageWidth = cardNode.width;
        const imageHeight = Math.round(imageWidth * 0.75); // 设置为 4:3 的比例
        const totalHeight = imageHeight + 150;

        canvas.width = imageWidth * scale;
        canvas.height = totalHeight * scale;
        ctx.scale(scale, scale);

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 加载图片
        const image = canvas.createImage();
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = reject;
          image.src = this.weatherData.img;
        });

        // 计算等比例缩放尺寸
        let drawWidth = imageWidth;
        let drawHeight = imageHeight;
        let offsetX = 0;
        let offsetY = 0;

        const imageRatio = image.width / image.height;
        const targetRatio = imageWidth / imageHeight;

        if (imageRatio > targetRatio) {
          // 原图更宽，以高度为准
          drawHeight = imageHeight;
          drawWidth = imageHeight * imageRatio;
          offsetX = (imageWidth - drawWidth) / 2;
        } else {
          // 原图更高，以宽度为准
          drawWidth = imageWidth;
          drawHeight = imageWidth / imageRatio;
          offsetY = (imageHeight - drawHeight) / 2;
        }

        // 绘制图片
        ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

        // 文字部分
        ctx.textAlign = "center";
        const centerX = imageWidth / 2;
        const textStartY = imageHeight + 30;

        // 诗句 - 处理长文本
        ctx.fillStyle = "#333333";
        ctx.font = `normal ${(15 * scale) / 3}px sans-serif`; // 稍微减小字号
        const poetry = this.weatherData.poetry;
        if (poetry.length > 20) {
          // 如果诗句太长，分两行显示
          const mid = Math.ceil(poetry.length / 2);
          const firstLine = poetry.substring(0, mid);
          const secondLine = poetry.substring(mid);
          ctx.fillText(firstLine, centerX, textStartY);
          ctx.fillText(secondLine, centerX, textStartY + 25);

          // 调整后续文字的位置
          ctx.font = `bold ${(18 * scale) / 3}px sans-serif`;
          ctx.fillText(this.weatherData.city, centerX, textStartY + 60);

          ctx.fillStyle = "#666666";
          ctx.font = `normal ${(14 * scale) / 3}px sans-serif`;
          ctx.fillText(
            `${this.weatherData.date} ${this.weatherData.condition}`,
            centerX,
            textStartY + 85
          );

          ctx.fillText(
            `最高 ${this.weatherData.temp_high}°C 最低 ${this.weatherData.temp_low}°C`,
            centerX,
            textStartY + 105
          );
        } else {
          // 短诗句保持原来的布局
          ctx.fillText(poetry, centerX, textStartY);

          ctx.font = `bold ${(18 * scale) / 3}px sans-serif`;
          ctx.fillText(this.weatherData.city, centerX, textStartY + 35);

          ctx.fillStyle = "#666666";
          ctx.font = `normal ${(14 * scale) / 3}px sans-serif`;
          ctx.fillText(
            `${this.weatherData.date} ${this.weatherData.condition}`,
            centerX,
            textStartY + 60
          );

          ctx.fillText(
            `最高 ${this.weatherData.temp_high}°C 最低 ${this.weatherData.temp_low}°C`,
            centerX,
            textStartY + 80
          );
        }

        // 导出图片
        const tempFilePath = await new Promise((resolve, reject) => {
          uni.canvasToTempFilePath({
            canvas,
            quality: 1,
            success: (res) => resolve(res.tempFilePath),
            fail: reject,
          });
        });

        // 保存到相册
        await new Promise((resolve, reject) => {
          uni.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: resolve,
            fail: reject,
          });
        });

        uni.showToast({
          title: "已保存到相册",
          icon: "success",
        });
      } catch (error) {
        console.error("保存失败:", error);
        uni.showToast({
          title: "保存失败",
          icon: "none",
        });
        // 确保错误处理时也会隐藏 loading
        uni.hideLoading();
      }
    },

    // 分享给朋友
    shareImage() {
      return {
        title: `${this.weatherData.city}天气画报`,
        path: "/pages/weather/index",
        imageUrl: this.weatherData.img,
      };
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

  .city-input {
    width: 100%;
    height: 88rpx;
    background: #ffffff;
    border: none;
    border-radius: 8rpx;
    padding: 0 30rpx;
    font-size: 28rpx;
    box-sizing: border-box;
  }

  .required {
    position: absolute;
    top: 12rpx;
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

.action-buttons {
  display: flex;
  padding: 32rpx;
  gap: 24rpx;

  .action-btn {
    flex: 1;
    height: 88rpx;
    border-radius: 8rpx;
    font-size: 28rpx;
    color: #ffffff;
    border: none;
    margin: 0;
    padding: 0;
    line-height: 88rpx;

    &.save-btn {
      background: #5b6c8b;
    }

    &.share-btn {
      background: #4caf50;
    }

    &::after {
      border: none;
    }
  }
}

::v-deep .placeholder-style {
  color: #999;
}
</style>
