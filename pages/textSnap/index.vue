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
          <text>背景颜色</text>
        </view>
        <view class="color-picker" @tap="showBackgroundColorPicker">
          <view
            class="color-preview"
            :style="{ backgroundColor: backgroundColor }"
          ></view>
        </view>
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
        v-if="content.trim() && previewImage"
      >
        <text>分享到微信</text>
      </button>
      <button
        class="action-btn save-btn"
        @tap="saveImage"
        v-if="content.trim() && previewImage"
      >
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

    <!-- 颜色选择器弹窗 -->
    <view
      class="color-picker-modal"
      v-if="showColorPicker"
      @tap="closeColorPicker"
    >
      <view class="color-picker-content" @tap.stop>
        <view class="color-picker-header">
          <text>选择颜色</text>
          <text class="close-btn" @tap="closeColorPicker">×</text>
        </view>

        <view class="preset-colors">
          <view
            v-for="color in presetColors"
            :key="color"
            class="color-item"
            :style="{ backgroundColor: color }"
            @tap="selectColor(color)"
          ></view>
        </view>

        <view class="custom-color">
          <text>自定义颜色</text>
          <input
            type="color"
            :value="currentPickerColor"
            @change="onColorInput"
            class="color-input"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import colorPicker from "@/utils/colorPicker";

const content = ref("");
const fontSize = 12;
const showPreview = ref(false);
const previewImage = ref("");
const backgroundColor = ref("#ffffff");

// 计算样式
const inputStyle = computed(() => {
  return {
    fontSize: `${fontSize}px`,
    backgroundColor: "#ffffff",
  };
});

const drawText = async () => {
  const dpr = uni.getSystemInfoSync().pixelRatio;
  const canvasWidth = 300 * dpr;
  const fontSize = 12;
  const lineHeight = fontSize * 2;
  const leftMargin = 20 * dpr;
  const rightMargin = 20 * dpr;
  const topMargin = 20 * dpr;
  const maxWidth = (canvasWidth - leftMargin - rightMargin) / dpr;

  try {
    const query = uni.createSelectorQuery();
    const canvas2 = await new Promise((resolve) => {
      query
        .select("#myCanvas")
        .fields({ node: true, size: true })
        .exec((res) => {
          if (res[0]) {
            const canvas = res[0].node;
            const ctx = canvas.getContext("2d");
            resolve({ canvas, ctx });
          }
        });
    });

    const { canvas, ctx } = canvas2;

    // 计算文本行数和画布高度
    const textLines = [];
    const paragraphs = content.value.split("\n");

    ctx.font = `${fontSize}px sans-serif`;

    // 处理文本换行
    for (let paragraph of paragraphs) {
      let currentLine = "";
      let chars = paragraph.split("");

      for (let char of chars) {
        const testLine = currentLine + char;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
          textLines.push(currentLine);
          currentLine = char;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        textLines.push(currentLine);
      }
      // 段落之间添加空行
      textLines.push("");
    }

    // 计算画布高度
    const textHeight = textLines.length * lineHeight;
    const bottomSpace = 180;
    const canvasHeight =
      Math.max(400, topMargin + textHeight + bottomSpace) * dpr;

    // 设置画布尺寸
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.scale(dpr, dpr);

    // 绘制背景
    ctx.fillStyle = backgroundColor.value;
    ctx.fillRect(0, 0, canvasWidth / dpr, canvasHeight / dpr);

    // 加载 logo 图片
    const logoImage = await new Promise((resolve, reject) => {
      const img = canvas.createImage();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = "/static/tabs/logo.png";
    });

    // 绘制文字
    let lastTextY = 0;
    textLines.forEach((line, index) => {
      const y = topMargin / dpr + index * lineHeight;
      ctx.fillText(line, leftMargin / dpr, y);
      lastTextY = y;
    });

    // 绘制分割线
    const lineY = lastTextY + lineHeight + 20;
    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.moveTo(30, lineY);
    ctx.lineTo(canvasWidth / dpr - 30, lineY);
    ctx.stroke();

    // 绘制日期
    const date = new Date();
    const dateStr = `${date.getFullYear()}年${
      date.getMonth() + 1
    }月${date.getDate()}日`;
    ctx.textAlign = "center";
    ctx.fillStyle = "#333333";
    const dateY = lineY + 20;
    ctx.fillText(dateStr, canvasWidth / (2 * dpr), dateY);

    // 绘制 logo
    const logoSize = 80; // logo 大小
    const logoX = (canvasWidth / dpr - logoSize) / 2;
    const logoY = dateY + 20; // 日期下���20px
    ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);

    // 计算新的画布高度
    const totalHeight = logoY + logoSize + 20;
    canvas.height = totalHeight * dpr;

    // 重新绘制所有内容
    ctx.scale(dpr, dpr);

    // 重新绘制背景
    ctx.fillStyle = backgroundColor.value;
    ctx.fillRect(0, 0, canvasWidth / dpr, totalHeight);

    // 重新绘制文字
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = "#333333";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    textLines.forEach((line, index) => {
      const y = topMargin / dpr + index * lineHeight;
      ctx.fillText(line, leftMargin / dpr, y);
    });

    // 重新绘制分割线
    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.moveTo(30, lineY);
    ctx.lineTo(canvasWidth / dpr - 30, lineY);
    ctx.stroke();

    // 重新绘制日期
    ctx.textAlign = "center";
    ctx.fillText(dateStr, canvasWidth / (2 * dpr), dateY);

    // 重新绘制 logo
    ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);

    return canvas;
  } catch (error) {
    console.error("绘制失败:", error);
    throw error;
  }
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

// 添加颜色选择器相关的状态
const showColorPicker = ref(false);
const currentPickerColor = ref("#ffffff");
const currentPickerType = ref(""); // 'background' 或 'text'

// 预设颜色
const presetColors = [
  "#FFFFFF", // 白色
  "#FFF8DC", // 奶油
  "#FAF3E0", // 淡米色
  "#F5F5F5", // 浅灰色
  "#E0E0E0", // 中灰色
  "#FDF6E3", // 米黄色
  "#FFFDE7", // 浅米色
  "#E0F7FA", // 淡蓝色
  "#B3E5FC", // 浅蓝色
  "#E8F5E9", // 淡绿色
  "#C8E6C9", // 浅绿色
];

// 修改颜色选择器方法
const showBackgroundColorPicker = () => {
  currentPickerColor.value = backgroundColor.value;
  currentPickerType.value = "background";
  showColorPicker.value = true;
};

// 关闭颜色选择器
const closeColorPicker = () => {
  showColorPicker.value = false;
};

// 选择预设颜色
const selectColor = (color) => {
  backgroundColor.value = color;
  closeColorPicker();
};

// 处理自定义颜色输入
const onColorInput = (e) => {
  const color = e.target.value;
  backgroundColor.value = color;
  closeColorPicker();
};
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

.color-picker {
  .color-preview {
    width: 60rpx;
    height: 60rpx;
    border-radius: 8rpx;
    border: 1px solid #eaecef;
  }
}

.color-picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .color-picker-content {
    width: 600rpx;
    background: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
  }

  .color-picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;

    .close-btn {
      font-size: 40rpx;
      color: #999;
      padding: 10rpx;
    }
  }

  .preset-colors {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 20rpx;
    margin-bottom: 30rpx;

    .color-item {
      aspect-ratio: 1;
      border-radius: 8rpx;
      border: 1px solid #eee;
      transition: transform 0.2s;

      &:active {
        transform: scale(0.95);
      }
    }
  }

  .custom-color {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 0;
    border-top: 1px solid #eee;

    .color-input {
      width: 80rpx;
      height: 80rpx;
      padding: 0;
      border: none;
    }
  }
}
</style>
