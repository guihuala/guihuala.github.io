import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  
  {
    text: "文章",
    icon: "Article",
    link: "/posts/",
  },
  {
    text: "咖啡厅",
    icon: "coffee",
    link: "/cafe",
  },
  {
    text: "收藏链接",
    icon: "link",
    link: "/link",
  },
  {
    text: "时间轴",
    icon: "ic_timeline",
    link: "/timeline",
  },

]);
