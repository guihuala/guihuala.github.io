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
    ],
  },

  {
    text: "ai精品",
    icon: "eye",
    prefix: "/posts/",
    children: [
      {
        text: "无现里中学系列",
        icon: "pen-to-square",
        prefix: "mugensch/",
        children: [
          {
            text: "黑巫对答案",
            link: "kuroji",
          },
        ],
      },
      { text: "鸡肉面条", icon: "pen-to-square", link: "chickennoodles" },
      { text: "火龙果", icon: "pen-to-square", link: "dragonfruit" },
      "strawberry",
    ],
  },

  {
    text: "时间轴",
    icon: "reloadtime",
    link:"/timeline",
  },

]);
