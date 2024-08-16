import { defineClientConfig } from 'vuepress/client';
import { onMounted } from 'vue';

import { setupRunningTimeFooter } from "vuepress-theme-hope/presets/footerRunningTime.js";
import 'vuepress-theme-hope/presets/bounce-icon.scss';

export default defineClientConfig({
  setup() {
    onMounted(() => {
        console.log("请不要检查... \n ---ghlg");
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