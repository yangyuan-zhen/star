"use strict";
const common_vendor = require("../../common/vendor.js");
const api_search = require("../../api/search.js");
const _sfc_main = {
  __name: "TodoList",
  setup(__props) {
    const todos = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    let isVisible = common_vendor.ref(false);
    const loadTodos = async () => {
      const notes = common_vendor.index.getStorageSync("notes") || [];
      const completedTodos = common_vendor.index.getStorageSync("completedTodos") || [];
      const analyzedTodosCache = common_vendor.index.getStorageSync("analyzedTodos") || {};
      loading.value = true;
      try {
        const analyzedNotes = await Promise.all(
          notes.map(async (note) => {
            const originalContent = note.content;
            const isCompleted = completedTodos.includes(originalContent) || note.completed;
            if (isCompleted) {
              return {
                text: analyzedTodosCache[originalContent] || originalContent,
                completed: true,
                originalContent
              };
            }
            if (analyzedTodosCache[originalContent]) {
              return {
                text: analyzedTodosCache[originalContent],
                completed: false,
                originalContent
              };
            }
            try {
              const analysis = await api_search.analyzeTodoList(originalContent);
              const parsedAnalysis = typeof analysis === "string" ? JSON.parse(analysis) : analysis;
              const outputText = parsedAnalysis.output || originalContent;
              analyzedTodosCache[originalContent] = outputText;
              common_vendor.index.setStorageSync("analyzedTodos", analyzedTodosCache);
              return {
                text: outputText,
                completed: false,
                originalContent
              };
            } catch (error) {
              common_vendor.index.__f__("error", "at components/home/TodoList.vue:90", "待办事项分析失败:", error);
              return {
                text: originalContent,
                completed: false,
                originalContent
              };
            }
          })
        );
        todos.value = analyzedNotes;
      } catch (error) {
        common_vendor.index.__f__("error", "at components/home/TodoList.vue:101", "加载待办事项失败:", error);
        todos.value = notes.map((note) => ({
          text: note.content,
          completed: false,
          originalContent: note.content
        }));
      } finally {
        loading.value = false;
      }
    };
    common_vendor.onShow(() => {
      if (!isVisible.value) {
        isVisible.value = true;
        loadTodos();
      }
    });
    common_vendor.onHide(() => {
      isVisible.value = false;
    });
    const addTodo = () => {
      common_vendor.index.navigateTo({
        url: "/pages/note/index"
      });
    };
    const toggleTodo = (index) => {
      if (!todos.value[index].completed) {
        todos.value[index].completed = true;
        const originalContent = todos.value[index].originalContent;
        const completedTodos = common_vendor.index.getStorageSync("completedTodos") || [];
        common_vendor.index.__f__("log", "at components/home/TodoList.vue:136", completedTodos, "completedTodos");
        if (!completedTodos.includes(originalContent)) {
          completedTodos.push(originalContent);
          common_vendor.index.setStorageSync("completedTodos", completedTodos);
        }
        const notes = common_vendor.index.getStorageSync("notes") || [];
        const noteIndex = notes.findIndex(
          (note) => note.content === originalContent
        );
        if (noteIndex !== -1) {
          notes[noteIndex].completed = true;
          common_vendor.index.setStorageSync("notes", notes);
        }
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(addTodo),
        b: loading.value
      }, loading.value ? {} : common_vendor.e({
        c: todos.value.length === 0
      }, todos.value.length === 0 ? {} : {
        d: common_vendor.f(todos.value, (todo, index, i0) => {
          return {
            a: todo.completed,
            b: common_vendor.o(($event) => toggleTodo(index), index),
            c: todo.completed,
            d: common_vendor.t(todo.text),
            e: todo.completed ? 1 : "",
            f: index
          };
        })
      }));
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-95de4f4e"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/home/TodoList.js.map
