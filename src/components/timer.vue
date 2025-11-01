<template>
    <div class="text-container">
        <h1>距离cp30还有: {{ timeLeft }}</h1>
    </div>
</template>

<script>
export default {
    data() {
        return {
            timeLeft: '',
        };
    },
    mounted() {
        this.startCountdown(new Date('2024-10-03'));
    },
    methods: {
        startCountdown(targetDate) {
            const interval = setInterval(() => {
                const now = new Date();
                const distance = targetDate - now;

                if (distance < 0) {
                    clearInterval(interval);
                    this.timeLeft = '终于到了这个时候！';
                } else {
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    this.timeLeft = `${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`;
                }
            }, 1000);
        }
    }
};
</script>

<style>
.text-container {
    width: 100%;
    display: flex;
    text-align: center;
    justify-content: center;
}
</style>