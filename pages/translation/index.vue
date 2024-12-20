<template>
  <view class="translation">
    <view class="input-section">
      <textarea
        v-model="inputText"
        class="input-area"
        placeholder="请输入要翻译的任意文字任何一种语言的内容，准确地翻译成中文表达。"
        :maxlength="-1"
      />
      <view class="btn-group">
        <button class="base-btn clear-btn" @tap="clearInput">
          <Icon icon="material-symbols:delete-outline" />
          清空
        </button>
        <button class="base-btn translate-btn" @tap="handleTranslate">
          <Icon icon="material-symbols:translate" />
          翻译
        </button>
      </view>
    </view>

    <view class="result-section" v-if="translatedText">
      <view class="result-header">
        <view class="result-title">
          <Icon icon="material-symbols:description-outline" />
          翻译结果
        </view>
      </view>
      <view class="result-content">{{ translatedText }}</view>
      <view class="result-footer">
        <button class="base-btn copy-btn" @tap="copyResult">复制结果</button>
      </view>
    </view>

    <view class="loading" v-if="isLoading">
      <Icon icon="line-md:loading-loop" class="loading-icon" />
      翻译中...
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { translateText } from "../../api/search.js";
import { Icon } from "@iconify/vue";

const inputText = ref("");
const translatedText = ref("");
const isLoading = ref(false);

const shareInfo = {
  title: "AI智能翻译助手",
  path: "/pages/translation/index",
  imageUrl: "", // 可以添加分享图片的路径
  desc: "支持多语言智能翻译",
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

const handleTranslate = async () => {
  if (!inputText.value.trim()) {
    uni.showToast({
      title: "请输入要翻译的内容",
      icon: "none",
    });
    return;
  }

  isLoading.value = true;
  try {
    const result = await translateText(inputText.value);
    translatedText.value = result.output;
  } catch (error) {
    uni.showToast({
      title: error.message || "翻译失败，请稍后重试",
      icon: "none",
    });
  } finally {
    isLoading.value = false;
  }
};

const clearInput = () => {
  inputText.value = "";
  translatedText.value = "";
};

const copyResult = () => {
  if (!translatedText.value) return;
  uni.setClipboardData({
    data: translatedText.value,
    success: () => {
      uni.showToast({
        title: "已复制到剪贴板",
        icon: "success",
      });
    },
  });
};
</script>

<style lang="scss">
.translation {
  padding: 24rpx;
  max-width: 900rpx;
  margin: 0 auto;

  .input-section {
    .input-area {
      width: 100%;
      min-height: 240rpx;
      padding: 24rpx;
      border: 2rpx solid #e5e7eb;
      border-radius: 12rpx;
      box-sizing: border-box;
      font-size: 28rpx;
      transition: all 0.3s ease;

      &:focus {
        border-color: #4f46e5;
        box-shadow: 0 0 0 2rpx rgba(79, 70, 229, 0.1);
      }
    }

    .btn-group {
      display: flex;
      justify-content: space-between;
      margin-top: 24rpx;
      gap: 24rpx;
    }
  }

  .base-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    padding: 20rpx 32rpx;
    border-radius: 8rpx;
    font-size: 28rpx;
    font-weight: 500;
    transition: all 0.2s ease;

    .iconify {
      font-size: 32rpx;
    }

    &:active {
      transform: scale(0.98);
    }
  }

  .clear-btn {
    flex: 1;
    background-color: #f4f4f5;
    color: #71717a;

    &:hover {
      background-color: #e4e4e7;
    }
  }

  .translate-btn,
  .copy-btn {
    flex: 1;
    background-color: #4f46e5;
    color: #fff;

    &:hover {
      background-color: #4338ca;
    }
  }

  .result-section {
    margin-top: 40rpx;
    background-color: #fff;
    border-radius: 16rpx;
    border: 2rpx solid #e5e7eb;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.03);
    overflow: hidden;

    .result-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24rpx 32rpx;
      border-bottom: 2rpx solid #f1f5f9;
      background-color: #f8fafc;

      .result-title {
        display: flex;
        align-items: center;
        gap: 12rpx;
        font-size: 28rpx;
        color: #475569;
        font-weight: 500;
      }

      .icon-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64rpx;
        height: 64rpx;
        border-radius: 8rpx;
        color: #64748b;
        background-color: #fff;
        border: 2rpx solid #e2e8f0;
        transition: all 0.2s ease;

        &:active {
          transform: scale(0.95);
          background-color: #f8fafc;
        }

        .copy-icon {
          font-size: 36rpx;
          width: 36rpx;
          height: 36rpx;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .result-content {
      font-size: 30rpx;
      line-height: 1.8;
      padding: 32rpx;
      color: #1e293b;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    padding: 24rpx;
    color: #64748b;

    .loading-icon {
      font-size: 36rpx;
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
