<template>
  <view class="translation">
    <view class="input-section">
      <textarea
        v-model="inputText"
        class="input-area"
        placeholder="请输入要翻译的文字"
        :maxlength="-1"
      />
      <view class="btn-group">
        <button class="clear-btn" @tap="clearInput">清空</button>
        <button class="translate-btn" @tap="handleTranslate">翻译</button>
      </view>
    </view>

    <view class="result-section" v-if="translatedText">
      <view class="result-title">翻译结果：</view>
      <view class="result-content">{{ translatedText }}</view>
      <button class="copy-btn" @tap="copyResult">复制结果</button>
    </view>

    <view class="loading" v-if="isLoading">翻译中...</view>
  </view>
</template>

<script setup>
import { ref } from "vue";

const inputText = ref("");
const translatedText = ref("");
const isLoading = ref(false);

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
    const response = await uni.request({
      url: "https://api.coze.cn/v1/workflow/run",
      method: "POST",
      header: {
        Authorization:
          "Bearer pat_TZ96143O1vNGqfgnwi9uM2TmigogOxdjibiYh5xCCAkOdZW7Bd75iRRO1wJF9T65",
        "Content-Type": "application/json",
      },
      data: {
        workflow_id: "7445294801782259738",
        parameters: {
          BOT_USER_INPUT: inputText.value,
        },
      },
    });

    if (response.data.code === 0) {
      const result = JSON.parse(response.data.data);
      translatedText.value = result.output;
    } else {
      throw new Error("翻译失败");
    }
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
  padding: 20rpx;

  .input-section {
    .input-area {
      width: 100%;
      height: 200rpx;
      padding: 20rpx;
      border: 1px solid #ddd;
      border-radius: 8rpx;
      box-sizing: border-box;
    }

    .btn-group {
      display: flex;
      justify-content: space-between;
      margin-top: 20rpx;
      gap: 20rpx;

      button {
        flex: 1;
        font-size: 28rpx;

        &.clear-btn {
          background-color: #f5f5f5;
          color: #666;
        }

        &.translate-btn {
          background-color: #007aff;
          color: #fff;
        }
      }
    }
  }

  .result-section {
    margin-top: 40rpx;
    padding: 20rpx;
    background-color: #f8f8f8;
    border-radius: 8rpx;

    .result-title {
      font-size: 28rpx;
      color: #666;
      margin-bottom: 10rpx;
    }

    .result-content {
      font-size: 30rpx;
      line-height: 1.5;
      margin-bottom: 20rpx;
    }

    .copy-btn {
      width: 100%;
      font-size: 28rpx;
      background-color: #007aff;
      color: #fff;
    }
  }

  .loading {
    text-align: center;
    padding: 20rpx;
    color: #666;
  }
}
</style>
