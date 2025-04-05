<template>
  <view class="container">
    <!-- 导航栏 -->
    <zodiac-nav-bar @settings="showSettings" />

    <!-- 主内容区 -->
    <scroll-view scroll-y class="content-area">
      <!-- 当前星座运势卡片 -->
      <zodiac-card
        ref="zodiacCardRef"
        :zodiac-name="currentZodiac"
        :date-range="getZodiacDateRange(currentZodiac)"
        :fortune="fortuneData"
        :loading="loading"
        :gradient="getZodiacGradient(currentZodiac)"
        :icon-path="getZodiacIconPath(currentZodiac)"
      />

      <!-- 详细运势 -->
      <fortune-details :fortune="fortuneData" />

      <!-- 今日提示 -->
      <daily-tips :fortune="fortuneData" />
    </scroll-view>

    <!-- 使用星座设置组件 -->
    <zodiac-settings
      v-model:show="settingsVisible"
      :current-zodiac="currentZodiac"
      :birth-date="birthDate"
      :is-first-time="isFirstTimeUser"
      @save="saveUserSettings"
    />

    <!-- 修改canvas元素，确保能正确渲染 -->
    <canvas
      type="2d"
      id="shareCanvas"
      canvas-id="shareCanvas"
      style="width: 300px; height: 400px; position: fixed; top: -9999px"
    ></canvas>
  </view>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { onShow, onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import ZodiacSettings from "../../components/zodiac-settings/zodiac-settings.vue";
import ZodiacNavBar from "../../components/zodiac-nav-bar/zodiac-nav-bar.vue";
import ZodiacCard from "../../components/zodiac-card/zodiac-card.vue";
import FortuneDetails from "../../components/fortune-details/fortune-details.vue";
import DailyTips from "../../components/daily-tips/daily-tips.vue";

// 星座相关数据
const zodiacSigns = [
  "白羊座",
  "金牛座",
  "双子座",
  "巨蟹座",
  "狮子座",
  "处女座",
  "天秤座",
  "天蝎座",
  "射手座",
  "摩羯座",
  "水瓶座",
  "双鱼座",
];

// 星座元素映射
const zodiacElements = {
  白羊座: "fire",
  狮子座: "fire",
  射手座: "fire",
  金牛座: "earth",
  处女座: "earth",
  摩羯座: "earth",
  双子座: "air",
  天秤座: "air",
  水瓶座: "air",
  巨蟹座: "water",
  天蝎座: "water",
  双鱼座: "water",
};

// 星座日期范围映射
const zodiacDateRanges = {
  白羊座: "3月21日-4月19日",
  金牛座: "4月20日-5月20日",
  双子座: "5月21日-6月21日",
  巨蟹座: "6月22日-7月22日",
  狮子座: "7月23日-8月22日",
  处女座: "8月23日-9月22日",
  天秤座: "9月23日-10月23日",
  天蝎座: "10月24日-11月22日",
  射手座: "11月23日-12月21日",
  摩羯座: "12月22日-1月19日",
  水瓶座: "1月20日-2月18日",
  双鱼座: "2月19日-3月20日",
};

// 状态变量
const currentZodiac = ref("天蝎座");
const birthDate = ref("2000-01-01");
const settingsVisible = ref(false);
const loading = ref(false);
const fortuneData = ref(null); // 星座运势数据
const isFirstTimeUser = ref(false);
const shareImageUrl = ref("");
const zodiacCardRef = ref(null);

// 获取星座图标路径
const getZodiacIconPath = (zodiac) => {
  return `/static/stars/${zodiac}.svg`;
};

// 获取星座日期范围
const getZodiacDateRange = (zodiac) => {
  return zodiacDateRanges[zodiac] || "";
};

// 添加星级评分生成函数
const getStarRating = (rating = 0, maxRating = 5) => {
  const validRating = Math.min(Math.max(Math.round(rating || 0), 0), maxRating);
  const fullStars = "★".repeat(validRating);
  const emptyStars = "☆".repeat(maxRating - validRating);
  return fullStars + emptyStars;
};

// 根据星座元素获取渐变色
const getZodiacGradient = (zodiac) => {
  const element = zodiacElements[zodiac];
  switch (element) {
    case "fire":
      return "linear-gradient(135deg, #ff7700 0%, #ff3300 100%)";
    case "earth":
      return "linear-gradient(135deg, #77aa33 0%, #336633 100%)";
    case "air":
      return "linear-gradient(135deg, #33ccff 0%, #3366ff 100%)";
    case "water":
      return "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"; // 默认紫色渐变
    default:
      return "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)";
  }
};

// 根据当前日期获取对应的星座
const getCurrentDateZodiac = () => {
  const now = new Date();
  const month = now.getMonth() + 1; // 月份从0开始，需要+1
  const day = now.getDate();

  return getZodiacByDate(month, day);
};

// 根据日期计算星座
const getZodiacByDate = (month, day) => {
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return "水瓶座";
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return "双鱼座";
  } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return "白羊座";
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return "金牛座";
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
    return "双子座";
  } else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
    return "巨蟹座";
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return "狮子座";
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return "处女座";
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
    return "天秤座";
  } else if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) {
    return "天蝎座";
  } else if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) {
    return "射手座";
  } else {
    return "摩羯座";
  }
};

// 设置相关
const showSettings = () => {
  settingsVisible.value = true;
};

// 简化的分享图片生成方案 - 不使用复杂的Canvas绘制
const generateShareImage = async () => {
  try {
    return new Promise((resolve) => {
      const ctx = uni.createCanvasContext("shareCanvas");

      // 简单纯色背景
      const element = zodiacElements[currentZodiac.value];
      let bgColor = "#6366f1"; // 默认紫色

      if (element === "fire") bgColor = "#ff7700";
      else if (element === "earth") bgColor = "#77aa33";
      else if (element === "air") bgColor = "#33ccff";

      // 绘制背景和文字
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 300, 400);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText(currentZodiac.value, 30, 50);
      ctx.font = "18px sans-serif";
      ctx.fillText("今日运势", 30, 90);

      // 简单绘制运势等级
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(fortuneData.value?.overall?.level || "普通", 30, 140);

      // 执行绘制
      ctx.draw(false, () => {
        uni.canvasToTempFilePath({
          canvasId: "shareCanvas",
          success: (res) => {
            console.log("生成分享图片成功:", res.tempFilePath);
            resolve(res.tempFilePath);
          },
          fail: (err) => {
            console.error("生成分享图片失败:", err);
            resolve(`/static/share/${currentZodiac.value}.png`);
          },
        });
      });
    });
  } catch (e) {
    console.error("分享图片生成错误:", e);
    return `/static/share/${currentZodiac.value}.png`;
  }
};

// 保存用户设置
const saveUserSettings = (settings) => {
  currentZodiac.value = settings.sign;
  birthDate.value = settings.birthDate;

  uni.setStorageSync("userZodiac", {
    sign: settings.sign,
    birthDate: settings.birthDate,
  });

  fetchZodiacData(settings.sign);
};

// 从云函数获取星座运势数据
const fetchZodiacData = async (zodiacName = null) => {
  loading.value = true;
  try {
    const zodiacToFetch = zodiacName || currentZodiac.value;

    console.log("开始获取星座数据:", zodiacToFetch);

    // 增加重试逻辑
    let retryCount = 0;
    const maxRetry = 2;
    let result = null;

    while (retryCount <= maxRetry) {
      try {
        const callResult = await uniCloud.callFunction({
          name: "getZodiacFortune",
          data: {
            zodiac: zodiacToFetch,
            zodiacSign: zodiacToFetch, // 同时提供两个参数名以兼容不同环境
          },
        });

        result = callResult.result;
        console.log("云函数返回结果:", result);
        break; // 成功则跳出重试循环
      } catch (callError) {
        console.error(`第${retryCount + 1}次调用失败:`, callError);
        retryCount++;

        if (retryCount > maxRetry) {
          throw callError; // 重试次数用完仍失败，抛出错误
        }

        // 等待一秒后重试
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (result && result.code === 0 && result.data) {
      // 适配新的数据结构
      const { zodiacInfo, fortune } = result.data;

      // 将数据映射到页面所需格式
      fortuneData.value = {
        date: fortune.date,
        summary: fortune.overall?.description || "",
        overall: {
          level: fortune.overall?.level || "一般",
          rating: Math.round((fortune.overall?.index || 50) / 20), // 转换为1-5星评级
        },
        love: {
          rating: Math.round((fortune.love?.index || 50) / 20),
          description: fortune.love?.description || "",
        },
        career: {
          rating: Math.round((fortune.career?.index || 50) / 20),
          description: fortune.career?.description || "",
        },
        wealth: {
          rating: Math.round((fortune.wealth?.index || 50) / 20),
          description: fortune.wealth?.description || "",
        },
        health: {
          rating: Math.round((fortune.health?.index || 50) / 20),
          description: fortune.health?.description || "",
        },
        luckyColor: fortune.luckyColor || "",
        luckyNumber: fortune.luckyNumber || "",
        luckyZodiac: getRandomZodiac(zodiacToFetch), // 随机选择一个幸运星座
        goodFor: fortune.goodFor || "",
        badFor: fortune.badFor || "",
      };

      console.log("获取星座运势成功:", fortuneData.value);

      // 数据加载完成后可以尝试预生成分享图片，但不要依赖它
      nextTick(() => {
        // 尝试生成分享图片，但不要阻塞其他功能
        generateShareImage().catch(() => {
          console.log("预生成分享图片失败，将使用静态图片");
        });
      });
    } else {
      console.error("获取星座运势失败:", result.message);
      uni.showToast({
        title: "获取星座运势失败: " + result.message,
        icon: "none",
      });
    }
  } catch (error) {
    console.error("获取星座运势出错:", error);
    // 增加更详细的错误信息
    let errorMsg = "网络异常，请稍后再试";
    if (error && error.message) {
      errorMsg += "(" + error.message + ")";
      console.log("详细错误信息:", JSON.stringify(error));
    }
    uni.showToast({
      title: errorMsg,
      icon: "none",
      duration: 3000,
    });
  } finally {
    loading.value = false;
  }
};

// 获取随机的幸运星座（除了自己）
const getRandomZodiac = (currentZodiac) => {
  // 排除当前星座
  const otherZodiacs = zodiacSigns.filter((z) => z !== currentZodiac);
  // 随机选择一个
  return otherZodiacs[Math.floor(Math.random() * otherZodiacs.length)];
};

// 在页面加载时就开启分享选项
onMounted(() => {
  // 加载保存的星座设置
  const savedZodiac = uni.getStorageSync("userZodiac");

  if (savedZodiac && savedZodiac.sign) {
    currentZodiac.value = savedZodiac.sign;
    birthDate.value = savedZodiac.birthDate || "2000-01-01";
  } else {
    // 如果用户没有设置星座，使用当前日期的星座
    currentZodiac.value = getCurrentDateZodiac();
    // 显示设置弹窗，并标记为首次使用
    settingsVisible.value = true;
    isFirstTimeUser.value = true;
  }

  // 启用分享功能
  uni.showShareMenu({
    withShareTicket: true,
    menus: ["shareAppMessage", "shareTimeline"],
  });

  // 获取星座运势数据
  fetchZodiacData(currentZodiac.value);
});

// 页面显示时刷新数据
onShow(() => {
  fetchZodiacData(currentZodiac.value);
});

// 当星座变化时，刷新数据
watch(currentZodiac, (newVal) => {
  fetchZodiacData(newVal);
});

// 修改分享函数
onShareAppMessage(() => {
  return {
    title: `${currentZodiac.value}今日运势 - ${
      fortuneData.value?.overall?.level || "查看你的星座运势"
    }`,
    path: "/pages/index/index",
    imageUrl: `/static/share/${currentZodiac.value}.png`, // 确保路径正确
  };
});

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: `${currentZodiac.value}今日运势分析 - 星座运势`,
    query: `zodiac=${encodeURIComponent(currentZodiac.value)}`,
    imageUrl: `/static/share/${currentZodiac.value}.png`, // 确保路径正确
  };
});
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  max-width: 100%;
  overflow-x: hidden;
}

.content-area {
  flex: 1;
  padding: 30rpx 40rpx;
  box-sizing: border-box;
  width: 100%;
}
</style>
