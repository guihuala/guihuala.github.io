import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/oc/",

  {
    text: "同人整合",
    icon: "reloadtime",
    prefix: "/mywork",
    children: [
      { text: "连缘同人游戏",  link: "myLEgame" },
      { text: "同人画作",  link: "myArt" },
      { text: "同人文",  link: "myArticle" },
      { text: "模型",  link: "model" },
      { text: "幻灯片",  link: "myPPT" },
    ],
  },

  {
    text: "ai精品",
    icon: "eye",
    prefix: "/posts/",
    children: [
      { text: "鸡肉面条", icon: "//images.shoutwiki.com/lenen/6/64/Favicon.ico", link: "chickennoodles" },
      { text: "黑巫鸟与建筑学", icon: "//images.shoutwiki.com/lenen/6/64/Favicon.ico", link: "kurojiAndArch" },
      { text: "幸福鹀家人", icon: "//images.shoutwiki.com/lenen/6/64/Favicon.ico", link: "happyshitodo" },
      { text: "无现里英雄人物", icon: "//images.shoutwiki.com/lenen/6/64/Favicon.ico", link: "mugenhero" },
      {
        text: "无现里中学系列",
        icon: "pen-to-square",
        prefix: "mugensch/",
        children: [
          {
            text: "黑巫对答案",
            icon: "//images.shoutwiki.com/lenen/6/64/Favicon.ico",
            link: "kuroji",
          },
        ],
      },
    ],
  },
  {
    text: "收藏链接",
    icon: "link",
    link:"/link",
  },
  {
    text: "时间轴",
    icon: "reloadtime",
    link:"/timeline",
  },

]);
