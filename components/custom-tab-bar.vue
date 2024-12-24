<template>
  <view class="tab-bar">
    <view
      class="tab-item"
      v-for="(item, index) in tabs"
      :key="index"
      @tap="switchTab(item.pagePath)"
    >
      <uni-icons
        :type="
          currentPath === item.pagePath ? item.selectedIconPath : item.iconPath
        "
        :color="currentPath === item.pagePath ? activeColor : color"
        size="24"
      />
      <text
        class="tab-text"
        :style="{ color: currentPath === item.pagePath ? activeColor : color }"
      >
        {{ item.text }}
      </text>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "CustomTabBar",
  setup() {
    const currentPath = ref("/pages/note/index");
    const color = "#999999";
    const activeColor = "#007AFF";

    const tabs = [
      {
        pagePath: "/pages/note/index",
        text: "笔记",
        iconPath: "bookmark",
        selectedIconPath: "bookmark-filled",
      },
      {
        pagePath: "/pages/more/index",
        text: "更多",
        iconPath: "more",
        selectedIconPath: "more-filled",
      },
    ];

    const switchTab = (path: string) => {
      if (currentPath.value === path) return;
      currentPath.value = path;
      uni.switchTab({ url: path });
    };

    return {
      currentPath,
      color,
      activeColor,
      tabs,
      switchTab,
    };
  },
});
</script>

<style lang="scss">
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: #ffffff;
  display: flex;
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1px solid #eee;
  z-index: 999;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px 0;
}

.tab-text {
  font-size: 12px;
  margin-top: 4px;
}
</style>
