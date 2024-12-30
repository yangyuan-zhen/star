<template>
  <view class="container">
    <!-- 搜索表单视图 -->
    <view v-if="!showResults" class="form-container">
      <view class="input-group">
        <text class="label">商品名称</text>
        <input
          class="input"
          v-model="query"
          placeholder="请输入商品名称, 如: 手机"
          type="text"
        />
      </view>
      <view class="input-group">
        <text class="label">最低价格</text>
        <input
          class="input"
          v-model="minPrice"
          placeholder="请输入最低价格"
          type="number"
        />
      </view>

      <view class="input-group">
        <text class="label">最高价格</text>
        <input
          class="input"
          v-model="maxPrice"
          placeholder="请输入最高价格"
          type="number"
        />
      </view>

      <button class="submit-btn" @click="getAdvice" :disabled="loading">
        {{ loading ? "分析中..." : "获取建议" }}
      </button>

      <!-- 添加提示信息 -->
      <view class="tips-container">
        <view class="tip-item">
          <uni-icons type="info" size="14" color="#909399"></uni-icons>
          <text class="tip-text"
            >建议最低价和最高价差距不要太大，否则可能会影响分析结果</text
          >
        </view>
        <view class="tip-item">
          <uni-icons type="info" size="14" color="#909399"></uni-icons>
          <text class="tip-text"
            >如果一次没有获取到结果就尝试修改价格或者重新获取</text
          >
        </view>
      </view>
    </view>

    <!-- 结果表格视图 -->
    <view v-else class="results-view">
      <!-- 顶部导航栏 -->
      <view class="nav-bar">
        <button class="back-btn" @click="showResults = false">
          <uni-icons type="back" size="12"></uni-icons>
        </button>
        <text class="page-title">商品推荐</text>
      </view>

      <!-- 内容容器 -->
      <view class="content-container">
        <!-- 商品列表 -->
        <scroll-view
          scroll-y
          class="result-list"
          :style="{ height: scrollHeight + 'px' }"
        >
          <view
            v-for="(item, index) in parsedResults"
            :key="index"
            class="result-card"
          >
            <view class="product-name">{{ item.name }}</view>
            <view class="product-info">
              <view class="price-tag">¥{{ item.price }}</view>
              <view class="channel-tag">{{ item.channel }}</view>
            </view>
            <view class="worth-info">
              <uni-icons
                type="checkmarkempty"
                size="16"
                color="#52c41a"
              ></uni-icons>
              {{ item.worth }}
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onUnmounted, computed, onMounted } from "vue";
import { getShoppingAdvice } from "@/api/search.js";

const query = ref("");
const minPrice = ref("");
const maxPrice = ref("");
const loading = ref(false);
const result = ref(null);
let loadingTimer = null;

// 添加显示结果的状态控制
const showResults = ref(false);

const getAdvice = async () => {
  try {
    loading.value = true;
    const res = await getShoppingAdvice(
      query.value,
      maxPrice.value,
      minPrice.value
    );
    result.value = res;
    // 如果成功获取数据，切换到结果视图
    if (parsedResults.value.length > 0) {
      showResults.value = true;
    }
  } catch (error) {
    // 根据错误类型显示不同的提示
    if (error.code === 401) {
      // API授权错误时不显示错误提示（因为handleApiError已经显示了）
      loading.value = false; // 立即关闭loading状态
      return;
    }
    uni.showToast({
      title: "获取建议失败",
      icon: "error",
    });
  } finally {
    loading.value = false;
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

// 将分享方法定义当前页面
defineExpose({
  onShareAppMessage,
  onShareTimeline,
});

const parsedResults = computed(() => {
  if (!result.value) return [];

  try {
    const outputText = result.value.output || "";
    const products = outputText.split("\n\n").slice(1).filter(Boolean);

    const results = products
      .map((product) => {
        const nameMatch = product.match(/商品名称：([^\n]+)/);
        const priceMatch = product.match(/价格：([^\n]+)/);
        const channelMatch = product.match(/购买渠道：([^\n]+)/);
        const worthMatch = product.match(/是否值得购买：([^\n]+)/);

        if (nameMatch && priceMatch && channelMatch) {
          return {
            name: nameMatch[1].trim().replace(/🛍️\s*/, ""),
            price: priceMatch[1].trim().replace(/💲\s*/, ""),
            channel: channelMatch[1].trim().replace(/🛒\s*/, ""),
            worth: worthMatch
              ? worthMatch[1].trim().replace(/⭐\s*/, "")
              : "暂无评估",
          };
        }
        return null;
      })
      .filter(Boolean);

    return results;
  } catch (error) {
    return [];
  }
});

// 计算滚动区域高度
const scrollHeight = ref(0);

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync();
  // 44是导航栏高度，32是上下padding的总和
  scrollHeight.value = systemInfo.windowHeight - 44 - 32;
});
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  box-sizing: border-box;
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
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:disabled {
    background: #ccc;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
}

.results-view {
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 44px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
}

.back-btn {
  position: absolute;
  left: 16px;
  background: transparent;
  border: none;
  padding: 8px;
  margin: 0;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;

  &:active {
    opacity: 0.7;
  }
}

.page-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.content-container {
  flex: 1;
  padding: 16px;
  box-sizing: border-box;
  margin: 0 auto;
  width: 100%;
  max-width: 600px; // 在大屏设备上限制最大宽度
}

.result-list {
  width: 100%;
}

.result-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.05);

  &:active {
    transform: scale(0.99);
    transition: transform 0.2s ease;
  }
}

.product-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  margin-bottom: 12px;
}

.product-info {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;
}

.price-tag {
  background: #fff5f5;
  color: #ff4d4f;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
}

.channel-tag {
  background: #f0f5ff;
  color: #4096ff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 13px;
}

.worth-info {
  display: flex;
  align-items: center;
  color: #52c41a;
  font-size: 14px;
  line-height: 1.4;
  background: #f6ffed;
  padding: 8px 12px;
  border-radius: 6px;
}

.worth-icon {
  font-size: 16px;
  margin-right: 6px;
  color: #52c41a;
}

.input-icon,
.btn-icon,
.icon-spin {
  display: none;
}

.tips-container {
  margin-top: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  padding: 4px 0;

  &:last-child {
    margin-bottom: 0;
  }

  .uni-icons {
    margin-top: 3px;
  }
}

.tip-text {
  font-size: 13px;
  color: #909399;
  line-height: 1.4;
  margin-left: 6px;
  flex: 1;
}

// 响应式调整
@media screen and (min-width: 375px) {
  .content-container {
    padding: 16px;
  }

  .result-card {
    padding: 16px;
  }
}

@media screen and (max-width: 374px) {
  .content-container {
    padding: 12px;
  }

  .result-card {
    padding: 12px;
  }

  .product-name {
    font-size: 14px;
  }

  .price-tag {
    font-size: 15px;
  }

  .channel-tag {
    font-size: 12px;
  }
}
</style>
