import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",

        {
      text: "游戏开发",
      icon: "games-",
      prefix: "mygame/",
      link: "mygame/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "同人整合",
      icon: "Funny_weixuanzhong",
      prefix: "mywork/",
      link: "mywork/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "oc设定",
      icon: "user",
      prefix: "oc/",
      link: "oc/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "杂谈",
      icon: "message",
      prefix: "smalltalk/",
      link: "smalltalk/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "桌面",
      icon: "houtaixitong",
      link: "https://ghlg.fun/laptop/",
    },
    "intro",
  ],
});
