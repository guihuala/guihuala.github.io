<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";

const props = withDefaults(
  defineProps<{
    src: string;
    title?: string;
    artist?: string;
  }>(),
  {
    title: "本地音乐",
    artist: "",
  },
);

const audio = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(0.8);
const errorMessage = ref("");

const progress = computed(() =>
  duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0,
);

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
};

const togglePlayback = async (): Promise<void> => {
  if (!audio.value) return;
  errorMessage.value = "";

  try {
    if (audio.value.paused) await audio.value.play();
    else audio.value.pause();
  } catch {
    errorMessage.value = "无法播放此音频，请检查文件路径或格式。";
  }
};

const seek = (event: Event): void => {
  if (!audio.value || duration.value <= 0) return;
  const value = Number((event.target as HTMLInputElement).value);
  audio.value.currentTime = (value / 100) * duration.value;
};

const changeVolume = (event: Event): void => {
  const value = Number((event.target as HTMLInputElement).value);
  volume.value = value;
  if (audio.value) audio.value.volume = value;
};

const handleLoadedMetadata = (): void => {
  if (!audio.value) return;
  duration.value = audio.value.duration;
  audio.value.volume = volume.value;
};

onBeforeUnmount(() => audio.value?.pause());
</script>

<template>
  <div class="music-player">
    <audio
      ref="audio"
      :src="props.src"
      preload="metadata"
      @loadedmetadata="handleLoadedMetadata"
      @timeupdate="currentTime = audio?.currentTime ?? 0"
      @play="isPlaying = true"
      @pause="isPlaying = false"
      @ended="isPlaying = false"
      @error="errorMessage = '音频加载失败，请检查文件路径。'"
    />

    <button
      class="music-player__play"
      type="button"
      :aria-label="isPlaying ? '暂停' : '播放'"
      @click="togglePlayback"
    >
      <span aria-hidden="true">{{ isPlaying ? "❚❚" : "▶" }}</span>
    </button>

    <div class="music-player__main">
      <div class="music-player__meta">
        <span class="music-player__eyebrow">NOW PLAYING</span>
        <div class="music-player__title-row">
          <strong>{{ props.title }}</strong>
          <span v-if="props.artist">{{ props.artist }}</span>
        </div>
      </div>
      <div class="music-player__timeline">
        <span>{{ formatTime(currentTime) }}</span>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          :value="progress"
          aria-label="播放进度"
          @input="seek"
        />
        <span>{{ formatTime(duration) }}</span>
      </div>
      <p v-if="errorMessage" class="music-player__error">{{ errorMessage }}</p>
    </div>

    <label class="music-player__volume">
      <span aria-hidden="true">♫</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        :value="volume"
        aria-label="音量"
        @input="changeVolume"
      />
    </label>
  </div>
</template>

<style scoped>
.music-player {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 1.25rem 0;
  padding: 20px 22px;
  border: 1px solid rgba(0, 188, 212, 0.25);
  border-radius: 20px;
  background:
    radial-gradient(circle at 92% 15%, rgba(255, 213, 79, 0.24), transparent 32%),
    rgba(255, 255, 255, 0.62);
  box-shadow: 0 12px 28px rgba(2, 132, 199, 0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.music-player::after {
  position: absolute;
  right: -28px;
  bottom: -38px;
  width: 120px;
  height: 120px;
  border: 18px solid rgba(0, 188, 212, 0.06);
  border-radius: 50%;
  content: "";
  pointer-events: none;
}

.music-player__play {
  position: relative;
  z-index: 1;
  flex: 0 0 56px;
  width: 56px;
  height: 56px;
  border: 0;
  border-radius: 50%;
  color: #fff;
  font-size: 16px;
  background: linear-gradient(135deg, #00bcd4 0%, #16c4da 100%);
  box-shadow: 0 10px 20px rgba(0, 188, 212, 0.3);
  cursor: pointer;
  transition: transform 0.16s ease, box-shadow 0.16s ease;
}

.music-player__play:hover {
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 12px 24px rgba(0, 188, 212, 0.38);
}

.music-player__main { position: relative; z-index: 1; flex: 1; min-width: 0; }
.music-player__meta { display: flex; flex-direction: column; gap: 3px; }
.music-player__eyebrow { color: #00a9c0; font-size: 10px; font-weight: 900; letter-spacing: 0.16em; }
.music-player__title-row { display: flex; gap: 9px; align-items: baseline; min-width: 0; }
.music-player__title-row strong { overflow: hidden; color: #055b88; font-size: 16px; text-overflow: ellipsis; white-space: nowrap; }
.music-player__title-row span { color: rgba(2, 132, 199, 0.7); font-size: 13px; font-weight: 700; }
.music-player__timeline { display: flex; align-items: center; gap: 10px; margin-top: 11px; }
.music-player__timeline span { min-width: 36px; color: rgba(2, 132, 199, 0.75); font-size: 11px; font-weight: 700; font-variant-numeric: tabular-nums; }
.music-player input[type="range"] { height: 4px; accent-color: #00bcd4; cursor: pointer; }
.music-player__timeline input { width: 100%; }
.music-player__volume {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border: 1px solid rgba(0, 188, 212, 0.25);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  color: #0284c7;
}
.music-player__volume input { width: 64px; }
.music-player__error { margin: 6px 0 0; color: #c2410c; font-size: 0.8rem; }

[data-theme="dark"] .music-player {
  border-color: rgba(158, 231, 241, 0.24);
  background:
    radial-gradient(circle at 92% 15%, rgba(255, 213, 79, 0.12), transparent 32%),
    rgba(15, 34, 46, 0.78);
}
[data-theme="dark"] .music-player__title-row strong { color: #cdeff3; }
[data-theme="dark"] .music-player__title-row span,
[data-theme="dark"] .music-player__timeline span { color: #a9dbe2; }
[data-theme="dark"] .music-player__volume {
  border-color: rgba(158, 231, 241, 0.22);
  background: rgba(11, 25, 34, 0.9);
  color: #9ee7f1;
}

@media (max-width: 600px) {
  .music-player { padding: 16px; gap: 12px; }
  .music-player__play { flex-basis: 48px; width: 48px; height: 48px; }
  .music-player__volume { display: none; }
  .music-player__title-row { flex-direction: column; gap: 0; }
}
</style>
