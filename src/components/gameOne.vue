<template>
  <section class="game-card">
    <header class="game-header">
      <h3>2048 Mini</h3>
      <div class="stats">
        <span>分数 {{ score }}</span>
        <span>最高 {{ bestScore }}</span>
      </div>
    </header>

    <div
      ref="board"
      class="board"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="row">
        <div v-for="(cell, cellIndex) in row" :key="`${rowIndex}-${cellIndex}`" class="cell" :class="tileClass(cell)">
          {{ cell || "" }}
        </div>
      </div>
    </div>

    <p class="tip">方向键或滑动操作。</p>
    <p v-if="won" class="status status-win">你已经合成 2048！</p>
    <p v-if="gameOver" class="status status-lose">没有可移动格子了，来一局新的吧。</p>

    <button type="button" class="reset" @click="resetGame">重新开始</button>
  </section>
</template>

<script>
const SIZE = 4;

const createGrid = () => Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

export default {
  data() {
    return {
      grid: createGrid(),
      score: 0,
      bestScore: 0,
      won: false,
      gameOver: false,
      touchStartX: 0,
      touchStartY: 0,
    };
  },
  mounted() {
    this.bestScore = Number(localStorage.getItem("game-2048-best") || 0);
    this.resetGame();
    window.addEventListener("keydown", this.handleKeydown);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeydown);
  },
  methods: {
    resetGame() {
      this.grid = createGrid();
      this.score = 0;
      this.won = false;
      this.gameOver = false;
      this.addNumber();
      this.addNumber();
    },
    onTouchStart(event) {
      const touch = event.changedTouches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    },
    onTouchEnd(event) {
      const touch = event.changedTouches[0];
      const dx = touch.clientX - this.touchStartX;
      const dy = touch.clientY - this.touchStartY;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      if (Math.abs(dx) > Math.abs(dy)) this.move(dx > 0 ? "right" : "left");
      else this.move(dy > 0 ? "down" : "up");
    },
    handleKeydown(event) {
      if (this.gameOver) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }

      const actionMap = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      const direction = actionMap[event.key];
      if (!direction) return;
      event.preventDefault();
      this.move(direction);
    },
    addNumber() {
      const empties = [];
      for (let row = 0; row < SIZE; row += 1) {
        for (let col = 0; col < SIZE; col += 1) {
          if (this.grid[row][col] === 0) empties.push([row, col]);
        }
      }
      if (!empties.length) return;
      const [row, col] = empties[Math.floor(Math.random() * empties.length)];
      this.grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    },
    processLine(line) {
      const numbers = line.filter((value) => value !== 0);
      let gained = 0;

      for (let i = 0; i < numbers.length - 1; i += 1) {
        if (numbers[i] !== 0 && numbers[i] === numbers[i + 1]) {
          numbers[i] *= 2;
          numbers[i + 1] = 0;
          gained += numbers[i];
        }
      }

      const packed = numbers.filter((value) => value !== 0);
      while (packed.length < SIZE) packed.push(0);
      return { line: packed, gained };
    },
    move(direction) {
      if (this.gameOver) return;
      let moved = false;
      let gainedScore = 0;
      const nextGrid = createGrid();

      for (let index = 0; index < SIZE; index += 1) {
        const source = [];
        for (let offset = 0; offset < SIZE; offset += 1) {
          if (direction === "left") source.push(this.grid[index][offset]);
          if (direction === "right") source.push(this.grid[index][SIZE - 1 - offset]);
          if (direction === "up") source.push(this.grid[offset][index]);
          if (direction === "down") source.push(this.grid[SIZE - 1 - offset][index]);
        }

        const { line, gained } = this.processLine(source);
        gainedScore += gained;

        for (let offset = 0; offset < SIZE; offset += 1) {
          const value = line[offset];
          let row = 0;
          let col = 0;
          if (direction === "left") {
            row = index;
            col = offset;
          }
          if (direction === "right") {
            row = index;
            col = SIZE - 1 - offset;
          }
          if (direction === "up") {
            row = offset;
            col = index;
          }
          if (direction === "down") {
            row = SIZE - 1 - offset;
            col = index;
          }
          nextGrid[row][col] = value;
        }
      }

      for (let row = 0; row < SIZE; row += 1) {
        for (let col = 0; col < SIZE; col += 1) {
          if (nextGrid[row][col] !== this.grid[row][col]) moved = true;
        }
      }
      if (!moved) return;

      this.grid = nextGrid;
      this.score += gainedScore;
      this.bestScore = Math.max(this.bestScore, this.score);
      localStorage.setItem("game-2048-best", String(this.bestScore));

      this.addNumber();
      this.won = this.won || this.grid.some((row) => row.some((cell) => cell >= 2048));
      this.gameOver = !this.canMove();
    },
    canMove() {
      for (let row = 0; row < SIZE; row += 1) {
        for (let col = 0; col < SIZE; col += 1) {
          const cell = this.grid[row][col];
          if (cell === 0) return true;
          if (col < SIZE - 1 && cell === this.grid[row][col + 1]) return true;
          if (row < SIZE - 1 && cell === this.grid[row + 1][col]) return true;
        }
      }
      return false;
    },
    tileClass(value) {
      if (!value) return "tile-0";
      if (value <= 4) return `tile-${value}`;
      if (value <= 16) return "tile-16";
      if (value <= 64) return "tile-64";
      if (value <= 256) return "tile-256";
      if (value <= 1024) return "tile-1024";
      return "tile-2048";
    },
  },
};
</script>

<style scoped>
.game-card {
  width: min(360px, 100%);
  margin: 1rem auto;
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid rgba(0, 188, 212, 0.24);
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 12px 26px rgba(2, 132, 199, 0.14);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
}

.game-header h3 {
  margin: 0;
  color: #02738a;
}

.stats {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.stats span {
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: #fff9c4;
  color: #03618f;
  font-weight: 800;
  font-size: 0.82rem;
}

.board {
  padding: 0.45rem;
  border-radius: 12px;
  background: rgba(0, 188, 212, 0.12);
}

.row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.45rem;
  margin-bottom: 0.45rem;
}

.row:last-child {
  margin-bottom: 0;
}

.cell {
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-weight: 900;
  color: #035f78;
  transition: transform 0.18s ease;
}

.tile-0 {
  background: rgba(255, 255, 255, 0.7);
  color: transparent;
}
.tile-2 {
  background: #e0f7fa;
}
.tile-4 {
  background: #d1f5fb;
}
.tile-16 {
  background: #fff9c4;
}
.tile-64 {
  background: #ffe082;
}
.tile-256 {
  background: #ffd54f;
}
.tile-1024 {
  background: #ffca28;
}
.tile-2048 {
  background: #00bcd4;
  color: #fff;
}

.tip {
  margin: 0.7rem 0 0;
  font-size: 0.88rem;
  color: #03618f;
}

.status {
  margin: 0.45rem 0 0;
  font-weight: 700;
}

.status-win {
  color: #02738a;
}

.status-lose {
  color: #c57947;
}

.reset {
  margin-top: 0.8rem;
  width: 100%;
  border: none;
  border-radius: 999px;
  background: #ffd54f;
  color: #035f78;
  height: 2.6rem;
  font-weight: 900;
  cursor: pointer;
}

.reset:hover {
  background: #ffe082;
}
</style>
