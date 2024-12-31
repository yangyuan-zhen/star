"use strict";
const common_vendor = require("../common/vendor.js");
function useNotes() {
  const notes = common_vendor.ref([]);
  const remainingCount = common_vendor.computed(() => 5 - notes.value.length);
  const loadNotes = () => {
    notes.value = common_vendor.index.getStorageSync("notes") || [];
  };
  const saveToStorage = () => {
    common_vendor.index.setStorageSync("notes", notes.value);
  };
  const addNote = (note) => {
    notes.value.push(note);
    saveToStorage();
  };
  const updateNote = (index, note) => {
    notes.value[index] = note;
    saveToStorage();
  };
  const deleteNote = (index) => {
    notes.value.splice(index, 1);
    saveToStorage();
  };
  const clearNotes = () => {
    notes.value = [];
    saveToStorage();
  };
  return {
    notes,
    remainingCount,
    loadNotes,
    addNote,
    updateNote,
    deleteNote,
    clearNotes
  };
}
exports.useNotes = useNotes;
