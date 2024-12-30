<template>
  <view class="note-container">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">我的备忘录</text>
      <text class="subtitle">本周剩余可添加: {{ 5 - notes.length }}</text>
      <text v-if="isMonday" class="reminder info">
        新的一周开始啦，开始记录你的计划吧！
      </text>
      <text v-if="isFriday" class="reminder warning">
        今天是周五，请检查本周待办事项是否已处理完毕
      </text>
      <text v-if="isSunday" class="reminder danger">
        今天是周日，备忘录将在今晚清空
      </text>
    </view>

    <!-- 备忘录列表 -->
    <view class="notes-list">
      <view v-for="(note, index) in notes" :key="index" class="note-item">
        <view class="note-content">
          <text>{{ note.content }}</text>
          <text class="note-date">{{ note.date }}</text>
        </view>
        <view class="note-actions">
          <button @tap="editNote(index)" class="btn edit">编辑</button>
          <button @tap="deleteNote(index)" class="btn delete">删除</button>
        </view>
      </view>
    </view>

    <!-- 添加按钮 -->
    <button @tap="showAddModal" class="add-btn" :disabled="notes.length >= 5">
      添加备忘
    </button>

    <!-- 添加/编辑弹窗 -->
    <view class="modal" v-if="showModal">
      <view class="modal-content">
        <textarea
          v-model="currentNote"
          placeholder="请输入备忘内容"
          class="note-input"
          :maxlength="1000"
          show-confirm-bar="false"
        />
        <view class="word-count">{{ currentNote.length }}/1000</view>
        <view class="modal-btns">
          <button @tap="cancelEdit" class="btn cancel">取消</button>
          <button @tap="saveNote" class="btn save">保存</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Note {
  content: string;
  date: string;
}

export default defineComponent({
  data() {
    return {
      notes: [] as Note[],
      showModal: false,
      currentNote: "",
      editIndex: -1,
      isMonday: false,
      isFriday: false,
      isSunday: false,
    };
  },
  mounted() {
    this.loadNotes();
    this.checkWeekday();
    if (this.isSunday) {
      this.checkAndClearNotes();
    }
  },
  methods: {
    loadNotes(): void {
      const savedNotes = uni.getStorageSync("notes") || [];
      this.notes = savedNotes;
    },
    showAddModal(): void {
      if (this.notes.length >= 5) {
        uni.showToast({
          title: "本周已达到添加上限，请处理一些事项哦",
          icon: "none",
        });
        return;
      }
      this.showModal = true;
      this.currentNote = "";
      this.editIndex = -1;
    },
    editNote(index: number): void {
      this.showModal = true;
      this.currentNote = this.notes[index].content;
      this.editIndex = index;
    },
    deleteNote(index: number): void {
      uni.showModal({
        title: "确认删除",
        content: "是否确认删除该备忘？",
        success: (res) => {
          if (res.confirm) {
            this.notes.splice(index, 1);
            this.saveToStorage();
          }
        },
      });
    },
    saveNote(): void {
      if (!this.currentNote.trim()) {
        uni.showToast({
          title: "内容不能为空",
          icon: "none",
        });
        return;
      }

      const noteObj: Note = {
        content: this.currentNote,
        date: new Date().toLocaleDateString(),
      };

      if (this.editIndex === -1) {
        this.notes.push(noteObj);
      } else {
        this.notes[this.editIndex] = noteObj;
      }

      this.saveToStorage();
      this.showModal = false;
    },
    cancelEdit(): void {
      this.showModal = false;
    },
    saveToStorage(): void {
      uni.setStorageSync("notes", this.notes);
    },
    checkWeekday(): void {
      const today = new Date();
      this.isMonday = today.getDay() === 1;
      this.isFriday = today.getDay() === 5;
      this.isSunday = today.getDay() === 0;
    },
    checkAndClearNotes(): void {
      const lastClearDate = uni.getStorageSync("lastClearDate");
      const today = new Date().toDateString();

      if (lastClearDate !== today) {
        this.notes = [];
        this.saveToStorage();
        uni.setStorageSync("lastClearDate", today);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.note-container {
  padding: $uni-spacing-base;
  background: $uni-color-bg;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: calc(
    100rpx + env(safe-area-inset-bottom) + #{$uni-spacing-xl}
  );
}

.header {
  padding: $uni-spacing-lg $uni-spacing-base;
  background: $uni-color-white;
  margin-bottom: $uni-spacing-lg;
  border-radius: $uni-radius-lg;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  .title {
    font-size: $uni-font-size-xl;
    font-weight: 600;
    color: $uni-color-text;
    margin-bottom: $uni-spacing-xs;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .subtitle {
    font-size: $uni-font-size-base;
    color: $uni-color-text-secondary;
    background: $uni-color-bg;
    padding: $uni-spacing-xs $uni-spacing-sm;
    border-radius: $uni-radius-sm;
    display: inline-block;
  }

  .reminder {
    display: block;
    margin-top: $uni-spacing-sm;
    padding: $uni-spacing-xs $uni-spacing-sm;
    border-radius: $uni-radius-sm;
    font-size: $uni-font-size-sm;

    &.warning {
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
    }

    &.danger {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    &.info {
      background: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    }
  }
}

.notes-list {
  margin-bottom: $uni-spacing-lg;
}

.note-item {
  background: $uni-color-white;
  border-radius: $uni-radius-lg;
  padding: $uni-spacing-lg;
  margin: $uni-spacing-sm $uni-spacing-base;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .note-content {
    font-size: $uni-font-size-base;
    color: $uni-color-text;
    margin-bottom: $uni-spacing-sm;
    line-height: 1.4;

    .note-date {
      font-size: $uni-font-size-sm;
      color: $uni-color-text-secondary;
      margin-top: $uni-spacing-xs;
      display: block;
    }
  }

  .note-actions {
    display: flex;
    justify-content: flex-end;
    gap: $uni-spacing-sm;
    margin-top: $uni-spacing-base;
  }
}

.btn {
  padding: $uni-spacing-xs $uni-spacing-lg;
  border-radius: $uni-radius-base;
  font-size: $uni-font-size-base;
  border: none;
  font-weight: 500;

  &.edit {
    background: $uni-color-success;
    color: $uni-color-white;
  }

  &.delete {
    background: $uni-color-error;
    color: $uni-color-white;
  }

  &.cancel {
    background: $uni-color-bg;
    color: $uni-color-text-secondary;
  }

  &.save {
    background: $uni-color-primary;
    color: $uni-color-white;
  }
}

.add-btn {
  // 移除 position: fixed 相关样式
  margin: $uni-spacing-lg auto; // 改用上下外边距
  width: 140px; // 设置固定宽度
  background: $uni-color-primary;
  color: $uni-color-white;
  padding: $uni-spacing-sm $uni-spacing-lg; // 减小内边距
  border-radius: $uni-radius-base;
  font-size: $uni-font-size-base; // 减小字体大小
  font-weight: 500;
  text-align: center;
  box-shadow: 0 2px 8px rgba($uni-color-primary, 0.2); // 减小阴影

  &:disabled {
    background: $uni-color-disabled;
    opacity: 0.8;
    box-shadow: none;
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($uni-color-text, 0.4);
  z-index: 999;

  .modal-content {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: $uni-color-white;
    width: 90%;
    padding: $uni-spacing-lg;
    border-radius: $uni-radius-lg;
  }

  .note-input {
    width: calc(100% - 2px);
    height: 200px;
    border: 1px solid $uni-color-border;
    border-radius: $uni-radius-base;
    padding: $uni-spacing-base;
    margin-bottom: $uni-spacing-xs;
    font-size: $uni-font-size-base;
    box-sizing: border-box;
  }

  .word-count {
    text-align: right;
    font-size: $uni-font-size-sm;
    color: $uni-color-text-secondary;
    margin-bottom: $uni-spacing-base;
    padding-right: $uni-spacing-xs;
  }

  .modal-btns {
    display: flex;
    justify-content: flex-end;
    gap: $uni-spacing-base;
    padding: 0 $uni-spacing-xs;

    .btn {
      min-width: 80px;
      padding: $uni-spacing-xs $uni-spacing-lg;
    }
  }
}

.note-item {
  .note-content {
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 1.6;
  }
}
</style>
