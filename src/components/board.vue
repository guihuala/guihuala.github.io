<template>
  <section class="tool-card">
    <header class="tool-header">
      <h3>涂鸦板mini</h3>
      <p>支持鼠标和触屏。</p>
    </header>

    <div class="canvas-wrap">
      <canvas
        ref="canvas"
        :width="canvasWidth"
        :height="canvasHeight"
        @pointerdown="startDrawing"
        @pointermove="draw"
        @pointerup="stopDrawing"
        @pointerleave="stopDrawing"
      ></canvas>
    </div>

    <div class="controls">
      <label class="control-item color-picker">
        <span>颜色</span>
        <div class="picker-row">
          <div class="color-well" :style="{ '--active': color }">
            <input type="color" v-model="color" />
            <em>{{ color }}</em>
          </div>
          <div class="swatches">
            <button type="button" class="swatch" style="--sw:#00bcd4" @click="color = '#00bcd4'"></button>
            <button type="button" class="swatch" style="--sw:#0284c7" @click="color = '#0284c7'"></button>
            <button type="button" class="swatch" style="--sw:#ffd54f" @click="color = '#ffd54f'"></button>
            <button type="button" class="swatch" style="--sw:#ff8f00" @click="color = '#ff8f00'"></button>
            <button type="button" class="swatch" style="--sw:#222222" @click="color = '#222222'"></button>
          </div>
        </div>
      </label>
      <label class="control-item range-item">
        <span>线宽 {{ lineWidth }} px</span>
        <input
          type="range"
          min="1"
          max="24"
          v-model.number="lineWidth"
          :style="{ '--progress': `${((lineWidth - 1) / 23) * 100}%` }"
        />
      </label>
      <button type="button" class="action-btn" @click="undo">撤销</button>
      <button type="button" class="action-btn ghost" @click="clearCanvas">清空</button>
      <button type="button" class="action-btn primary" @click="saveCanvas">保存 PNG</button>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      drawing: false,
      color: "#00bcd4",
      lineWidth: 4,
      canvasWidth: 720,
      canvasHeight: 420,
      history: [],
    };
  },
  mounted() {
    this.updateCanvasSize();
    window.addEventListener("resize", this.updateCanvasSize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateCanvasSize);
  },
  methods: {
    getContext() {
      const canvas = this.$refs.canvas;
      return canvas ? canvas.getContext("2d") : null;
    },
    getPointerPosition(event) {
      const canvas = this.$refs.canvas;
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * canvas.width,
        y: ((event.clientY - rect.top) / rect.height) * canvas.height,
      };
    },
    startDrawing(event) {
      const ctx = this.getContext();
      if (!ctx) return;

      this.history.push(this.$refs.canvas.toDataURL("image/png"));
      if (this.history.length > 30) this.history.shift();

      const point = this.getPointerPosition(event);
      this.drawing = true;
      this.$refs.canvas.setPointerCapture?.(event.pointerId);

      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.lineWidth;
    },
    draw(event) {
      if (!this.drawing) return;
      const ctx = this.getContext();
      if (!ctx) return;

      const point = this.getPointerPosition(event);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.lineWidth;
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    },
    stopDrawing(event) {
      if (!this.drawing) return;
      this.drawing = false;
      this.$refs.canvas.releasePointerCapture?.(event?.pointerId);
    },
    async undo() {
      const last = this.history.pop();
      const ctx = this.getContext();
      if (!ctx) return;

      if (!last) {
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        return;
      }

      await this.restoreFromDataURL(last);
    },
    clearCanvas() {
      const ctx = this.getContext();
      if (!ctx) return;
      this.history.push(this.$refs.canvas.toDataURL("image/png"));
      if (this.history.length > 30) this.history.shift();
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    },
    saveCanvas() {
      const link = document.createElement("a");
      link.href = this.$refs.canvas.toDataURL("image/png");
      link.download = `board-${Date.now()}.png`;
      link.click();
    },
    async restoreFromDataURL(dataURL) {
      const ctx = this.getContext();
      if (!ctx) return;

      await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
          ctx.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
          resolve();
        };
        img.src = dataURL;
      });
    },
    async updateCanvasSize() {
      const wrap = this.$el.querySelector(".canvas-wrap");
      if (!wrap) return;
      const snapshot = this.$refs.canvas?.toDataURL("image/png");
      const width = Math.min(900, wrap.clientWidth);
      this.canvasWidth = width;
      this.canvasHeight = Math.floor(width * 0.58);
      this.$nextTick(async () => {
        if (snapshot) await this.restoreFromDataURL(snapshot);
      });
    },
  },
};
</script>

<style scoped>
.tool-card {
  width: min(920px, 100%);
  margin: 1.1rem auto;
  border: 1px solid rgba(0, 188, 212, 0.2);
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(247, 253, 255, 0.86) 100%);
  box-shadow: 0 16px 30px rgba(2, 132, 199, 0.16);
  padding: 1.15rem;
}

.tool-header h3 {
  margin: 0;
  color: #02738a;
  font-size: 1.15rem;
}

.tool-header p {
  margin: 0.35rem 0 1rem;
  color: #03618f;
  opacity: 0.78;
}

.canvas-wrap {
  border: 1px solid rgba(0, 188, 212, 0.24);
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #fbfeff 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.7);
}

canvas {
  display: block;
  width: 100%;
  height: auto;
  cursor: crosshair;
  touch-action: none;
}

.controls {
  margin-top: 0.95rem;
  display: grid;
  grid-template-columns: 1.3fr 1fr repeat(3, minmax(100px, auto));
  gap: 0.65rem;
  align-items: end;
  padding: 0.75rem;
  border-radius: 14px;
  background: rgba(224, 247, 250, 0.55);
  border: 1px solid rgba(0, 188, 212, 0.16);
}

.control-item {
  display: grid;
  gap: 0.45rem;
  font-weight: 700;
  color: #03618f;
  font-size: 0.9rem;
}

.range-item input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    #00bcd4 0,
    #00bcd4 var(--progress),
    rgba(2, 132, 199, 0.2) var(--progress),
    rgba(2, 132, 199, 0.2) 100%
  );
  outline: none;
}

.range-item input[type="range"]::-webkit-slider-runnable-track {
  height: 12px;
  border-radius: 999px;
  background: transparent;
}

.range-item input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-top: -8px;
  background: linear-gradient(135deg, #00bcd4 0%, #26cfe3 100%);
  box-shadow: 0 6px 14px rgba(0, 188, 212, 0.35);
}

.range-item input[type="range"]::-moz-range-track {
  height: 12px;
  border-radius: 999px;
  background: rgba(2, 132, 199, 0.2);
}

.range-item input[type="range"]::-moz-range-progress {
  height: 12px;
  border-radius: 999px;
  background: #00bcd4;
}

.range-item input[type="range"]::-moz-range-thumb {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: linear-gradient(135deg, #00bcd4 0%, #26cfe3 100%);
  box-shadow: 0 6px 14px rgba(0, 188, 212, 0.35);
}

.picker-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.swatches {
  display: flex;
  gap: 0.28rem;
}

.color-well {
  --active: #00bcd4;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 132px;
  padding: 0.24rem 0.56rem 0.24rem 0.28rem;
  border-radius: 999px;
  border: 1px solid rgba(0, 188, 212, 0.35);
  background: #fff;
}

.color-well em {
  font-style: normal;
  font-size: 0.78rem;
  font-weight: 700;
  color: #02738a;
  letter-spacing: 0.02em;
}

.color-well input[type="color"] {
  width: 32px;
  min-width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  padding: 0;
  background: transparent;
  cursor: pointer;
  box-shadow: 0 0 0 1px rgba(2, 132, 199, 0.25);
}

.color-well input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-well input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 50%;
}

.color-well input[type="color"]::-moz-color-swatch {
  border: none;
  border-radius: 50%;
}

.swatch {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 0 1px rgba(2, 132, 199, 0.25);
  background: var(--sw);
  padding: 0;
}

.action-btn {
  height: 2.6rem;
  border: 1px solid rgba(0, 188, 212, 0.22);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  color: #03618f;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
}

.action-btn:hover {
  box-shadow: 0 8px 14px rgba(2, 132, 199, 0.16);
  transform: translateY(-1px);
}

.action-btn.ghost {
  background: rgba(255, 249, 196, 0.78);
  border-color: rgba(255, 213, 79, 0.35);
}

.action-btn.primary {
  background: linear-gradient(135deg, #00bcd4 0%, #22c8de 100%);
  border-color: transparent;
  color: #fff;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #09b1c8 0%, #1abbd0 100%);
}

@media (max-width: 860px) {
  .controls {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 520px) {
  .tool-card {
    padding: 0.9rem;
    border-radius: 16px;
  }

  .controls {
    padding: 0.6rem;
    grid-template-columns: 1fr;
  }

  .action-btn {
    width: 100%;
  }

  .swatches {
    flex-wrap: wrap;
  }
}

.swatch:hover {
  transform: translateY(-1px);
}

.swatch:focus-visible {
  outline: 2px solid rgba(0, 188, 212, 0.55);
}

.action-btn:focus-visible {
  outline: 2px solid rgba(0, 188, 212, 0.5);
}

.action-btn.ghost:hover {
  background: #ffe082;
}

</style>
