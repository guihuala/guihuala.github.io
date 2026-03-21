<template>
  <section class="mole-card">
    <header class="mole-header">
      <h3>打地鼠</h3>
      <div class="stats">
        <span>分数 {{ score }}</span>
        <span>倒计时 {{ timeLeft }}s</span>
        <span>最高 {{ bestScore }}</span>
      </div>
    </header>

    <div class="holes">
      <button
        v-for="(_, index) in holes"
        :key="index"
        type="button"
        class="hole"
        :class="{ active: activeHole === index }"
        @click="hitMole(index)"
      >
        <span class="mole">🦔</span>
      </button>
    </div>

    <p class="status">{{ statusText }}</p>
    <button type="button" class="action" @click="startGame">
      {{ isRunning ? "重新开局" : "开始游戏" }}
    </button>
  </section>
</template>

<script>
export default {
  data() {
    return {
      holes: Array(12).fill(false),
      activeHole: -1,
      score: 0,
      bestScore: 0,
      timeLeft: 30,
      isRunning: false,
      roundTimer: null,
      spawnTimer: null,
      statusText: "点击开始，30 秒内尽可能多击中地鼠。",
    };
  },
  mounted() {
    this.bestScore = Number(localStorage.getItem("whack-best-score") || 0);
  },
  beforeUnmount() {
    this.stopGame(false);
  },
  methods: {
    startGame() {
      this.stopGame(false);
      this.score = 0;
      this.timeLeft = 30;
      this.activeHole = -1;
      this.isRunning = true;
      this.statusText = "游戏进行中，加油！";

      this.roundTimer = setInterval(() => {
        this.timeLeft -= 1;
        if (this.timeLeft <= 0) this.stopGame(true);
      }, 1000);

      this.spawnMole();
      this.spawnTimer = setInterval(this.spawnMole, 620);
    },
    stopGame(announce = true) {
      clearInterval(this.roundTimer);
      clearInterval(this.spawnTimer);
      this.roundTimer = null;
      this.spawnTimer = null;
      this.activeHole = -1;

      if (!this.isRunning) return;
      this.isRunning = false;
      this.bestScore = Math.max(this.bestScore, this.score);
      localStorage.setItem("whack-best-score", String(this.bestScore));
      if (announce) this.statusText = `游戏结束，本局得分 ${this.score}。`;
    },
    spawnMole() {
      const previous = this.activeHole;
      let next = Math.floor(Math.random() * this.holes.length);
      if (next === previous) next = (next + 1) % this.holes.length;
      this.activeHole = next;
    },
    hitMole(index) {
      if (!this.isRunning || this.activeHole !== index) return;
      this.score += 1;
      this.activeHole = -1;
      setTimeout(() => {
        if (this.isRunning && this.activeHole === -1) this.spawnMole();
      }, 90);
    },
  },
};
</script>

<style scoped>
.mole-card {
  width: min(520px, 100%);
  margin: 1rem auto;
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid rgba(0, 188, 212, 0.24);
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 12px 26px rgba(2, 132, 199, 0.14);
}

.mole-header h3 {
  margin: 0;
  color: #02738a;
}

.stats {
  margin-top: 0.55rem;
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

.holes {
  margin-top: 0.8rem;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.65rem;
}

.hole {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border: none;
  border-radius: 50%;
  background: radial-gradient(circle at 45% 35%, #1d9aa9 0%, #02738a 78%);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.12s ease;
}

.hole:hover {
  transform: translateY(-1px);
}

.mole {
  position: absolute;
  left: 50%;
  bottom: -50%;
  transform: translateX(-50%);
  font-size: 2rem;
  opacity: 0;
  transition: bottom 0.15s ease, opacity 0.15s ease;
}

.hole.active .mole {
  bottom: 14%;
  opacity: 1;
}

.status {
  min-height: 1.4rem;
  margin: 0.8rem 0 0;
  color: #03618f;
  font-weight: 700;
}

.action {
  margin-top: 0.4rem;
  width: 100%;
  border: none;
  border-radius: 999px;
  background: #ffd54f;
  color: #035f78;
  height: 2.6rem;
  font-weight: 900;
  cursor: pointer;
}

.action:hover {
  background: #ffe082;
}
</style>
