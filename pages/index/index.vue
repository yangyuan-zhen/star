<template>
  <div class="home">
    <!-- 搜索框 -->
    <div class="search-box">
      <i class="icon-search"></i>
      <input
        type="text"
        v-model="searchKeyword"
        @input="(e) => handleSearch((e.target as HTMLInputElement).value)"
        placeholder="搜索一下，你就知道"
      />
      <i v-if="searchKeyword" class="icon-close" @tap="handleSearch('')"></i>
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs">
      <div
        class="tab"
        :class="{ active: currentTab === 'movie' }"
        @tap="handleTabChange('movie')"
      >
        影视剧阿里云盘☁
      </div>
      <div
        class="tab"
        :class="{ active: currentTab === 'education' }"
        @tap="handleTabChange('education')"
      >
        教辅资料库
      </div>
    </div>

    <!-- 资源列表 -->
    <div class="resource-list" v-if="currentTab === 'movie'">
      <div class="resource-grid">
        <div
          class="resource-item"
          v-for="(item, index) in currentList"
          :key="index"
          @tap="showDownloadLink(item)"
        >
          <image
            class="resource-image"
            :src="item.photo"
            mode="aspectFill"
          ></image>
          <div class="resource-info">
            <div class="title" v-html="formatTitle(item.text[0])"></div>
            <div class="size">{{ getSize(item.text) }}</div>
          </div>
        </div>
      </div>

      <!-- 分页器 -->
      <div class="pagination">
        <div
          class="page-btn"
          @tap="prevPage"
          :class="{ disabled: currentPage === 1 }"
        >
          上一页
        </div>
        <div class="page-number">{{ currentPage }} / {{ totalPages }}</div>
        <div class="page-btn" @tap="nextPage" :class="{ disabled: !hasMore }">
          下一页
        </div>
      </div>
    </div>

    <div class="resource-list" v-else>
      <div class="under-construction">
        <image
          class="construction-image"
          src="/static/images/construction.png"
          mode="aspectFit"
        ></image>
        <div class="construction-text">内容正在施工中...</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import resultJson from "/static/movies/result.json";
import imageDataJson from "/static/movies/image_data.json";

// 添加类型声明
interface State {
  searchKeyword: string;
  currentTab: string;
  currentPage: number;
  allData: ResourceItem[];
  hasMore: boolean;
  searchResults: ResourceItem[];
}

// 定义数据结构接口
interface ResourceItem {
  id: number;
  photo: string;
  text: any[];
  type: string;
  date: string;
  from: string;
  from_id: string;
  width: number;
  height: number;
}

// 添加 JSON 数据的类型声明
interface JsonData {
  messages: ResourceItem[];
}

// 添加图片数据接口
interface ImageData {
  fileName: string;
  url: string;
}

// 分页相关数据
const pageSize = 10;
const currentPage = ref(1);
const allData = ref<ResourceItem[]>([]);
const hasMore = ref(true);
const currentTab = ref<string>("movie");

// 计算总页数
const totalPages = computed(() => Math.ceil(allData.value.length / pageSize));

// 添加搜索相关的状态
const searchKeyword = ref<string>("");
const searchResults = ref<ResourceItem[]>([]);

// 修改列表数据的计算方法，加入搜索过滤
const currentList = computed(() => {
  let filteredData = searchKeyword.value ? searchResults.value : allData.value;

  const start = (currentPage.value - 1) * pageSize;
  const end = currentPage.value * pageSize;
  return filteredData.slice(start, end);
});

// 搜索功能
const handleSearch = (value: string) => {
  searchKeyword.value = value;
  if (!value) {
    searchResults.value = [];
    return;
  }

  searchResults.value = allData.value.filter((item) => {
    const title = getTitle(item.text[0]).toLowerCase();
    return title.includes(value.toLowerCase());
  });

  // 重置分页
  currentPage.value = 1;
  hasMore.value = searchResults.value.length > pageSize;
};

// 修改分页方法，添加滚动
const scrollToTop = () => {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300,
  });
};

// 修改翻页方法
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    scrollToTop();
  }
};

const nextPage = () => {
  if (hasMore.value) {
    currentPage.value++;
    if (currentPage.value * pageSize >= allData.value.length) {
      hasMore.value = false;
    }
    scrollToTop();
  }
};

// 切换标签
const handleTabChange = (tab: string) => {
  currentTab.value = tab;
  currentPage.value = 1;
  hasMore.value = true;
  fetchData(tab);
};

// 获取数据
const fetchData = async (tab: string) => {
  try {
    allData.value = resultJson.messages
      .filter((item: ResourceItem) => {
        if (!Array.isArray(item.text)) return false;

        const hasVipLink = item.text.some((text: any) => {
          if (typeof text === "string") {
            return (
              text.toLowerCase().includes("vip") ||
              text.toLowerCase().includes("iqiyi") ||
              text.toLowerCase().includes("hongbao")
            );
          }
          if (typeof text === "object" && text.text) {
            return (
              text.text.toLowerCase().includes("vip") ||
              text.text.toLowerCase().includes("iqiyi") ||
              text.text.toLowerCase().includes("hongbao")
            );
          }
          return false;
        });

        return !hasVipLink;
      })
      .map((item: ResourceItem) => {
        const imageData = imageDataJson.find(
          (img: ImageData) => img.fileName === item.photo?.split("/")[1]
        );

        return {
          ...item,
          photo: imageData ? imageData.url : "/static/images/default.png",
        };
      });

    console.log("处理后的数据:", allData.value);
  } catch (error) {
    console.error("数据处理失败:", error);
  }
};

// 初始化数据
fetchData(currentTab.value);

// 使用 onMounted 生命周期
onMounted(() => {
  fetchData(currentTab.value);
});

// 显示下载链接
const showDownloadLink = (item: any) => {
  const linkItem = item.text_entities?.find(
    (entity: any) => entity.type === "link"
  );
  if (linkItem) {
    uni.showModal({
      title: "下载链接",
      content: linkItem.text,
      confirmText: "复制链接",
      success: (res) => {
        if (res.confirm) {
          uni.setClipboardData({
            data: linkItem.text,
            success: () => {
              uni.showToast({
                title: "链接已复制",
                icon: "success",
              });
            },
          });
        }
      },
    });
  }
};

// 提取标题
const getTitle = (text: any) => {
  if (typeof text === "string") {
    return text.split("\n")[0];
  }
  // 如果是对象格式
  if (typeof text === "object" && text.text) {
    return text.text;
  }
  // 如果是其他格式，尝试转换为字符串
  return String(text);
};

// 提取文件大小
const getSize = (text: any[]) => {
  // 如果是数组，找到最后一个元素（通常是文件）
  if (Array.isArray(text)) {
    const lastItem = text[text.length - 1];
    // 如果最后一个元素是字符串，直接返回
    if (typeof lastItem === "string" && lastItem.includes("G")) {
      return lastItem.trim();
    }
    // 如果最后一个元素是对象，尝试获取 text 属性
    if (typeof lastItem === "object" && lastItem.text) {
      return lastItem.text.trim();
    }
  }
  return "";
};

// 格式化标题，让4K变红
const formatTitle = (text: any) => {
  if (typeof text === "string") {
    return text.replace(/4K/gi, '<span class="text-4k">4K</span>');
  }
  if (typeof text === "object" && text.text) {
    return text.text.replace(/4K/gi, '<span class="text-4k">4K</span>');
  }
  return text;
};

// 在 setup 末尾添加
defineExpose({
  handleTabChange,
});
</script>

<style scoped lang="scss">
.home {
  padding: 32rpx;

  .search-box {
    display: flex;
    align-items: center;
    background: #f5f5f5;
    padding: 16rpx 32rpx;
    border-radius: 40rpx;
    margin-bottom: 40rpx;

    input {
      border: none;
      background: none;
      width: 100%;
      padding-left: 16rpx;
      font-size: 28rpx;
    }

    .icon-close {
      font-size: 32rpx;
      color: #999;
      padding: 8rpx;
    }
  }

  .category-tabs {
    display: flex;
    margin: 40rpx 0;
    border-bottom: 1rpx solid #eee;

    .tab {
      flex: 1;
      text-align: center;
      font-size: 28rpx;
      color: #666;
      padding: 24rpx 0;
      position: relative;

      &.active {
        color: #333;
        font-weight: bold;

        &::after {
          content: "";
          position: absolute;
          bottom: -2rpx;
          left: 50%;
          transform: translateX(-50%);
          width: 40%;
          height: 4rpx;
          background: #ff6b6b;
        }
      }
    }
  }

  .resource-list {
    .resource-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 32rpx;
      padding-bottom: 40rpx;
    }

    .resource-item {
      border: 2rpx solid #eee;
      border-radius: 16rpx;
      overflow: hidden;

      .resource-image {
        width: 100%;
        height: 400rpx;
        border-radius: 16rpx 16rpx 0 0;
      }

      .resource-info {
        padding: 24rpx;

        .title {
          font-size: 28rpx;
          font-weight: bold;
          margin-bottom: 16rpx;
          line-height: 40rpx;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;

          :deep(.text-4k) {
            color: #ff4444;
          }
        }

        .size {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40rpx 0;
    gap: 32rpx;

    .page-btn {
      padding: 16rpx 32rpx;
      background: #f5f5f5;
      border-radius: 8rpx;
      font-size: 28rpx;
      color: #333;

      &.disabled {
        color: #999;
        background: #eee;
      }
    }

    .page-number {
      font-size: 28rpx;
      color: #666;
    }
  }

  .under-construction {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;

    .construction-image {
      width: 200px;
      height: 200px;
      margin-bottom: 20px;
    }

    .construction-text {
      font-size: 16px;
      color: #999;
      text-align: center;
    }
  }
}

.resource-item {
  cursor: pointer; // 添加手型光标
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98); // 点击时的缩放效果
  }
}
</style>
