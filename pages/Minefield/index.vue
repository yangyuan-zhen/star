<template>
  <div class="minefield">
    <!-- 开始界面 -->
    <div v-if="!isGameStarted" class="start-screen">
      <h1 class="game-title">扫雷游戏</h1>
      <button class="start-btn" @click="startGame">开始游戏</button>
    </div>

    <!-- 游戏界面 -->
    <template v-else>
      <div class="game-info">
        <div>剩余地雷: {{ remainingMines }}</div>
        <div>用时: {{ time }}秒</div>
      </div>

      <div class="grid">
        <div v-for="(row, i) in board" :key="i" class="row">
          <div
            v-for="(cell, j) in row"
            :key="`${i}-${j}`"
            class="cell"
            :class="getCellClass(cell)"
            @click="revealCell(i, j)"
            @contextmenu.prevent="flagCell(i, j)"
          >
            {{ getCellContent(cell) }}
          </div>
        </div>
      </div>

      <button class="restart-btn" @click="initGame">重新开始</button>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { onHide, onShow } from "@dcloudio/uni-app";

const BOARD_SIZE = 9;
const MINES_COUNT = 10;

const board = ref([]);
const gameOver = ref(false);
const remainingMines = ref(MINES_COUNT);
const time = ref(0);
let timer;
const isGameStarted = ref(false);
const isPaused = ref(false);

// 初始化游戏
const initGame = () => {
  // 创建空板
  board.value = Array(BOARD_SIZE)
    .fill()
    .map(() =>
      Array(BOARD_SIZE)
        .fill()
        .map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        }))
    );

  // 随机放置地雷
  let minesPlaced = 0;
  while (minesPlaced < MINES_COUNT) {
    const x = Math.floor(Math.random() * BOARD_SIZE);
    const y = Math.floor(Math.random() * BOARD_SIZE);
    if (!board.value[x][y].isMine) {
      board.value[x][y].isMine = true;
      minesPlaced++;
    }
  }

  // 计算每个格子周围的地雷数
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

  // 重置游戏状态
  gameOver.value = false;
  remainingMines.value = MINES_COUNT;
  time.value = 0;
  isPaused.value = false;

  // 重新开始计时器
  startTimer();
};

// 计算周围地雷数
const countNeighborMines = (x, y) => {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newX = x + i;
      const newY = y + j;
      if (
        newX >= 0 &&
        newX < BOARD_SIZE &&
        newY >= 0 &&
        newY < BOARD_SIZE &&
        board.value[newX][newY].isMine
      ) {
        count++;
      }
    }
  }
  return count;
};

// 揭示格子
const revealCell = (x, y) => {
  if (gameOver.value || board.value[x][y].isFlagged) return;

  const cell = board.value[x][y];
  if (cell.isRevealed) return;

  cell.isRevealed = true;

  if (cell.isMine) {
    gameOver.value = true;
    uni.showModal({
      title: "提示",
      content: "游戏结束!",
      showCancel: false,
    });
    return;
  }

  if (cell.neighborMines === 0) {
    // 如果是空格，递归揭示周围的格子
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

// 标记地雷
const flagCell = (x, y) => {
  if (gameOver.value || board.value[x][y].isRevealed) return;

  const cell = board.value[x][y];
  cell.isFlagged = !cell.isFlagged;
  remainingMines.value += cell.isFlagged ? -1 : 1;
};

// 获取格子显示内容
const getCellContent = (cell) => {
  if (cell.isFlagged) return "🚩";
  if (!cell.isRevealed) return "";
  if (cell.isMine) return "💣";
  return cell.neighborMines || "";
};

// 获取格子样式
const getCellClass = (cell) => {
  return {
    revealed: cell.isRevealed,
    mine: cell.isRevealed && cell.isMine,
  };
};

// 添加开始游戏函数
const startGame = () => {
  isGameStarted.value = true;
  initGame();
  startTimer();
};

// 修改计时器逻辑
const startTimer = () => {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (!gameOver.value && !isPaused.value) {
      time.value++;
    }
  }, 1000);
};

// 添加页面切换处理
onHide(() => {
  isPaused.value = true;
});

onShow(() => {
  if (isGameStarted.value && !gameOver.value) {
    isPaused.value = false;
  }
});

// 修改 onUnmounted
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});

// 计时器
onMounted(() => {
  // 移除自动开始游戏
  // 只初始化板子，不开始计时
  board.value = Array(BOARD_SIZE)
    .fill()
    .map(() =>
      Array(BOARD_SIZE)
        .fill()
        .map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        }))
    );
});
</script>

<style scoped>
.minefield {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.game-info {
  margin-bottom: 30px;
  display: flex;
  gap: 40px;
  font-size: 18px;
  color: #2c3e50;
  background: white;
  padding: 15px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.grid {
  background: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.row {
  display: flex;
}

.cell {
  width: 36px;
  height: 36px;
  margin: 2px;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #e2e8f0;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.2s ease;
  color: #2c3e50;
}

.cell:active {
  transform: scale(0.95);
}

.cell.revealed {
  background-color: #fff;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.cell.mine {
  background-color: #fee2e2;
  animation: shake 0.5s ease-in-out;
}

.restart-btn {
  margin-top: 30px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
}

.restart-btn:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 6px 8px rgba(59, 130, 246, 0.3);
}

.restart-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  75% {
    transform: translateX(2px);
  }
}

/* 添加新的样式 */
.start-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  gap: 30px;
}

.game-title {
  font-size: 36px;
  color: #2563eb;
  font-weight: bold;
  text-align: center;
  margin: 0;
  padding: 20px;
  animation: fadeIn 0.8s ease-out;
}

.start-btn {
  padding: 16px 32px;
  font-size: 20px;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
  animation: bounceIn 0.8s ease-out;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.3);
}

.start-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.1);
  }
  80% {
    opacity: 1;
    transform: scale(0.89);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
