"use strict";
const common_vendor = require("../common/vendor.js");
const composables_useNotes = require("./useNotes.js");
function useWeekday() {
  const { clearNotes } = composables_useNotes.useNotes();
  const weekdayState = common_vendor.computed(() => {
    const today = /* @__PURE__ */ new Date();
    const dayOfWeek = today.getDay();
    return {
      isSunday: dayOfWeek === 0,
      isMonday: dayOfWeek === 1,
      isFriday: dayOfWeek === 5
    };
  });
  const checkAndClearNotes = () => {
    if (weekdayState.value.isSunday) {
      clearNotes();
      common_vendor.index.showToast({
        title: "新的一周开始了，备忘录已重置",
        icon: "none"
      });
    }
  };
  return {
    weekdayState,
    checkAndClearNotes
  };
}
exports.useWeekday = useWeekday;
