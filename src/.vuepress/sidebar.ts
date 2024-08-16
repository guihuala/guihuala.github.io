import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    
    {
      text: "ai精品文章",
      icon: "aislogo",
      prefix: "posts/",
      link: "posts/",
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
    "myPPT",
    "intro",
  ],
});
