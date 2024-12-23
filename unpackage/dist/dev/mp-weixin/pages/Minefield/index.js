"use strict";
const common_vendor = require("../../common/vendor.js");
const BOARD_SIZE = 9;
const MINES_COUNT = 10;
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const board = common_vendor.ref([]);
    const gameOver = common_vendor.ref(false);
    const remainingMines = common_vendor.ref(MINES_COUNT);
    const time = common_vendor.ref(0);
    let timer;
    const isGameStarted = common_vendor.ref(false);
    const isPaused = common_vendor.ref(false);
    const initGame = () => {
      board.value = Array(BOARD_SIZE).fill().map(
        () => Array(BOARD_SIZE).fill().map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0
        }))
      );
      let minesPlaced = 0;
      while (minesPlaced < MINES_COUNT) {
        const x = Math.floor(Math.random() * BOARD_SIZE);
        const y = Math.floor(Math.random() * BOARD_SIZE);
        if (!board.value[x][y].isMine) {
          board.value[x][y].isMine = true;
          minesPlaced++;
        }
      }
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          if (!board.value[i][j].isMine) {
            board.value[i][j].neighborMines = countNeighborMines(i, j);
          }
        }
      }
      gameOver.value = false;
      remainingMines.value = MINES_COUNT;
      time.value = 0;
      isPaused.value = false;
      gameOver.value = false;
      remainingMines.value = MINES_COUNT;
      time.value = 0;
      isPaused.value = false;
      startTimer();
    };
    const countNeighborMines = (x, y) => {
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newX = x + i;
          const newY = y + j;
          if (newX >= 0 && newX < BOARD_SIZE && newY >= 0 && newY < BOARD_SIZE && board.value[newX][newY].isMine) {
            count++;
          }
        }
      }
      return count;
    };
    const revealCell = (x, y) => {
      if (gameOver.value || board.value[x][y].isFlagged)
        return;
      const cell = board.value[x][y];
      if (cell.isRevealed)
        return;
      cell.isRevealed = true;
      if (cell.isMine) {
        gameOver.value = true;
        common_vendor.index.showModal({
          title: "提示",
          content: "游戏结束!",
          showCancel: false
        });
        return;
      }
      if (cell.neighborMines === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newX = x + i;
            const newY = y + j;
            if (newX >= 0 && newX < BOARD_SIZE && newY >= 0 && newY < BOARD_SIZE) {
              revealCell(newX, newY);
            }
          }
        }
      }
    };
    const flagCell = (x, y) => {
      if (gameOver.value || board.value[x][y].isRevealed)
        return;
      const cell = board.value[x][y];
      cell.isFlagged = !cell.isFlagged;
      remainingMines.value += cell.isFlagged ? -1 : 1;
    };
    const getCellContent = (cell) => {
      if (cell.isFlagged)
        return "🚩";
      if (!cell.isRevealed)
        return "";
      if (cell.isMine)
        return "💣";
      return cell.neighborMines || "";
    };
    const getCellClass = (cell) => {
      return {
        revealed: cell.isRevealed,
        mine: cell.isRevealed && cell.isMine
      };
    };
    const startGame = () => {
      isGameStarted.value = true;
      initGame();
      startTimer();
    };
    const startTimer = () => {
      if (timer)
        clearInterval(timer);
      timer = setInterval(() => {
        if (!gameOver.value && !isPaused.value) {
          time.value++;
        }
      }, 1e3);
    };
    common_vendor.onHide(() => {
      isPaused.value = true;
    });
    common_vendor.onShow(() => {
      if (isGameStarted.value && !gameOver.value) {
        isPaused.value = false;
      }
    });
    common_vendor.onUnmounted(() => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    });
    common_vendor.onMounted(() => {
      board.value = Array(BOARD_SIZE).fill().map(
        () => Array(BOARD_SIZE).fill().map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0
        }))
      );
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !isGameStarted.value
      }, !isGameStarted.value ? {
        b: common_vendor.o(startGame)
      } : {
        c: common_vendor.t(remainingMines.value),
        d: common_vendor.t(time.value),
        e: common_vendor.f(board.value, (row, i, i0) => {
          return {
            a: common_vendor.f(row, (cell, j, i1) => {
              return {
                a: common_vendor.t(getCellContent(cell)),
                b: `${i}-${j}`,
                c: common_vendor.n(getCellClass(cell)),
                d: common_vendor.o(($event) => revealCell(i, j), `${i}-${j}`),
                e: common_vendor.o(($event) => flagCell(i, j), `${i}-${j}`)
              };
            }),
            b: i
          };
        }),
        f: common_vendor.o(initGame)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e3aee4bb"]]);
wx.createPage(MiniProgramPage);
