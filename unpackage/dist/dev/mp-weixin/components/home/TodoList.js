"use strict";
const common_vendor = require("../../common/vendor.js");
const api_search = require("../../api/search.js");
const _sfc_main = {
  __name: "TodoList",
  setup(__props) {
    const todos = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const loadTodos = async () => {
      const notes = common_vendor.index.getStorageSync("notes") || [];
      loading.value = true;
      try {
        const analyzedNotes = await Promise.all(
          notes.map(async (note) => {
            try {
              const analysis = await api_search.analyzeTodoList(note.content);
              const parsedAnalysis = typeof analysis === "string" ? JSON.parse(analysis) : analysis;
              return {
                text: parsedAnalysis.output || note.content,
                completed: false
              };
            } catch (error) {
              common_vendor.index.__f__("error", "at components/home/TodoList.vue:56", "待办事项分析失败:", error);
              return {
                text: note.content,
                completed: false
              };
            }
          })
        );
        todos.value = analyzedNotes;
      } catch (error) {
        common_vendor.index.__f__("error", "at components/home/TodoList.vue:66", "加载待办事项失败:", error);
        todos.value = notes.map((note) => ({
          text: note.content,
          completed: false
        }));
      } finally {
        loading.value = false;
      }
    };
    common_vendor.onShow(() => {
      loadTodos();
    });
    common_vendor.onMounted(() => {
      loadTodos();
    });
    const addTodo = () => {
      common_vendor.index.navigateTo({
        url: "/pages/note/index"
      });
    };
    const toggleTodo = (index) => {
      todos.value[index].completed = !todos.value[index].completed;
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
            c: common_vendor.t(todo.text),
            d: todo.completed ? 1 : "",
            e: index
          };
        })
      }));
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-95de4f4e"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/home/TodoList.js.map
