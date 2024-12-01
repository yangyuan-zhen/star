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
        @load="handleImageLoad"
        @error="handleImageError"
      />
      <button class="action-btn save-btn" @tap="handleSaveImage">
        保存图片
      </button>
    </view>
  </view>
  <canvas
    canvas-id="saveCanvas"
    style="position: fixed; left: -9999px; width: 300px; height: 300px"
  ></canvas>
</template>

<script setup>
import { ref } from "vue";
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import { getBookRecommend } from "@/api/search.js";

const bookName = ref("");
const imageUrl = ref("");
const loading = ref(false);

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
    // 1. 先检查保存到相册的权限
    const settingRes = await uni.getSetting({});
    if (!settingRes.authSetting["scope.writePhotosAlbum"]) {
      // 如果没有权限，先获取授权
      try {
        await uni.authorize({
          scope: "scope.writePhotosAlbum",
        });
      } catch (authError) {
        // 用户拒绝授权，引导用户去设置页面开启
        uni.showModal({
          title: "提示",
          content: "需要您授权保存图片到相册",
          success: (res) => {
            if (res.confirm) {
              uni.openSetting();
            }
          },
        });
        return;
      }
    }

    // 2. 尝试直接保存网络图片
    try {
      await uni.showLoading({ title: "保存中..." });

      const downloadRes = await uni.downloadFile({
        url: imageUrl.value,
      });

      if (downloadRes.statusCode === 200) {
        await uni.saveImageToPhotosAlbum({
          filePath: downloadRes.tempFilePath,
        });

        uni.showToast({
          title: "保存成功",
          icon: "success",
        });
      } else {
        throw new Error("下载失败");
      }
    } catch (saveError) {
      console.error("保存过程错误:", saveError);

      // 如果直接保存失败，尝试使用canvas方式
      try {
        const ctx = uni.createCanvasContext("saveCanvas");
        ctx.drawImage(imageUrl.value, 0, 0, 300, 300);
        ctx.draw(false, async () => {
          try {
            const canvasRes = await uni.canvasToTempFilePath({
              canvasId: "saveCanvas",
            });

            await uni.saveImageToPhotosAlbum({
              filePath: canvasRes.tempFilePath,
            });

            uni.showToast({
              title: "保存成功",
              icon: "success",
            });
          } catch (err) {
            throw new Error("canvas保存失败");
          }
        });
      } catch (canvasError) {
        uni.showToast({
          title: "保存失败，请截图保存",
          icon: "none",
        });
      }
    }
  } catch (error) {
    console.error("整体错误:", error);
    uni.showToast({
      title: "保存失败",
      icon: "none",
    });
  } finally {
    uni.hideLoading();
  }
};

const handleImageLoad = () => {
  console.log("图片加载成功");
};

const handleImageError = () => {
  console.error("图片加载失败");
  uni.showToast({
    title: "图片加载失败",
    icon: "none",
  });
};

// 添加分享功能
const handleShare = () => {
  // #ifdef MP-WEIXIN
  uni.showShareMenu({
    withShareTicket: true,
    menus: ["shareAppMessage", "shareTimeline"],
  });
  // #endif

  // #ifdef APP-PLUS
  uni.share({
    provider: "native",
    type: 2,
    imageUrl: imageUrl.value,
    success: function () {
      uni.showToast({
        title: "分享成功",
        icon: "success",
      });
    },
    fail: function () {
      uni.showToast({
        title: "分享失败",
        icon: "none",
      });
    },
  });
  // #endif
};

// 微信小程序的分享配置
// #ifdef MP-WEIXIN
onShareAppMessage(() => {
  return {
    title: "为你推荐好书",
    path: "/pages/book/index",
    imageUrl: imageUrl.value,
  };
});

onShareTimeline(() => {
  return {
    title: "为你推荐好书",
    imageUrl: imageUrl.value,
  };
});
// #endif
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

.share-btn {
  background-color: #67c23a;
}

.tip-text {
  font-size: 24rpx;
  color: #999;
  padding: 20rpx;
  line-height: 1.4;
}
</style>
