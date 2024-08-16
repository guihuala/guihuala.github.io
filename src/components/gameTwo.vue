<template>
  <div class="whack-a-mole">
    <div v-for="(hole, index) in holes" :key="index" class="hole" @click="hitMole(index)">
      <div class="mole" v-if="hole"></div>
    </div>
    <p>分数: {{ score }}</p>
    <button @click="startGame">开始</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      holes: Array(10).fill(false),
      score: 0,
      gameInterval: null
    };
  },
  methods: {
    startGame() {
      this.score = 0;
      this.holes = Array(10).fill(false);
      this.gameInterval = setInterval(this.randomMole, 1000);
      setTimeout(() => {
        clearInterval(this.gameInterval);
        alert('游戏结束！');
      }, 30000); // 游戏时间30秒
    },
    randomMole() {
      // 重置所有洞
      this.holes = Array(10).fill(false);

      // 随机选择一个洞来放置地鼠
      const randomIndex = Math.floor(Math.random() * 10);
      this.holes[randomIndex] = true;
    },
    hitMole(index) {
      if (this.holes[index]) {
        this.score++;
        this.holes[index] = false;
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.gameInterval);
  }
};
</script>

<style scoped>
.whack-a-mole {
  width: 300px;
  margin: 0 auto;
  text-align: center;
}

.hole {
  width: 60px;
  height: 60px;
  background: #227966;
  margin: 5px;
  border-radius: 50%;
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.mole {
  width: 50px;
  height: 50px;
  background: url(//images.shoutwiki.com/lenen/6/64/Favicon.ico);
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  top: 5px;
  left: 5px;
}

p {
  font-size: 18px;
  font-weight: bold;
}

button {
  border: 0px;
  background: #ffd166;
  height: 3rem;
  margin: 0.5rem 0.5rem;
  padding: 0rem 0.5rem;
  border-radius: 1.5rem;
  font-size: 1rem;
  line-height: 3;
  text-align: center;
}

button:hover {
  background: #ffdf95;
}
</style>
