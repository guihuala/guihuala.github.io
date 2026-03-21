<template>
  <section class="timer-card">
    <h3>{{ title }}</h3>
    <p v-if="isInvalidDate" class="error">目标时间格式无效。</p>
    <div v-else class="segments">
      <div class="segment">
        <strong>{{ segments.days }}</strong>
        <span>天</span>
      </div>
      <div class="segment">
        <strong>{{ segments.hours }}</strong>
        <span>小时</span>
      </div>
      <div class="segment">
        <strong>{{ segments.minutes }}</strong>
        <span>分钟</span>
      </div>
      <div class="segment">
        <strong>{{ segments.seconds }}</strong>
        <span>秒</span>
      </div>
    </div>
    <p class="note">{{ finished ? "活动已开始或已结束。" : "倒计时进行中。" }}</p>
  </section>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "距离下一个 CP 还有",
    },
    targetDate: {
      type: String,
      default: "2026-10-03T00:00:00+08:00",
    },
  },
  data() {
    return {
      now: Date.now(),
      timer: null,
    };
  },
  computed: {
    targetTimestamp() {
      return new Date(this.targetDate).getTime();
    },
    isInvalidDate() {
      return Number.isNaN(this.targetTimestamp);
    },
    diff() {
      if (this.isInvalidDate) return 0;
      return Math.max(0, this.targetTimestamp - this.now);
    },
    finished() {
      return this.diff <= 0;
    },
    segments() {
      const total = Math.floor(this.diff / 1000);
      const days = Math.floor(total / 86400);
      const hours = Math.floor((total % 86400) / 3600);
      const minutes = Math.floor((total % 3600) / 60);
      const seconds = total % 60;
      return { days, hours, minutes, seconds };
    },
  },
  mounted() {
    this.timer = setInterval(() => {
      this.now = Date.now();
    }, 1000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped>
.timer-card {
  width: min(640px, 100%);
  margin: 1rem auto;
  border-radius: 16px;
  border: 1px solid rgba(0, 188, 212, 0.24);
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 12px 26px rgba(2, 132, 199, 0.14);
  padding: 1rem;
  text-align: center;
}

h3 {
  margin: 0 0 0.8rem;
  color: #02738a;
}

.segments {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.65rem;
}

.segment {
  border-radius: 12px;
  padding: 0.75rem 0.4rem;
  background: linear-gradient(135deg, #e0f7fa 0%, #fff9c4 100%);
}

.segment strong {
  display: block;
  font-size: 1.5rem;
  line-height: 1.1;
  color: #035f78;
}

.segment span {
  font-size: 0.85rem;
  color: #03618f;
}

.note,
.error {
  margin: 0.75rem 0 0;
  color: #03618f;
  font-weight: 700;
}

.error {
  color: #c57947;
}

@media (max-width: 640px) {
  .segments {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
