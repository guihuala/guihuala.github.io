import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/demo/",

  {
    text: "同人整合",
    icon: "reloadtime",
    prefix: "/mywork",
    children: [
      { text: "连缘同人游戏",  link: "myLEgame" },

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
      {
        text: "香蕉",
        icon: "pen-to-square",
        prefix: "banana/",
        children: [
          {
            text: "香蕉 1",
            icon: "pen-to-square",
            link: "1",
          },
          {
            text: "香蕉 2",
            icon: "pen-to-square",
            link: "2",
          },
          "3",
          "4",
        ],
      },
      { text: "樱桃", icon: "pen-to-square", link: "cherry" },
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
