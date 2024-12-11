<template>
  <view class="book-container">
    <view class="search-box">
      <input
        class="search-input"
        v-model="bookName"
        placeholder="请输入书名"
        @confirm="handleSearch"
      />
      <button class="search-btn" @tap="handleSearch" :disabled="loading">
        {{ loading ? "生成中..." : "生成" }}
      </button>
    </view>
    <text class="tip-text"
      >AI荐书，智能推荐好书，为你提供专业的推荐理由和精彩内容概述，帮你快速找到心仪的书籍！</text
    >

    <view class="result-box" v-if="imageUrl">
      <image
        class="result-image"
        :src="imageUrl"
        mode="widthFix"
        lazy-load
        :style="{ opacity: imageLoaded ? 1 : 0 }"
        @load="handleImageLoad"
        @error="handleImageError"
      />
      <button class="action-btn save-btn" @tap="handleSaveImage">
        保存图片
      </button>
    </view>
  </view>
  <canvas
    type="2d"
    canvas-id="saveCanvas"
    style="position: fixed; left: -9999px; width: 300px; height: 300px"
  ></canvas>
</template>

<script setup>
import { ref } from "vue";
import { getBookRecommend } from "@/api/search.js";
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";

const bookName = ref("");
const imageUrl = ref("");
const loading = ref(false);
const imageLoaded = ref(false);

const handleSearch = async () => {
  if (!bookName.value.trim()) {
    uni.showToast({
      title: "请输入书名",
      icon: "none",
    });
    return;
  }

  loading.value = true;
  try {
    const res = await getBookRecommend(bookName.value);
    console.log("API返回结果:", res);

    // 如果返回的是错误信息
    if (typeof res === "string" && res.includes("Error")) {
      throw new Error("服务请求失败，请稍后重试");
    }

    // 直接尝试解析返回的数据
    let imageData;
    try {
      imageData = typeof res === "string" ? JSON.parse(res) : res;
      if (imageData.data) {
        const parsedData = JSON.parse(imageData.data);
        imageUrl.value = parsedData.output;
      } else if (imageData.output) {
        imageUrl.value = imageData.output;
      } else {
        throw new Error("未找到图片地址");
      }
    } catch (parseError) {
      console.error("数据解析错误:", parseError);
      throw new Error("数据格式错误");
    }
  } catch (error) {
    console.error("处理错误:", error);
    uni.showToast({
      title: error.message || "请求失败，请稍后重试",
      icon: "none",
      duration: 2000,
    });
  } finally {
    loading.value = false;
  }
};

const handleSaveImage = async () => {
  try {
    if (!imageUrl.value) {
      throw new Error("图片地址不能为空");
    }

    await uni.showLoading({ title: "处理中..." });

    // 调用云函数下载图片
    const callFunctionResult = await uniCloud.callFunction({
      name: "downloadImage",
      data: {
        imageUrl: imageUrl.value,
      },
    });

    console.log("云函数调用结果:", callFunctionResult);

    if (!callFunctionResult || !callFunctionResult.result) {
      throw new Error("云函数返回结果为空");
    }

    const result = callFunctionResult.result;
    console.log("云函数返回数据:", result);

    if (result.code !== 0) {
      throw new Error(result.msg || "处理图片失败");
    }

    // 检查权限
    const settingRes = await uni.getSetting({});
    if (!settingRes.authSetting["scope.writePhotosAlbum"]) {
      await uni.authorize({ scope: "scope.writePhotosAlbum" });
    }

    // 下载云存储的图片到本地
    const downloadRes = await uni.downloadFile({
      url: result.data.tempFileURL,
    });

    if (downloadRes.statusCode !== 200) {
      throw new Error("下载图片失败");
    }

    // 保存图片到相册
    await uni.saveImageToPhotosAlbum({
      filePath: downloadRes.tempFilePath,
    });

    uni.showToast({
      title: "保存成功",
      icon: "success",
    });
  } catch (error) {
    console.error("保存失败:", error);
    uni.showToast({
      title: error.message || "保存失败",
      icon: "none",
      duration: 3000,
    });
  } finally {
    uni.hideLoading();
  }
};

const handleImageLoad = () => {
  imageLoaded.value = true;
  console.log("图片加载成功");
};

const handleImageError = async (retryCount = 0) => {
  if (retryCount < 3) {
    console.log(`图片加载失败，第${retryCount + 1}次重试`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    imageUrl.value = `${imageUrl.value}?retry=${retryCount}`;
  } else {
    console.error("图片加载失败");
    uni.showToast({
      title: "图片加载失败",
      icon: "none",
    });
  }
};

onShareAppMessage(() => {
  return {
    title: "AI荐书",
    path: "/pages/book/index",
    imageUrl: imageUrl.value,
  };
});

onShareTimeline(() => {
  return {
    title: "AI荐书",
    query: "path=/pages/book/index",
    imageUrl: imageUrl.value,
  };
});
</script>

<style scoped lang="scss">
.book-container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.search-box {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
}

.search-input {
  flex: 1;
  height: 80rpx;
  padding: 0 20rpx;
  border: 2rpx solid #eee;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.search-btn {
  width: 160rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  color: #fff;
  background-color: #409eff;
  border: none;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.result-box {
  margin-top: 30rpx;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
}

.result-image {
  width: 100%;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.action-btn {
  margin-top: 20rpx;
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  color: #fff;
  background-color: #409eff;
  border: none;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.save-btn {
  background-color: #409eff;
}

.tip-text {
  font-size: 24rpx;
  color: #999;
  padding: 20rpx;
  line-height: 1.4;
}
</style>
