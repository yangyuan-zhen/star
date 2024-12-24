<template>
  <view class="note-container">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">我的备忘录</text>
      <text class="subtitle">本周剩余可添加: {{ 5 - notes.length }}</text>
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
    };
  },
  mounted() {
    this.loadNotes();
  },
  methods: {
    loadNotes(): void {
      const savedNotes = wx.getStorageSync("notes") || [];
      this.notes = savedNotes;
    },
    showAddModal(): void {
      if (this.notes.length >= 5) {
        wx.showToast({
          title: "本周已达到添加上限",
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
      wx.showModal({
        title: "确认删除",
        content: "是否确认删除该备忘？",
        success: (res: WechatMiniprogram.ShowModalSuccessCallbackResult) => {
          if (res.confirm) {
            this.notes.splice(index, 1);
            this.saveToStorage();
          }
        },
      });
    },
    saveNote(): void {
      if (!this.currentNote.trim()) {
        wx.showToast({
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
      wx.setStorageSync("notes", this.notes);
    },
  },
});
</script>

<style lang="scss">
// 定义变量
$color-primary: #007aff; // iOS 风格的蓝色
$color-success: #34c759; // 更柔和的绿色
$color-error: #ff3b30; // iOS 风格的红色
$color-text: #000000;
$color-text-secondary: #8e8e93;
$color-text-light: #c7c7cc;
$color-bg: #f2f2f7; // iOS 风格的背景色
$color-white: #ffffff;
$color-border: #e5e5ea;
$color-disabled: #c7c7cc;

$spacing-xs: 8px;
$spacing-sm: 12px;
$spacing-base: 16px;
$spacing-lg: 20px;
$spacing-xl: 24px;
$spacing-xxl: 32px;

$font-size-sm: 13px;
$font-size-base: 15px;
$font-size-lg: 17px;
$font-size-xl: 20px;
$font-size-xxl: 24px;

$radius-sm: 8px;
$radius-base: 10px;
$radius-lg: 12px;
$radius-xl: 16px;

.note-container {
  padding: $spacing-base;
  background: $color-bg;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: calc(50px + env(safe-area-inset-bottom) + #{$spacing-xl});
}

.header {
  padding: $spacing-lg $spacing-base;
  background: $color-white;
  margin-bottom: $spacing-lg;
  border-radius: $radius-lg;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  .title {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $color-text;
    margin-bottom: $spacing-xs;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .subtitle {
    font-size: $font-size-base;
    color: $color-text-secondary;
    background: $color-bg;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-sm;
    display: inline-block;
  }
}

.notes-list {
  margin-bottom: $spacing-lg;
}

.note-item {
  background: $color-white;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  margin: $spacing-sm $spacing-base;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .note-content {
    font-size: $font-size-base;
    color: $color-text;
    margin-bottom: $spacing-sm;
    line-height: 1.4;

    .note-date {
      font-size: $font-size-sm;
      color: $color-text-secondary;
      margin-top: $spacing-xs;
      display: block;
    }
  }

  .note-actions {
    display: flex;
    justify-content: flex-end;
    gap: $spacing-sm;
    margin-top: $spacing-base;
  }
}

.btn {
  padding: $spacing-xs $spacing-lg;
  border-radius: $radius-base;
  font-size: $font-size-base;
  border: none;
  font-weight: 500;

  &.edit {
    background: $color-success;
    color: $color-white;
  }

  &.delete {
    background: $color-error;
    color: $color-white;
  }

  &.cancel {
    background: $color-bg;
    color: $color-text-secondary;
  }

  &.save {
    background: $color-primary;
    color: $color-white;
  }
}

.add-btn {
  // 移除 position: fixed 相关样式
  margin: $spacing-lg auto; // 改用上下外边距
  width: 140px; // 设置固定宽度
  background: $color-primary;
  color: $color-white;
  padding: $spacing-sm $spacing-lg; // 减小内边距
  border-radius: $radius-base;
  font-size: $font-size-base; // 减小字体大小
  font-weight: 500;
  text-align: center;
  box-shadow: 0 2px 8px rgba($color-primary, 0.2); // 减小阴影

  &:disabled {
    background: $color-disabled;
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
  background: rgba($color-text, 0.4);
  z-index: 999;

  .modal-content {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: $color-white;
    width: 90%;
    padding: $spacing-lg;
    border-radius: $radius-lg;
  }

  .note-input {
    width: calc(100% - 2px);
    height: 200px;
    border: 1px solid $color-border;
    border-radius: $radius-base;
    padding: $spacing-base;
    margin-bottom: $spacing-xs;
    font-size: $font-size-base;
    box-sizing: border-box;
  }

  .word-count {
    text-align: right;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    margin-bottom: $spacing-base;
    padding-right: $spacing-xs;
  }

  .modal-btns {
    display: flex;
    justify-content: flex-end;
    gap: $spacing-base;
    padding: 0 $spacing-xs;

    .btn {
      min-width: 80px;
      padding: $spacing-xs $spacing-lg;
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
