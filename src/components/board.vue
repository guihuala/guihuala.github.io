<template>
    <div class="drawing-board">
        <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" @mousedown="startDrawing"
            @mouseup="stopDrawing" @mousemove="draw"></canvas>
        <div class="controls">
            <label>
                <input type="color" v-model="color">
            </label>
            <label>
                线宽:
                <input type="range" min="1" max="10" v-model="lineWidth">
            </label>
            <button class="clear-button" @click="clearCanvas">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
                    <path fill="currentColor"
                        d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0m5.66 14.24l-1.41 1.41L10 11.41l-4.24 4.25l-1.42-1.42L8.59 10L4.34 5.76l1.42-1.42L10 8.59l4.24-4.24l1.41 1.41L11.41 10z" />
                </svg>
            </button>
            <button class="clear-button" @click="saveCanvas">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15">
                    <path fill="currentColor"
                        d="M0 1.5A1.5 1.5 0 0 1 1.5 0h8.586a1.5 1.5 0 0 1 1.06.44l3.415 3.414A1.5 1.5 0 0 1 15 4.914V13.5a1.5 1.5 0 0 1-1.5 1.5H11v-3.5A1.5 1.5 0 0 0 9.5 10h-4A1.5 1.5 0 0 0 4 11.5V15H1.5A1.5 1.5 0 0 1 0 13.5z" />
                    <path fill="currentColor" d="M5 15h5v-3.5a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 0-.5.5z" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            drawing: false,
            color: '#000000',
            lineWidth: 2,
            canvasWidth: 500,  // 默认宽度
            canvasHeight: 300,  // 默认高度
        };
    },
    mounted() {
        this.updateCanvasSize();
        window.addEventListener('resize', this.updateCanvasSize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateCanvasSize);
    },
    methods: {
        startDrawing(event) {
            this.drawing = true;
            const ctx = this.$refs.canvas.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(event.offsetX, event.offsetY);
        },
        draw(event) {
            if (!this.drawing) return;
            const ctx = this.$refs.canvas.getContext('2d');
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.lineWidth;
            ctx.lineCap = 'round';
            ctx.lineTo(event.offsetX, event.offsetY);
            ctx.stroke();
        },
        stopDrawing() {
            this.drawing = false;
        },
        clearCanvas() {
            const ctx = this.$refs.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        },
        saveCanvas() {
            const canvas = this.$refs.canvas;
            const dataURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'drawing.png';  // 保存的文件名
            link.click();
        },
        updateCanvasSize() {//响应式更新
            const containerWidth = this.$el.clientWidth;
            this.canvasWidth = containerWidth;
            this.canvasHeight = containerWidth * (3 / 5);
        }
    }
};
</script>

<style scoped>
.drawing-board {
    box-shadow: 0 0 5px #227966;
    background-color: #ffffff;
    display: inline-block;
    position: relative;
    border-radius: 20px;
    width: 100%;
    /* 让容器宽度为100% */
    max-width: 800px;
    /* 可设置最大宽度 */
    margin: auto;
}

canvas {
    display: block;
    cursor: crosshair;
    width: 100%;
    /* 让画布宽度为100% */
    height: auto;
    /* 让画布高度自动调整 */
}

.controls {
    margin: 10px;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.clear-button {
    border: 0px;
    background: #ffd166;
    height: 3rem;
    width: 3rem;
    margin: 0.5rem 0.5rem;
    border-radius: 1.5rem;
    font-size: 1rem;
    line-height: 3;
    text-align: center;
}

.clear-button:hover{
    background: #ffdf95;
}

/*选色*/
input[type="color"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    width: 40px;
    height: 40px;
    cursor: pointer;
    border-radius: 50%;
    overflow: hidden;
    background-color: transparent;
    box-shadow: 0 0 5px #227966;
}

input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
}

input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 50%;
    padding: 0;
}

input[type="range"] {
    -webkit-appearance: none;
    width: 100px;
    height: 10px;
    background: #ddd;
    border-radius: 5px;
    outline: none;
    padding: 0;
    margin: 0;
}

/* 滑块轨道 */
input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 10px;
    cursor: pointer;
    background: #227966;
    border-radius: 5px;
}

input[type="range"]::-moz-range-track {
    width: 100%;
    height: 10px;
    cursor: pointer;
    background: #227966;
    border-radius: 5px;
}

input[type="range"]::-ms-track {
    width: 100%;
    height: 10px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
}

input[type="range"]::-ms-fill-lower {
    background: #227966;
    border-radius: 5px;
}

input[type="range"]::-ms-fill-upper {
    background: #227966;
    border-radius: 5px;
}

/* 滑块手柄 */
input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: #ffd166;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    margin-top: -5px;
    /* 将手柄垂直居中 */
}

input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #ffd166;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-ms-thumb {
    width: 20px;
    height: 20px;
    background: #ffd166;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
