"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      notes: [],
      showModal: false,
      currentNote: "",
      editIndex: -1
    };
  },
  mounted() {
    this.loadNotes();
  },
  methods: {
    loadNotes() {
      const savedNotes = common_vendor.wx$1.getStorageSync("notes") || [];
      this.notes = savedNotes;
    },
    showAddModal() {
      if (this.notes.length >= 5) {
        common_vendor.wx$1.showToast({
          title: "本周已达到添加上限",
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
      common_vendor.wx$1.showModal({
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
        common_vendor.wx$1.showToast({
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
      common_vendor.wx$1.setStorageSync("notes", this.notes);
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t(5 - _ctx.notes.length),
    b: common_vendor.f(_ctx.notes, (note, index, i0) => {
      return {
        a: common_vendor.t(note.content),
        b: common_vendor.t(note.date),
        c: common_vendor.o(($event) => _ctx.editNote(index), index),
        d: common_vendor.o(($event) => _ctx.deleteNote(index), index),
        e: index
      };
    }),
    c: common_vendor.o((...args) => _ctx.showAddModal && _ctx.showAddModal(...args)),
    d: _ctx.notes.length >= 5,
    e: _ctx.showModal
  }, _ctx.showModal ? {
    f: _ctx.currentNote,
    g: common_vendor.o(($event) => _ctx.currentNote = $event.detail.value),
    h: common_vendor.t(_ctx.currentNote.length),
    i: common_vendor.o((...args) => _ctx.cancelEdit && _ctx.cancelEdit(...args)),
    j: common_vendor.o((...args) => _ctx.saveNote && _ctx.saveNote(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
