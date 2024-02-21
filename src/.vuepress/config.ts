import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import Meteor from '@moefy-canvas/theme-meteor';

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "桂花小站",
  description: "桂花 的blog",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
