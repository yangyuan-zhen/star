<template>
  <view class="container">
    <!-- 预览区域 -->
    <view class="preview-section">
      <textarea
        v-model="content"
        class="code-input"
        placeholder="请输入您的文字..."
        :style="inputStyle"
        auto-height
        :maxlength="-1"
        :show-confirm-bar="false"
      />
    </view>

    <!-- 样式设置区域 -->
    <view class="settings-section">
      <!-- 主题选择 -->
      <view class="setting-item">
        <text class="setting-label">主题样式：</text>
        <picker
          :value="themeIndex"
          :range="themes"
          @change="onThemeChange"
          class="theme-picker"
        >
          <view class="picker-text">{{ themes[themeIndex] }}</view>
        </picker>
      </view>

      <!-- 字体大小 -->
      <view class="setting-item">
        <text class="setting-label">字体大小：{{ fontSize }}px</text>
        <slider
          :value="fontSize"
          :min="12"
          :max="24"
          :step="1"
          @change="onFontSizeChange"
          class="slider"
        />
      </view>

      <!-- 背景透明度 -->
      <view class="setting-item">
        <text class="setting-label"
          >背景透明度：{{ Math.round(opacity * 100) }}%</text
        >
        <slider
          :value="opacity * 100"
          :min="0"
          :max="100"
          :step="1"
          @change="onOpacityChange"
          class="slider"
        />
      </view>
    </view>

    <!-- 按钮区域 -->
    <view class="button-section">
      <button class="preview-btn" @tap="generatePreview">预览图片</button>
      <button class="share-btn" @tap="shareToWechat" v-if="previewImage">
        分享到微信
      </button>
      <button class="save-btn" @tap="saveImage" v-if="previewImage">
        保存到相册
      </button>
    </view>

    <!-- 预览弹窗 -->
    <view class="preview-modal" v-if="showPreview" @tap="closePreview">
      <image
        :src="previewImage"
        mode="widthFix"
        class="preview-image"
        @tap.stop
      />
      <view class="preview-close" @tap="closePreview">×</view>
    </view>

    <!-- 隐藏的 canvas -->
    <canvas
      type="2d"
      id="myCanvas"
      class="share-canvas"
      style="
        width: 300px;
        height: 400px;
        position: fixed;
        left: -2000px;
        top: 0;
      "
    ></canvas>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";

const content = ref("");
const themeIndex = ref(0);
const themes = ["简约浅色", "暗黑模式"];
const themeStyles = {
  0: {
    // 简约浅色
    background: "#ffffff",
    textColor: "#333333",
  },
  1: {
    // 暗黑模式
    background: "#282c34",
    textColor: "#ffffff",
  },
};
const fontSize = ref(14);
const opacity = ref(1);
const showPreview = ref(false);
const previewImage = ref("");

// 计算样式
const inputStyle = computed(() => {
  const style = {
    fontSize: `${fontSize.value}px`,
    backgroundColor:
      themeIndex.value === 1
        ? `rgba(40, 44, 52, ${opacity.value})`
        : `rgba(255, 255, 255, ${opacity.value})`,
    color: themeIndex.value === 1 ? "#ffffff" : "#333333",
  };
  return style;
});

const onThemeChange = (e) => {
  themeIndex.value = e.detail.value;
};

const onFontSizeChange = (e) => {
  fontSize.value = e.detail.value;
};

const onOpacityChange = (e) => {
  opacity.value = e.detail.value / 100;
};

const drawText = async () => {
  // 修改获取 canvas 节点的方式
  const query = uni.createSelectorQuery();
  const canvas = await new Promise((resolve) => {
    query
      .select("#myCanvas")
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res[0]) {
          resolve(res[0].node);
        } else {
          uni.showToast({
            title: "获取画布失败",
            icon: "none",
          });
        }
      });
  });

  if (!canvas) return null;

  const ctx = canvas.getContext("2d");
  const dpr = uni.getSystemInfoSync().pixelRatio;
  const canvasWidth = 300 * dpr;
  const canvasHeight = 400 * dpr;

  // 设置画布大小
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // 缩放以适应 DPR
  ctx.scale(dpr, dpr);

  // 清空画布
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 绘制背景
  ctx.fillStyle = themeStyles[themeIndex.value].background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 设置文字样式
  ctx.font = `${fontSize.value}px sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = themeStyles[themeIndex.value].textColor;

  // 文字处理和绘制
  const text = content.value;
  const maxWidth = 260; // 留出左右边距
  const lineHeight = fontSize.value + 10;
  const topMargin = 40; // 添加顶部边距

  // 分行处理
  const lines = [];
  let currentLine = "";

  // 处理手动换行
  const paragraphs = text.split("\n");
  for (let paragraph of paragraphs) {
    if (paragraph === "") {
      lines.push(""); // 保留空行
      continue;
    }

    // 处理每一段的自动换行
    for (let char of paragraph) {
      const testLine = currentLine + char;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = "";
    }
  }

  // 绘制文字
  lines.forEach((line, index) => {
    const y = topMargin + index * lineHeight;
    ctx.fillText(line, 150, y); // 水平居中 (300/2)
  });

  // 添加 Free 水印
  ctx.save();
  ctx.font = "14px sans-serif";
  ctx.fillStyle =
    themeIndex.value === 1 ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText("Free信息", canvas.width / dpr - 20, canvas.height / dpr - 20);
  ctx.restore();

  return canvas;
};

// 修改 generatePreview 函数
const generatePreview = async () => {
  if (!content.value.trim()) {
    uni.showToast({
      title: "请输入内容",
      icon: "none",
    });
    return;
  }

  try {
    uni.showLoading({ title: "生成中..." });
    const canvas = await drawText();

    if (!canvas) {
      throw new Error("Canvas creation failed");
    }

    const res = await new Promise((resolve, reject) => {
      uni.canvasToTempFilePath({
        canvas,
        success: resolve,
        fail: reject,
      });
    });

    previewImage.value = res.tempFilePath;
    showPreview.value = true;
    uni.hideLoading();
  } catch (error) {
    console.error("生成预览失败:", error);
    uni.hideLoading();
    uni.showToast({
      title: "生成预览失败",
      icon: "none",
    });
  }
};

// 保存图片到相册
const saveImage = async () => {
  if (!previewImage.value) return;

  try {
    uni.showLoading({ title: "保存中..." });
    await new Promise((resolve, reject) => {
      uni.saveImageToPhotosAlbum({
        filePath: previewImage.value,
        success: resolve,
        fail: reject,
      });
    });

    uni.hideLoading();
    uni.showToast({
      title: "保存成功",
      icon: "success",
    });
    closePreview();
  } catch (error) {
    console.error("保存失败:", error);
    uni.hideLoading();
    uni.showToast({
      title: "保存失败",
      icon: "none",
    });
  }
};

// 关闭预览
const closePreview = () => {
  showPreview.value = false;
};

// 修改 shareToWechat 方法
const shareToWechat = () => {
  if (!previewImage.value) return;

  uni.showModal({
    title: "分享提示",
    content: '点击右上角"..."按钮进行分享',
    showCancel: false,
    success: () => {
      // 设置全局分享数据
      uni.$emit("setShareImage", previewImage.value);
    },
  });
};

// 添加页面分享处理
onShareAppMessage(() => {
  return {
    title: "文字图片",
    imageUrl: previewImage.value,
    path: "/pages/textSnap/index",
  };
});

// 添加分享到朋友圈
onShareTimeline(() => {
  return {
    title: "文字图片",
    imageUrl: previewImage.value,
    path: "/pages/textSnap/index",
  };
});
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.preview-section {
  margin-bottom: 30rpx;
  background: #fff;
  border-radius: 8rpx;
  padding: 20rpx;

  .code-input {
    width: 100%;
    min-height: 200rpx;
    padding: 20rpx;
    border-radius: 8rpx;
    border: 1px solid #ddd;
    box-sizing: border-box;
    transition: all 0.3s ease;
    background-color: #fff;
    white-space: pre-wrap;
    word-break: break-all;
  }
}

.settings-section {
  background-color: #fff;
  padding: 20rpx;
  border-radius: 8rpx;
  margin-bottom: 30rpx;

  .setting-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .setting-label {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }

    .theme-picker {
      flex: 1;
    }

    .picker-text {
      font-size: 28rpx;
      color: #666;
    }

    .slider {
      flex: 1;
      margin: 0 20rpx;
    }
  }
}

.button-section {
  padding: 20rpx 0;
  display: flex;
  gap: 20rpx;

  .preview-btn,
  .share-btn,
  .save-btn {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    color: #fff;
    border-radius: 40rpx;
    font-size: 32rpx;
    border: none;
  }

  .preview-btn {
    background: linear-gradient(to right, #4a90e2, #63bfff);
  }

  .share-btn {
    background: linear-gradient(to right, #4caf50, #8bc34a);
  }

  .save-btn {
    background: linear-gradient(to right, #67c23a, #95d475);
  }
}

.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;

  .preview-image {
    width: 80%;
    max-height: 80vh;
    border-radius: 8rpx;
  }

  .preview-close {
    position: absolute;
    top: 40rpx;
    right: 40rpx;
    width: 60rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    font-size: 40rpx;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 30rpx;
  }
}
</style>
