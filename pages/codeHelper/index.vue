<template>
  <view class="container">
    <view class="input-area">
      <textarea
        v-model="userInput"
        auto-height
        placeholder="请输入您的开发需求，例如：我要开发一个商城项目，技术是vue3+ts+element plus"
        class="custom-input"
      />
    </view>

    <button class="submit-btn" @click="handleGetSuggestion" :loading="loading">
      获取cursor规则如果生成不准确请再次点击
    </button>

    <!-- 默认提示内容 -->
    <view class="default-tips" v-if="!suggestion">
      <view class="tip-item">
        <text class="tip-number">1</text>
        <view class="tip-content">
          <text class="tip-title">创建 .cursorrules 文件</text>
          <text class="tip-desc"
            >在项目根目录中创建一个名为 .cursorrules 的文件。</text
          >
        </view>
      </view>
      <view class="tip-item">
        <text class="tip-number">2</text>
        <view class="tip-content">
          <text class="tip-title">定义您的规则</text>
          <text class="tip-desc">使用该当的语法编写您的 Cursor 规则。</text>
        </view>
      </view>
      <view class="tip-item">
        <text class="tip-number">3</text>
        <view class="tip-content">
          <text class="tip-title">开始编码</text>
          <text class="tip-desc"
            >Cursor 将在您编写代码时自动应用您的规则。</text
          >
        </view>
      </view>
    </view>

    <!-- markdown 内容 -->
    <view class="result-area" v-if="suggestion">
      <view class="markdown-container">
        <view class="markdown-header">
          <text>markdown</text>
          <text class="copy-btn" @click="copyText">复制</text>
        </view>
        <view v-html="renderedMarkdown" class="markdown-content"></view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { getCodeSuggestion } from "@/api/search.js";
import { marked } from "marked";

const userInput = ref("");
const suggestion = ref("");
const loading = ref(false);

// 监听输入框变化
watch(userInput, (newVal) => {
  if (!newVal.trim() && suggestion.value) {
    uni.showModal({
      title: "提示",
      content: "是否清除当前的建议内容？",
      success: function (res) {
        if (res.confirm) {
          // 用户点击确定，清除建议内容
          suggestion.value = "";
        } else {
          // 用户点击取消，什么都不做
        }
      },
    });
  }
});

const handleGetSuggestion = async () => {
  if (!userInput.value.trim()) {
    uni.showToast({
      title: "请输入开发需求",
      icon: "none",
    });
    return;
  }

  loading.value = true;
  try {
    const result = await getCodeSuggestion(userInput.value);
    console.log("API返回结果:", result);

    if (result && result.data) {
      const parsedData = JSON.parse(result.data);
      if (parsedData && parsedData.output) {
        suggestion.value = String(parsedData.output);
        console.log("处理后的suggestion:", suggestion.value);
      }
    } else {
      console.error("Unexpected result type:", result);
    }
  } catch (error) {
    uni.showToast({
      title: "获取建议失败",
      icon: "none",
    });
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const renderedMarkdown = computed(() => {
  if (!suggestion.value) return "";
  console.log("渲染前的类型:", typeof suggestion.value);
  try {
    return marked(String(suggestion.value));
  } catch (error) {
    console.error("Markdown渲染错误:", error);
    return String(suggestion.value);
  }
});

const copyText = () => {
  if (!suggestion.value) return;
  uni.setClipboardData({
    data: String(suggestion.value),
    success: () => {
      uni.showToast({
        title: "复制成功",
        icon: "success",
      });
    },
  });
};
</script>

<style scoped>
.container {
  padding: 20rpx;
}

.input-area {
  margin-bottom: 20rpx;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  border-radius: 8rpx;
  padding: 10rpx;
}

.custom-input {
  width: 100%;
  min-height: 100rpx;
  padding: 10rpx 20rpx;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 28rpx;
  box-sizing: border-box;
  line-height: 1.5;
  resize: none;
}

.submit-btn {
  background-color: #007aff;
  color: #fff;
  margin: 20rpx 0;
  padding: 20rpx 0;
  border-radius: 8rpx;
}

.result-area {
  margin-top: 20rpx;
}

.suggestion-text {
  font-size: 28rpx;
  line-height: 1.6;
  white-space: pre-wrap;
}

.markdown-container {
  margin-top: 20rpx;
  border: 1px solid #e0e0e0;
  border-radius: 8rpx;
  background: #fff;
}

.markdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 24rpx;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f8f8;
}

.copy-btn {
  color: #666;
  font-size: 24rpx;
  cursor: pointer;
}

.copy-btn:hover {
  color: #007aff;
}

.markdown-content {
  padding: 24rpx;
  font-size: 28rpx;
  line-height: 1.6;
}

/* Markdown 样式 */
:deep(.markdown-content h1) {
  font-size: 36rpx;
  margin-bottom: 24rpx;
  color: #333;
}

:deep(.markdown-content h2) {
  font-size: 32rpx;
  margin: 24rpx 0;
  color: #333;
}

:deep(.markdown-content p) {
  margin: 16rpx 0;
}

:deep(.markdown-content ul) {
  padding-left: 32rpx;
  margin: 16rpx 0;
}

:deep(.markdown-content li) {
  margin: 8rpx 0;
}

.default-tips {
  margin-top: 30rpx;
  padding: 20rpx;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 30rpx;
}

.tip-number {
  width: 40rpx;
  height: 40rpx;
  background-color: #007aff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.tip-content {
  flex: 1;
}

.tip-title {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.tip-desc {
  display: block;
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
}
</style>
