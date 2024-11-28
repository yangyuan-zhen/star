<template>
  <web-view :src="url"></web-view>
</template>

<script setup>
import { ref } from "vue";

const url = ref("");

// 使用 defineProps 获取参数
const props = defineProps({
  url: {
    type: String,
    default: "",
  },
});

// 监听 props 变化
if (props.url) {
  url.value = decodeURIComponent(props.url);
}
</script>
