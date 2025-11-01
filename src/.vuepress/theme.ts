import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "ghlg.fun",
  author: {
    name: "桂花拉糕",
    url: "https://github.com/guihuala",
  },
  iconAssets: [
    "//at.alicdn.com/t/c/font_4429117_tmw1sm1egrl.css"
  ],
  logo: "/桂花泥图标.png",
  favicon: "/logo.ico",
  repo: "https://github.com/guihuala/guihuala.github.io",
  docsBranch: "master",
  docsDir: "src",
  lastUpdated: true,
  fullscreen: true,
  print: false,
  // 导航栏
  navbar,

  navbarLayout: {
    start: ['Brand',],
    center: ['Links',],
    end: [ 'Repo', 'Outlook','Search',],
  },
  // 侧边栏
  sidebar,

  // 页脚
  footer: "默认页脚",
  displayFooter: false,

  // 博客相关
  blog: {
    timeline: "当下",
    description: "新鲜的桂花糕",
    intro: "/intro.html",
    medias: {
      BiliBili: "https://space.bilibili.com/39258274",
      GitHub: "https://github.com/guihuala",
    },
  },

  // 加密配置
  encrypt: {
    config: {
      "/oc/encrypt": ["ghlg"],
    },
  },

  // 多语言配置
  metaLocales: {
    editLink: "github对应页面",
  },
  plugins: {
    blog: true,
    git: true,
    searchPro: true,
    comment: {
      provider: "Waline",
      serverURL: "https://www.comment-waline.fun/", // your server url
      reaction: [
        'https://unpkg.com/@waline/emojis@1.1.0/weibo/weibo_smile.png',
        'https://unpkg.com/@waline/emojis@1.1.0/weibo/weibo_blush.png',
        'https://unpkg.com/@waline/emojis@1.1.0/weibo/weibo_shuai.png',
        'https://unpkg.com/@waline/emojis@1.1.0/weibo/weibo_sad.png',
      ],
    },
    components: {
      components: [
        "Badge",
        "VPCard",
        "VPBanner",
        "BiliBili",
        "Share",
        "SiteInfo"
      ],
    },
    mdEnhance: {
      align: true,
      alert: true,
      attrs: true,
      codetabs: true,
      component: true,
      demo: true,
      figure: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      mark: true,
      revealJs: true,
      mermaid: true,
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      echarts: true,
    },
  },
});
