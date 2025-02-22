<template>
  <view class="todo-list">
    <view class="section-title">
      <text>待办事项</text>
      <text class="add-btn" @tap="addTodo">+</text>
    </view>

    <view v-if="loading" class="loading-state">
      <text>正在分析待办事项...</text>
    </view>

    <view v-else class="todo-items">
      <view v-if="todos.length === 0" class="empty-state">
        <text>暂无待办事项</text>
      </view>
      <view
        v-else
        v-for="(todo, index) in todos"
        :key="index"
        class="todo-item"
      >
        <checkbox
          :checked="todo.completed"
          @tap="toggleTodo(index)"
          :disabled="todo.completed"
        ></checkbox>
        <text :class="{ 'todo-text': true, completed: todo.completed }">
          {{ todo.text }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { onShow, onHide } from "@dcloudio/uni-app";
import { analyzeTodoList } from "@/api/search.js";

const todos = ref([]);
const loading = ref(false);

// 添加路由监听，当从备忘录页面返回时触发分析
let isVisible = ref(false);

const loadTodos = async () => {
  const notes = uni.getStorageSync("notes") || [];
  const completedTodos = uni.getStorageSync("completedTodos") || [];
  const analyzedTodosCache = uni.getStorageSync("analyzedTodos") || {};

  loading.value = true;
  try {
    const analyzedNotes = await Promise.all(
      notes.map(async (note) => {
        const originalContent = note.content;
        const isCompleted =
          completedTodos.includes(originalContent) || note.completed;

        if (isCompleted) {
          return {
            text: analyzedTodosCache[originalContent] || originalContent,
            completed: true,
            originalContent,
          };
        }

        if (analyzedTodosCache[originalContent]) {
          return {
            text: analyzedTodosCache[originalContent],
            completed: false,
            originalContent,
          };
        }

        try {
          const analysis = await analyzeTodoList(originalContent);
          const parsedAnalysis =
            typeof analysis === "string" ? JSON.parse(analysis) : analysis;
          const outputText = parsedAnalysis.output || originalContent;

          analyzedTodosCache[originalContent] = outputText;
          uni.setStorageSync("analyzedTodos", analyzedTodosCache);

          return {
            text: outputText,
            completed: false,
            originalContent,
          };
        } catch (error) {
          console.error("待办事项分析失败:", error);
          return {
            text: originalContent,
            completed: false,
            originalContent,
          };
        }
      })
    );
    todos.value = analyzedNotes;
  } catch (error) {
    console.error("加载待办事项失败:", error);
    todos.value = notes.map((note) => ({
      text: note.content,
      completed: false,
      originalContent: note.content,
    }));
  } finally {
    loading.value = false;
  }
};

onShow(() => {
  if (!isVisible.value) {
    isVisible.value = true;
    loadTodos();
  }
});

onHide(() => {
  isVisible.value = false;
});

const addTodo = () => {
  uni.navigateTo({
    url: "/pages/note/index",
  });
};

const toggleTodo = (index) => {
  if (!todos.value[index].completed) {
    todos.value[index].completed = true;

    const originalContent = todos.value[index].originalContent;

    const completedTodos = uni.getStorageSync("completedTodos") || [];
    console.log(completedTodos, "completedTodos");
    if (!completedTodos.includes(originalContent)) {
      completedTodos.push(originalContent);
      uni.setStorageSync("completedTodos", completedTodos);
    }

    const notes = uni.getStorageSync("notes") || [];
    const noteIndex = notes.findIndex(
      (note) => note.content === originalContent
    );
    if (noteIndex !== -1) {
      notes[noteIndex].completed = true;
      uni.setStorageSync("notes", notes);
    }
  }
};
</script>

<style lang="scss" scoped>
.todo-list {
  padding: 20rpx;
  background-color: $uni-color-white;
  border-radius: $uni-radius-lg;
  margin-top: 40rpx;
  .section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: $uni-font-size-lg;
    color: $text-color;
    margin-bottom: 20rpx;
    font-weight: 500;

    .add-btn {
      font-size: 40rpx;
      color: $brand-color;
      padding: 0 20rpx;
    }
  }

  .todo-items {
    .todo-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1px solid $uni-color-border;

      &:last-child {
        border-bottom: none;
      }
    }

    .todo-text {
      margin-left: 20rpx;
      color: $text-color;
      white-space: pre-wrap;

      &.completed {
        text-decoration: line-through;
        color: $text-color-secondary;
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 40rpx;
    color: $text-color-secondary;
    font-size: $uni-font-size-base;
  }

  .loading-state {
    text-align: center;
    padding: 40rpx;
    color: $text-color-secondary;
    font-size: $uni-font-size-base;
  }

  .todo-item {
    checkbox {
      &[disabled] {
        opacity: 0.5;
      }
    }
  }
}
</style>
