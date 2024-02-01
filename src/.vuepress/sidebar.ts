import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "oc设定",
      icon: "laptop-code",
      prefix: "oc/",
      link: "oc/",
      children: "structure",
    },
    {
      text: "同人整合",
      icon: "book",
      prefix: "mywork/",
      children: "structure",
    },
    {
      text: "ai精品文章",
      icon: "eye",
      prefix: "posts/",
      children: "structure",
    },
    "intro",
  ],
});
