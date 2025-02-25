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
        <button class="base-btn clear-btn" @tap="clearInput">清空</button>
        <button
          class="base-btn translate-btn"
          @tap="handleTranslate"
          :disabled="isLoading"
        >
          {{ isLoading ? "翻译中..." : "翻译" }}
        </button>
      </view>
    </view>

    <!-- 功能说明区域，当没有翻译结果时显示 -->
    <view class="feature-section" v-if="!translatedText">
      <view class="feature-title">功能说明</view>
      <view class="feature-list">
        <view class="feature-item">
          <view class="item-header">
            <text class="item-number">01</text>
            <text class="item-title">输入功能</text>
          </view>
          <view class="item-desc">支持输入任意语言的文字，一键清空内容</view>
        </view>
        <view class="feature-item">
          <view class="item-header">
            <text class="item-number">02</text>
            <text class="item-title">翻译功能</text>
          </view>
          <view class="item-desc">准确翻译成中文表达，翻译过程有加载提示</view>
        </view>
        <view class="feature-item">
          <view class="item-header">
            <text class="item-number">03</text>
            <text class="item-title">结果展示</text>
          </view>
          <view class="item-desc"
            >显示翻译结果，并提供重点词汇分析，包含词义解释和难度级别</view
          >
        </view>
      </view>
    </view>

    <!-- 翻译结果区域 -->
    <view class="result-section" v-else>
      <view class="result-header">
        <view class="result-title"> 翻译结果 </view>
      </view>
      <view class="result-content">{{ processedTranslation.translation }}</view>

      <view
        class="vocabulary-section"
        v-if="processedTranslation.vocabulary?.length"
      >
        <view class="category-title">重点词汇分析</view>
        <view class="word-list">
          <view
            class="word-item"
            v-for="(item, index) in processedTranslation.vocabulary"
            :key="index"
          >
            <view class="word-header">{{ item.word }}</view>
            <view class="word-explanation">{{ item.explanation }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { translateText } from "../../api/search.js";

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
  // 检查是否已有翻译结果
  if (translatedText.value) {
    uni.showToast({
      title: "请清空输入框再翻译",
      icon: "none",
    });
    return;
  }

  isLoading.value = true;
  try {
    const result = await translateText(inputText.value);
    translatedText.value = result.output;
    console.log(result);
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

// 添加数据处理计算属性
const processedTranslation = computed(() => {
  if (!translatedText.value) return { translation: "", vocabulary: [] };

  const lines = translatedText.value.split("\n").filter((line) => line.trim());

  // 获取翻译文本（第一段）
  const translation = lines[0]?.trim() || "";

  // 获取词汇解释
  const vocabularyStartIndex = lines.findIndex((line) =>
    line.includes("重点词汇分析")
  );

  // 如果没有找到"重点词汇分析"，返回空数组
  if (vocabularyStartIndex === -1) {
    return { translation, vocabulary: [] };
  }

  const vocabularyLines = lines.slice(vocabularyStartIndex + 1);

  const vocabulary = vocabularyLines
    .filter((line) => line.trim().startsWith("-"))
    .map((line) => {
      const content = line.replace("-", "").trim();
      // 分割词语和解释
      const mainParts = content.split("：");
      if (mainParts.length < 2) {
        return { word: content, explanation: "" };
      }
      const word = mainParts[0].trim();
      const explanation = mainParts[1].trim();
      return { word, explanation };
    });

  return { translation, vocabulary };
});
</script>

<style lang="scss">
.translation {
  padding: $uni-spacing-base;
  max-width: 900rpx;
  margin: 0 auto;

  .input-section {
    .input-area {
      width: 100%;
      min-height: 240rpx;
      padding: $uni-spacing-base;
      border: 2rpx solid $uni-color-border;
      border-radius: $uni-radius-sm;
      box-sizing: border-box;
      font-size: $uni-font-size-base;
      transition: all 0.3s ease;

      &:focus {
        border-color: $uni-color-primary;
        box-shadow: 0 0 0 2rpx rgba($uni-color-primary, 0.1);
      }
    }

    .btn-group {
      display: flex;
      justify-content: space-between;
      margin-top: $uni-spacing-base;
      gap: $uni-spacing-base;
    }
  }

  .base-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $uni-spacing-xs;
    padding: 8rpx 24rpx;
    border-radius: $uni-border-radius;
    font-size: $uni-font-size-base;
    font-weight: 500;
    transition: all 0.2s ease;

    &:active {
      transform: scale(0.98);
    }
  }

  .clear-btn {
    flex: 1;
    background-color: $uni-bg-color-grey;
    color: $uni-text-color-grey;
  }

  .translate-btn {
    flex: 1;
    background-color: $uni-color-primary;
    color: $uni-color-white;
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .result-section {
    margin-top: $uni-spacing-xl;
    background-color: $uni-bg-color;
    border-radius: $uni-radius-sm;
    border: 2rpx solid $uni-color-border;
    overflow: hidden;

    .result-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $uni-spacing-base;
      border-bottom: 2rpx solid $uni-color-border;
      background-color: $uni-bg-color-grey;

      .result-title {
        display: flex;
        align-items: center;
        gap: $uni-spacing-xs;
        font-size: $uni-font-size-base;
        color: $uni-text-color;
        font-weight: 500;
      }
    }

    .result-content {
      padding: $uni-spacing-lg;
      font-size: $uni-font-size-lg;
      line-height: 1.8;
      color: $uni-text-color;
      border-bottom: 2rpx solid $uni-color-border;
    }
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $uni-spacing-xs;
    padding: $uni-spacing-base;
    color: $uni-text-color-grey;
  }
}

.vocabulary-section {
  padding: $uni-spacing-base;

  .category-title {
    font-size: $uni-font-size-base;
    font-weight: 500;
    color: $uni-text-color;
    margin-bottom: $uni-spacing-sm;
  }

  .word-list {
    display: flex;
    flex-direction: column;
    gap: $uni-spacing-sm;

    .word-item {
      padding: $uni-spacing-sm;
      background-color: $uni-bg-color-grey;
      border-radius: $uni-border-radius;

      .word-header {
        color: $uni-text-color;
        font-weight: 500;
        font-size: $uni-font-size-base;
        margin-bottom: $uni-spacing-xs;
      }

      .word-explanation {
        color: $uni-text-color-grey;
        font-size: $uni-font-size-sm;
        line-height: 1.6;
      }
    }
  }
}

.feature-section {
  margin-top: $uni-spacing-xl;
  background-color: $uni-bg-color;
  border-radius: $uni-radius-lg;
  padding: $uni-spacing-xl;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

  .feature-title {
    font-size: $uni-font-size-xl;
    font-weight: 600;
    color: $uni-text-color;
    margin-bottom: $uni-spacing-xl;
    position: relative;
    padding-left: $uni-spacing-lg;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 6rpx;
      height: 32rpx;
      background-color: $uni-color-primary;
      border-radius: $uni-border-radius;
    }
  }

  .feature-list {
    display: flex;
    flex-direction: column;
    gap: $uni-spacing-xl;

    .feature-item {
      background-color: $uni-bg-color-grey;
      padding: $uni-spacing-lg;
      border-radius: $uni-radius-base;
      transition: all 0.3s ease;

      &:hover {
        transform: translateX(8rpx);
      }

      .item-header {
        display: flex;
        align-items: center;
        gap: $uni-spacing-base;
        margin-bottom: $uni-spacing-sm;

        .item-number {
          font-size: $uni-font-size-sm;
          font-weight: 600;
          color: $uni-color-primary;
          background-color: rgba($uni-color-primary, 0.1);
          padding: 4rpx 12rpx;
          border-radius: $uni-radius-sm;
        }

        .item-title {
          font-size: $uni-font-size-lg;
          font-weight: 500;
          color: $uni-text-color;
        }
      }

      .item-desc {
        color: $uni-text-color-grey;
        font-size: $uni-font-size-base;
        line-height: 1.6;
        padding-left: calc($uni-spacing-base + 40rpx); // 与序号对齐
      }
    }
  }
}
</style>
