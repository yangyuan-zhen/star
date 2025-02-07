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
        <text class="label">最高价格</text>
        <input
          class="input"
          v-model="maxPrice"
          placeholder="请输入最高价格"
          type="number"
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
      <button class="submit-btn" @click="getAdvice" :disabled="loading">
        {{ loading ? "分析中..." : "获取建议" }}
      </button>
      <!-- 提示信息 -->
      <view class="tips-container">
        <view class="tip-item">
          <uni-icons type="info" size="14" color="#909399"></uni-icons>
          <text class="tip-text">
            建议最低价和最高价差距不要太大，否则可能会影响分析结果
          </text>
        </view>
        <view class="tip-item">
          <uni-icons type="info" size="14" color="#909399"></uni-icons>
          <text class="tip-text">
            如果一次没有获取到结果就尝试修改价格或者重新获取
          </text>
        </view>
      </view>
    </view>

    <!-- 结果展示视图 -->
    <view v-else class="results-view">
      <!-- 顶部导航栏 -->
      <view class="nav-bar">
        <button class="back-btn" @click="showResults = false">
          <uni-icons type="back" size="10"></uni-icons>
        </button>
        <text class="page-title">商品推荐</text>
      </view>
      <!-- 内容容器 -->
      <view class="content-container">
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
            <!-- 商品名称 -->
            <view class="product-name">{{ item.name }}</view>

            <!-- 价格 -->
            <view class="price">¥{{ item.price }}</view>

            <!-- 购买建议 -->
            <view class="worth-info">
              <text class="channel">{{ item.channel }}</text>
              <text class="separator">-</text>
              <text class="worth">{{ item.worth }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { getShoppingAdvice } from "@/api/search.js"; // 请确保API方法正确引入

// 定义表单输入变量
const query = ref("");
const minPrice = ref("");
const maxPrice = ref("");

// 状态变量
const loading = ref(false);
const result = ref(null);
const showResults = ref(false);
let loadingTimer = null;

// 调用API获取建议，并解析返回数据
const getAdvice = async () => {
  // 价格校验：确保最低价不大于最高价
  if (Number(minPrice.value) > Number(maxPrice.value)) {
    uni.showToast({
      title: "最低价格不能大于最高价格",
      icon: "none",
      duration: 2000,
    });
    return;
  }

  try {
    loading.value = true;
    console.log("发起API请求...", {
      query: query.value,
      minPrice: minPrice.value,
      maxPrice: maxPrice.value,
    });

    // 修正参数顺序，确保与API定义一致
    const res = await getShoppingAdvice(
      query.value,
      maxPrice.value,
      minPrice.value
    );
    console.log("API响应结果：", res);

    // 修改解析逻辑
    if (res) {
      result.value = { output: res }; // 直接将返回结果包装成需要的格式
    } else {
      result.value = {};
    }

    console.log("result.value的值：", result.value);
    console.log("解析后的结果：", parsedResults.value);

    if (parsedResults.value.length > 0) {
      showResults.value = true;
    } else {
      console.log("没有解析到有效结果");
      uni.showToast({
        title: "未获取到商品推荐",
        icon: "none",
        duration: 2000,
      });
    }
  } catch (error) {
    console.error("请求失败：", error);
    uni.showToast({
      title: error.message || "获取建议失败",
      icon: "none",
      duration: 2000,
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

// 解析商品信息的 computed 属性
const parsedResults = computed(() => {
  if (!result.value?.output) return [];
  try {
    const text = result.value.output;
    const products =
      text.match(/- 🛍️ 商品名称:[\s\S]*?(?=(?:- 🛍️ 商品名称:|$))/g) || [];

    const results = products
      .map((product) => {
        try {
          const nameMatch = product.match(/商品名称:\s*([^\n]+)/);
          const priceMatch = product.match(/价格:\s*([\d.]+)/);
          const channelMatch = product.match(/购买渠道:\s*([^\n]+)/);
          const worthMatch = product.match(/是否值得购买：\s*([^。\n]+)/);

          if (!nameMatch?.[1] || !priceMatch?.[1]) return null;

          const name = nameMatch[1]
            .trim()
            .replace(/\\n/g, "")
            .replace(/\[点击.*?\]/g, "")
            .replace(/🛍️/g, "");
          const price = priceMatch[1].trim();
          const channel =
            channelMatch?.[1]
              ?.trim()
              .replace(/\\n/g, "")
              .replace(/\[点击.*?\]/g, "")
              .replace(/🛒/g, "") || "平台未注明";
          const worth =
            worthMatch?.[1]
              ?.trim()
              .replace(/\\n/g, "")
              .replace(/\[点击.*?\]/g, "")
              .replace(/。$/, "")
              .replace(/⭐/g, "")
              .replace(/https?:\/\/[^\s)]+/g, "") || "暂无评估";

          return { name, price, channel, worth };
        } catch (error) {
          console.error("解析错误：", error);
          return null;
        }
      })
      .filter(Boolean);

    return results;
  } catch (error) {
    console.error("解析错误：", error);
    return [];
  }
});

// 计算滚动区域的高度
const scrollHeight = ref(0);
onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  // 44：导航栏高度，32：上下 padding 总和
  scrollHeight.value = systemInfo.windowHeight - 44 - 32;
});

// 定义分享给朋友和分享到朋友圈的方法（如果需要）
const onShareAppMessage = () => {
  return {
    title: "买什么 - AI智能购物建议",
    path: "/pages/shopping/index",
    imageUrl: "", // 如有分享图片可填写
  };
};

const onShareTimeline = () => {
  return {
    title: "买什么 - AI智能购物建议",
    query: "/pages/shopping/index",
    imageUrl: "", // 如有分享图片可填写
  };
};

defineExpose({
  onShareAppMessage,
  onShareTimeline,
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
  display: flex;
  align-items: center;
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
  margin: 0 auto;
  width: 100%;
  max-width: 600px;
}
.result-list {
  width: 100%;
}
.result-card {
  background: #fff;
  padding: 16px;
  margin-bottom: 16px;

  .product-name {
    font-size: 15px;
    color: #333;
    margin-bottom: 8px;
    line-height: 1.4;
  }

  .price {
    font-size: 16px;
    color: #ff4d4f;
    margin-bottom: 8px;
  }

  .worth-info {
    font-size: 14px;
    color: #666;
    line-height: 1.4;

    .channel {
      color: #1890ff;
    }

    .separator {
      margin: 0 4px;
    }

    .worth {
      color: #666;
    }
  }
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
  .uni-icons {
    margin-top: 3px;
  }
}
.tip-text {
  font-size: 13px;
  color: #909399;
  margin-left: 6px;
  flex: 1;
}
</style>
