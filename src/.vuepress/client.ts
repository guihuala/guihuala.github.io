import { defineClientConfig, usePageData } from 'vuepress/client';
import { onMounted, watch } from 'vue';
import MusicPlayer from '../components/MusicPlayer.vue';
import {
  setCustomFooterVisibility,
  setupDesktopEffects,
} from "./utils/desktopEffects.js";

import { setupRunningTimeFooter } from "vuepress-theme-hope/presets/footerRunningTime.js";
import 'vuepress-theme-hope/presets/bounce-icon.scss';

export default defineClientConfig({
  enhance({ app }) {
    app.component('MusicPlayer', MusicPlayer);
  },
  setup() {
    const page = usePageData();

    onMounted(() => {
        console.log("请不要检查... \n ---ghlg");
        setupDesktopEffects();

        watch(
          () => page.value.path,
          (path) => setCustomFooterVisibility(path === "/"),
          { immediate: true },
        );
    });
    setupRunningTimeFooter(
        new Date("2024-02-01"),
        {
          "/": "已运行 :day 天 :hour 小时 :minute 分钟 :second 秒",
        },
        true,
      );
  },
});
