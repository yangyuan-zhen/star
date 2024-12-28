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
      <view class="setting-item">
        <view class="setting-label">
          <text>主题样式</text>
        </view>
        <picker :value="themeIndex" :range="themes" @change="onThemeChange">
          <view class="picker-wrapper">
            <text>{{ themes[themeIndex] }}</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 按钮区域 -->
    <view class="button-section">
      <button class="action-btn preview-btn" @tap="generatePreview">
        <text>预览图片</text>
      </button>
      <button
        class="action-btn share-btn"
        @tap="shareToWechat"
        v-if="previewImage"
      >
        <text>分享到微信</text>
      </button>
      <button class="action-btn save-btn" @tap="saveImage" v-if="previewImage">
        <text>保存到相册</text>
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
import { ref, computed, onMounted } from "vue";
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
const fontSize = 12;
const showPreview = ref(false);
const previewImage = ref("");

// 计算样式
const inputStyle = computed(() => {
  return {
    fontSize: `${fontSize}px`,
    backgroundColor: themeStyles[themeIndex.value].background,
    color: themeStyles[themeIndex.value].textColor,
  };
});

const onThemeChange = (e) => {
  themeIndex.value = e.detail.value;
};

const drawText = async () => {
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

  // 计算所需画布高度
  ctx.font = `${fontSize}px sans-serif`;
  const text = content.value;
  const maxWidth = 260;
  const lineHeight = fontSize + 8;
  const topMargin = 20;
  const bottomMargin = 30;
  const leftMargin = 20;
  const rightMargin = 20;

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

  // 计算所需的总高度
  const totalTextHeight = lines.length * lineHeight;
  const canvasHeight = Math.max(
    400 * dpr,
    (totalTextHeight + topMargin + bottomMargin) * dpr
  );

  // 设置画布大小
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // 缩放以适应 DPR
  ctx.scale(dpr, dpr);

  // 清空画布
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 绘制背景
  ctx.fillStyle = themeStyles[themeIndex.value].background;
  ctx.fillRect(0, 0, canvasWidth / dpr, canvasHeight / dpr);

  // 设置文字样式
  ctx.font = `${fontSize}px sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillStyle = themeStyles[themeIndex.value].textColor;

  // 绘制文字
  lines.forEach((line, index) => {
    const y = topMargin + index * lineHeight;
    ctx.fillText(line, leftMargin, y);
  });

  // 添加水印
  ctx.save();
  ctx.font = "12px sans-serif";
  ctx.fillStyle =
    themeIndex.value === 1 ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText(
    "Free信息",
    canvasWidth / dpr - rightMargin,
    canvasHeight / dpr - 15
  );
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

// 添加分享参数处理
const handleShare = () => {
  // 获取当前页面路由
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];

  if (currentPage && currentPage.options && currentPage.options.text) {
    // 如果有分享参数，解码并设置到输入框
    content.value = decodeURIComponent(currentPage.options.text);
  }
};

// 页面加载时检查分享参数
onMounted(() => {
  handleShare();
});

// 修改分享配置
onShareAppMessage(() => {
  return {
    title: "文字分享",
    imageUrl: previewImage.value,
    // 将当前文本内容作为参数传递
    path: `/pages/textSnap/index?text=${encodeURIComponent(content.value)}`,
  };
});

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: "文字分享",
    imageUrl: previewImage.value,
    // 将当前文本内容作为参数传递
    query: `text=${encodeURIComponent(content.value)}`,
  };
});
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.preview-section {
  margin-bottom: 30rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

  .code-input {
    width: 100%;
    min-height: 240rpx;
    padding: 28rpx;
    border-radius: 16rpx;
    border: 1px solid #eaecef;
    box-sizing: border-box;
    font-size: 28rpx;
    line-height: 1.6;
    transition: all 0.3s ease;

    &:focus {
      border-color: #4a90e2;
      box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.08);
    }
  }
}

.settings-section {
  background-color: #fff;
  padding: 24rpx;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

  .setting-item {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .setting-label {
      display: flex;
      align-items: center;
      gap: 8rpx;
      flex: 1;
      font-size: 28rpx;
      color: #374151;
    }

    .picker-wrapper {
      display: flex;
      align-items: center;
      gap: 8rpx;
      color: #6b7280;
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
  gap: 24rpx;

  .action-btn {
    flex: 1;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    color: #fff;
    border-radius: 44rpx;
    font-size: 28rpx;
    border: none;
    transition: all 0.3s ease;

    :deep(svg) {
      font-size: 32rpx;
    }
  }

  .preview-btn {
    background: linear-gradient(135deg, #4a90e2, #63bfff);
    &:active {
      transform: scale(0.98);
    }
  }

  .share-btn {
    background: linear-gradient(135deg, #4caf50, #8bc34a);
    &:active {
      transform: scale(0.98);
    }
  }

  .save-btn {
    background: linear-gradient(135deg, #67c23a, #95d475);
    &:active {
      transform: scale(0.98);
    }
  }
}

.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;

  .preview-image {
    width: 85%;
    max-height: 85vh;
    border-radius: 12rpx;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  .preview-close {
    position: absolute;
    top: 40rpx;
    right: 40rpx;
    width: 64rpx;
    height: 64rpx;
    line-height: 64rpx;
    text-align: center;
    font-size: 44rpx;
    color: #fff;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 32rpx;
    backdrop-filter: blur(4px);
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.95);
      background: rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
