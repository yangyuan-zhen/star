"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      notes: [],
      showModal: false,
      currentNote: "",
      editIndex: -1,
      isMonday: false,
      isFriday: false,
      isSunday: false
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
    loadNotes() {
      const savedNotes = common_vendor.index.getStorageSync("notes") || [];
      this.notes = savedNotes;
    },
    showAddModal() {
      if (this.notes.length >= 5) {
        common_vendor.index.showToast({
          title: "本周已达到添加上限，请处理一些事项哦",
          icon: "none"
        });
        return;
      }
      this.showModal = true;
      this.currentNote = "";
      this.editIndex = -1;
    },
    editNote(index) {
      this.showModal = true;
      this.currentNote = this.notes[index].content;
      this.editIndex = index;
    },
    deleteNote(index) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "是否确认删除该备忘？",
        success: (res) => {
          if (res.confirm) {
            this.notes.splice(index, 1);
            this.saveToStorage();
          }
        }
      });
    },
    saveNote() {
      if (!this.currentNote.trim()) {
        common_vendor.index.showToast({
          title: "内容不能为空",
          icon: "none"
        });
        return;
      }
      const noteObj = {
        content: this.currentNote,
        date: (/* @__PURE__ */ new Date()).toLocaleDateString()
      };
      if (this.editIndex === -1) {
        this.notes.push(noteObj);
      } else {
        this.notes[this.editIndex] = noteObj;
      }
      this.saveToStorage();
      this.showModal = false;
    },
    cancelEdit() {
      this.showModal = false;
    },
    saveToStorage() {
      common_vendor.index.setStorageSync("notes", this.notes);
    },
    checkWeekday() {
      const today = /* @__PURE__ */ new Date();
      this.isMonday = today.getDay() === 1;
      this.isFriday = today.getDay() === 5;
      this.isSunday = today.getDay() === 0;
    },
    checkAndClearNotes() {
      const lastClearDate = common_vendor.index.getStorageSync("lastClearDate");
      const today = (/* @__PURE__ */ new Date()).toDateString();
      if (lastClearDate !== today) {
        this.notes = [];
        this.saveToStorage();
        common_vendor.index.setStorageSync("lastClearDate", today);
      }
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t(5 - _ctx.notes.length),
    b: _ctx.isMonday
  }, _ctx.isMonday ? {} : {}, {
    c: _ctx.isFriday
  }, _ctx.isFriday ? {} : {}, {
    d: _ctx.isSunday
  }, _ctx.isSunday ? {} : {}, {
    e: common_vendor.f(_ctx.notes, (note, index, i0) => {
      return {
        a: common_vendor.t(note.content),
        b: common_vendor.t(note.date),
        c: common_vendor.o(($event) => _ctx.editNote(index), index),
        d: common_vendor.o(($event) => _ctx.deleteNote(index), index),
        e: index
      };
    }),
    f: common_vendor.o((...args) => _ctx.showAddModal && _ctx.showAddModal(...args)),
    g: _ctx.notes.length >= 5,
    h: _ctx.showModal
  }, _ctx.showModal ? {
    i: _ctx.currentNote,
    j: common_vendor.o(($event) => _ctx.currentNote = $event.detail.value),
    k: common_vendor.t(_ctx.currentNote.length),
    l: common_vendor.o((...args) => _ctx.cancelEdit && _ctx.cancelEdit(...args)),
    m: common_vendor.o((...args) => _ctx.saveNote && _ctx.saveNote(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-fbfe11c7"]]);
wx.createPage(MiniProgramPage);
