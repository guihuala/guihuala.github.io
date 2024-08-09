import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "oc设定",
      icon: "message",
      prefix: "oc/",
      link: "oc/",
      children: "structure",
    },
    {
      text: "同人整合",
      icon: "知识库",
      prefix: "mywork/",
      link: "mywork/",
      children: "structure",
    },
    {
      text: "ai精品文章",
      icon: "eye",
      prefix: "posts/",
      link: "posts/",
      children: "structure",
    },
    "intro",
  ],
});
