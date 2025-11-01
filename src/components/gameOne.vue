<template>
    <div class="game-2048">
        <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="row">
            <div v-for="(cell, cellIndex) in row" :key="cellIndex" class="cell">
                {{ cell || '' }}
            </div>
        </div>
        <button @click="resetGame">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor"
                    d="M18.258 3.508a.75.75 0 0 1 .463.693v4.243a.75.75 0 0 1-.75.75h-4.243a.75.75 0 0 1-.53-1.28L14.8 6.31a7.25 7.25 0 1 0 4.393 5.783a.75.75 0 0 1 1.488-.187A8.75 8.75 0 1 1 15.93 5.18l1.51-1.51a.75.75 0 0 1 .817-.162" />
            </svg>
        </button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            grid: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        };
    },
    methods: {
        resetGame() {
            this.grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
            this.addNumber();
            this.addNumber();
        },
        addNumber() {
            let emptyCells = [];
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (this.grid[i][j] === 0) {
                        emptyCells.push({ x: i, y: j });
                    }
                }
            }
            if (emptyCells.length > 0) {
                const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                this.grid[cell.x][cell.y] = Math.random() < 0.9 ? 2 : 4;
            }
        },
        handleKeydown(event) {
            switch (event.key) {
                case 'ArrowUp':
                    this.moveUp();
                    break;
                case 'ArrowDown':
                    this.moveDown();
                    break;
                case 'ArrowLeft':
                    this.moveLeft();
                    break;
                case 'ArrowRight':
                    this.moveRight();
                    break;
            }
        },
        moveUp() {
            for (let col = 0; col < 4; col++) {
                let newRow = [0, 0, 0, 0];
                let fillPosition = 0;
    
                for (let row = 0; row < 4; row++) {
                    if (this.grid[row][col] !== 0) {
                        if (newRow[fillPosition] === 0) {
                            newRow[fillPosition] = this.grid[row][col];
                        } else if (newRow[fillPosition] === this.grid[row][col]) {
                            newRow[fillPosition] *= 2;
                            fillPosition++;
                        } else {
                            fillPosition++;
                            newRow[fillPosition] = this.grid[row][col];
                        }
                    }
                }
    
                for (let row = 0; row < 4; row++) {
                    this.grid[row][col] = newRow[row];
                }
            }
            this.addNumber(); // 添加新的数字
        },
        moveDown() {
            for (let col = 0; col < 4; col++) {
                let newRow = [0, 0, 0, 0];
                let fillPosition = 3;
    
                for (let row = 3; row >= 0; row--) {
                    if (this.grid[row][col] !== 0) {
                        if (newRow[fillPosition] === 0) {
                            newRow[fillPosition] = this.grid[row][col];
                        } else if (newRow[fillPosition] === this.grid[row][col]) {
                            newRow[fillPosition] *= 2;
                            fillPosition--;
                        } else {
                            fillPosition--;
                            newRow[fillPosition] = this.grid[row][col];
                        }
                    }
                }
    
                for (let row = 0; row < 4; row++) {
                    this.grid[row][col] = newRow[row];
                }
            }
            this.addNumber(); // 添加新的数字
        },
        moveLeft() {
            for (let row = 0; row < 4; row++) {
                let newRow = [0, 0, 0, 0];
                let fillPosition = 0;
    
                for (let col = 0; col < 4; col++) {
                    if (this.grid[row][col] !== 0) {
                        if (newRow[fillPosition] === 0) {
                            newRow[fillPosition] = this.grid[row][col];
                        } else if (newRow[fillPosition] === this.grid[row][col]) {
                            newRow[fillPosition] *= 2;
                            fillPosition++;
                        } else {
                            fillPosition++;
                            newRow[fillPosition] = this.grid[row][col];
                        }
                    }
                }
    
                for (let col = 0; col < 4; col++) {
                    this.grid[row][col] = newRow[col];
                }
            }
            this.addNumber(); // 添加新的数字
        },
        moveRight() {
            for (let row = 0; row < 4; row++) {
                let newRow = [0, 0, 0, 0];
                let fillPosition = 3;
    
                for (let col = 3; col >= 0; col--) {
                    if (this.grid[row][col] !== 0) {
                        if (newRow[fillPosition] === 0) {
                            newRow[fillPosition] = this.grid[row][col];
                        } else if (newRow[fillPosition] === this.grid[row][col]) {
                            newRow[fillPosition] *= 2;
                            fillPosition--;
                        } else {
                            fillPosition--;
                            newRow[fillPosition] = this.grid[row][col];
                        }
                    }
                }
    
                for (let col = 0; col < 4; col++) {
                    this.grid[row][col] = newRow[col];
                }
            }
            this.addNumber(); // 添加新的数字
        }
    },
    mounted() {
        this.resetGame();
        window.addEventListener('keydown', this.handleKeydown);
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.handleKeydown);
    }
};
</script>

<style scoped>
.game-2048 {
    width: 260px;
    margin: 0 auto;
    text-align: center;
}

.row {
    display: flex;
}

.cell {
    width: 60px;
    height: 60px;
    margin: 5px;
    line-height: 60px;
    font-size: 24px;
    background: #ffd166;
    text-align: center;
    border-radius: 10px;
}


button {
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

button:hover {
    background: #ffdf95;
}
</style>
