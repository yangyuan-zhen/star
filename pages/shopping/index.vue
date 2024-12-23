<template>
  <view class="container">
    <view class="header">
      <text class="title">
        <Icon icon="mdi:shopping" class="title-icon" />
        值得买吗
      </text>
      <text class="subtitle">
        <Icon icon="mdi:robot" class="subtitle-icon" />
        AI智能购物建议
      </text>
    </view>

    <view class="form-container">
      <view class="input-group">
        <text class="label">
          <Icon icon="mdi:shopping-outline" class="input-icon" />
          商品名称
        </text>
        <input
          class="input"
          v-model="query"
          placeholder="请输入商品名称, 如: 苹果手机"
          type="text"
        />
      </view>
      <text class="tip">
        <Icon icon="mdi:information" class="tip-icon" />
        建议最低价和最高价差距不要太大，否则可能会影响分析结果
      </text>
      <view class="input-group">
        <text class="label">
          <Icon icon="mdi:currency-cny" class="input-icon" />
          最低价格
        </text>
        <input
          class="input"
          v-model="minPrice"
          placeholder="请输入最低价格"
          type="number"
        />
      </view>

      <view class="input-group">
        <text class="label">
          <Icon icon="mdi:currency-cny" class="input-icon" />
          最高价格
        </text>
        <input
          class="input"
          v-model="maxPrice"
          placeholder="请输入最高价格"
          type="number"
        />
      </view>

      <button class="submit-btn" @click="getAdvice" :disabled="loading">
        <Icon
          :icon="loading ? 'mdi:loading' : 'mdi:magnify'"
          class="btn-icon"
          :class="{ 'icon-spin': loading }"
        />
        {{ loading ? "分析中..." : "获取建议" }}
      </button>
    </view>

    <view v-if="result?.value" class="debug-info">
      <text>API 返回数据结构：</text>
      <text>{{ JSON.stringify(result.value, null, 2) }}</text>
    </view>

    <view v-if="result?.output" class="result-container">
      <view class="result-content">
        <text class="result-text">{{ formatResult(result.output) }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import { getShoppingAdvice } from "@/api/search.js";
import { Icon } from "@iconify/vue";

const query = ref("");
const minPrice = ref("");
const maxPrice = ref("");
const loading = ref(false);
const result = ref(null);
const lastQuery = ref("");
const lastMinPrice = ref("");
const lastMaxPrice = ref("");
let loadingTimer = null;

const getAdvice = async () => {
  if (
    result.value?.output &&
    query.value === lastQuery.value &&
    minPrice.value === lastMinPrice.value &&
    maxPrice.value === lastMaxPrice.value
  ) {
    uni.showToast({
      title: "输入的商品和价格未改变，请修改后再试",
      icon: "none",
    });
    return;
  }

  if (!query.value.trim()) {
    uni.showToast({
      title: "请输入商品名称",
      icon: "none",
    });
    return;
  }

  if (!minPrice.value) {
    uni.showToast({
      title: "请输入最低价格",
      icon: "none",
    });
    return;
  }

  if (!maxPrice.value) {
    uni.showToast({
      title: "请输入最高价格",
      icon: "none",
    });
    return;
  }

  if (Number(minPrice.value) > Number(maxPrice.value)) {
    uni.showToast({
      title: "最低价格不能高于最高价格",
      icon: "none",
    });
    return;
  }

  loading.value = true;

  loadingTimer = setTimeout(() => {
    if (loading.value) {
      uni.showToast({
        title: "正在努力分析中，请耐心等待...",
        icon: "none",
        duration: 2000,
      });
    }
  }, 5000);

  try {
    const res = await getShoppingAdvice(
      query.value,
      maxPrice.value,
      minPrice.value
    );
    console.log("API 响应:", res);
    result.value = res;
    lastQuery.value = query.value;
    lastMinPrice.value = minPrice.value;
    lastMaxPrice.value = maxPrice.value;
  } catch (error) {
    console.error("发生错误:", error);
    uni.showToast({
      title: "获取建议失败",
      icon: "error",
    });
  } finally {
    loading.value = false;
    if (loadingTimer) {
      clearTimeout(loadingTimer);
      loadingTimer = null;
    }
  }
};

const formatResult = (text) => {
  if (!text) return "";
  return text.replace(/^- /gm, "").replace(/\n- /g, "\n"); // 去掉行首的-
};
// 复制结果
const copyOutput = () => {
  if (result.value?.output) {
    uni.setClipboardData({
      data: result.value.output,
      success: () => {
        uni.showToast({
          title: "复制成功",
          icon: "success",
          duration: 1500,
        });
      },
    });
  }
};

onUnmounted(() => {
  if (loadingTimer) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }
});

// 定义分享给朋友
const onShareAppMessage = () => {
  return {
    title: "值得买吗 - AI智能购物建议",
    path: "/pages/shopping/index",
    imageUrl: "", // 如果有分享图片的话
  };
};

// 定义分享到朋友圈
const onShareTimeline = () => {
  return {
    title: "值得买吗 - AI智能购物建议",
    query: "/pages/shopping/index", // 分享链接
    imageUrl: "", // 如果有分享图片的话
  };
};

// 将分享方法定义到当前页面
defineExpose({
  onShareAppMessage,
  onShareTimeline,
});
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 20px;

  .title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }

  .subtitle {
    font-size: 13px;
    color: #666;
    margin-top: 5px;
  }
}

.form-container {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
  width: auto;
  box-sizing: border-box;
}

.input-group {
  margin-bottom: 12px;

  .label {
    display: block;
    font-size: 13px;
    color: #333;
    margin-bottom: 4px;
  }

  .input {
    width: 100%;
    height: 36px;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 0 12px;
    font-size: 14px;
    box-sizing: border-box;

    &:focus {
      border-color: #00bcd4;
    }
  }
}

.submit-btn {
  width: 100%;
  height: 40px;
  background: #00bcd4;
  color: #fff;
  border-radius: 6px;
  font-size: 15px;
  border: none;
  box-sizing: border-box;

  &:disabled {
    background: #ccc;
  }
}

.result-container {
  margin-top: 16px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

  .result-content {
    .result-text {
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
}

.title-icon {
  font-size: 28px;
  margin-right: 8px;
  vertical-align: middle;
}

.subtitle-icon {
  font-size: 16px;
  margin-right: 4px;
  vertical-align: middle;
}

.input-icon {
  font-size: 18px;
  margin-right: 6px;
  vertical-align: middle;
  color: #666;
}

.btn-icon {
  font-size: 20px;
  margin-right: 8px;
  vertical-align: middle;
}

.icon-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.header {
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .subtitle {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
}

.product-name {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;

  .copy-btn {
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #f5f5f5;
    cursor: pointer;
    transition: all 0.2s ease;

    &:active {
      background-color: #e0e0e0;
    }
  }

  .copy-icon {
    font-size: 18px;
    color: #666;
  }
}

.tip {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #909399;
  margin: 8px 0 12px;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
  line-height: 1.4;
}
</style>
