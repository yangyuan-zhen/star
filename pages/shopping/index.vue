<template>
  <view class="container">
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

    <view
      v-if="parsedResults && parsedResults.length > 0"
      class="result-container"
    >
      <view class="result-table">
        <view class="table-header">
          <view class="th">手机型号</view>
          <view class="th">价格</view>
          <view class="th">渠道</view>
        </view>
        <scroll-view scroll-y class="table-body">
          <view
            v-for="(item, index) in parsedResults"
            :key="index"
            class="table-row"
          >
            <view class="td model">{{ item.name }}</view>
            <view class="td price">¥{{ item.price }}</view>
            <view class="td channel">{{ item.channel }}</view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onUnmounted, computed } from "vue";
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
    result.value = {
      data: res,
    };

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
    title: "买什么 - AI智能购物建议",
    path: "/pages/shopping/index",
    imageUrl: "", // 如果有分享图片的话
  };
};

// 定义分享到朋友圈
const onShareTimeline = () => {
  return {
    title: "买什么 - AI智能购物建议",
    query: "/pages/shopping/index", // 分享链接
    imageUrl: "", // 如果有分享图片的话
  };
};

// 将分享方法定义到当前页面
defineExpose({
  onShareAppMessage,
  onShareTimeline,
});

const parsedResults = computed(() => {
  if (!result.value?.data) return [];

  try {
    // 获取返回的数据
    const data = result.value.data;

    // 如果数据是字符串，尝试解析为 JSON
    const jsonData = typeof data === "string" ? JSON.parse(data) : data;

    // 获取 output 字段的内容
    const outputText = jsonData.output;

    // 分割文本为数组，去掉开头的介绍文字
    const lines = outputText
      .split("\n")
      .filter(
        (line) =>
          line.includes("手机名称：") ||
          line.includes("价格：") ||
          line.includes("购买渠道：")
      );

    const results = [];

    // 每三行处理一组数据
    for (let i = 0; i < lines.length; i += 3) {
      if (i + 2 < lines.length) {
        const nameMatch = lines[i].match(/手机名称：(.+)/);
        const priceMatch = lines[i + 1].match(/价格：(\d+\.?\d*)/);
        const channelMatch = lines[i + 2].match(/购买渠道：(.+)/);

        if (nameMatch && priceMatch && channelMatch) {
          results.push({
            name: nameMatch[1].trim(),
            price: priceMatch[1].trim(),
            channel: channelMatch[1].trim(),
          });
        }
      }
    }

    return results;
  } catch (error) {
    console.error("数据解析错误:", error);
    return [];
  }
});
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
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
  flex: 1;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.result-table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .table-header {
    display: flex;
    background: #f5f5f5;
    padding: 12px 0;
    flex-shrink: 0;

    .th {
      flex: 1;
      text-align: center;
      font-size: 14px;
      font-weight: bold;
      color: #333;

      &:first-child {
        flex: 2;
        padding-left: 12px;
        text-align: left;
      }
    }
  }

  .table-body {
    flex: 1;
    height: 0;
    overflow-y: auto;
  }

  .table-row {
    display: flex;
    border-bottom: 1px solid #eee;
    padding: 12px 0;

    &:last-child {
      border-bottom: none;
    }

    .td {
      flex: 1;
      text-align: center;
      font-size: 14px;
      color: #333;

      &.model {
        flex: 2;
        padding-left: 12px;
        text-align: left;
      }

      &.price {
        color: #f56c6c;
        font-weight: 500;
      }

      &.channel {
        color: #409eff;
      }
    }
  }
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

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:active:not(:disabled) {
    transform: scale(0.98);
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
