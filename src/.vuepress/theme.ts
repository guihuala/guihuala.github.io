import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://github.com/guihuala/guihuala.github.io/tree/master",

  author: {
    name: "桂花拉糕",
    url: "https://github.com/guihuala",
  },

  
  iconAssets: ["//at.alicdn.com/t/c/font_4429117_p9ol61krczi.css",
    "//at.alicdn.com/t/c/font_4429117_p9ol61krczi.css",
  ],

  logo: "/桂花泥图标.png",

  favicon: "/logo.ico",

  repo: "https://github.com/guihuala/guihuala.github.io/tree/master",

  docsDir: "src",

  lastUpdated: true,
  // 导航栏
  navbar,
  
  navbarLayout: {
    start: ['Brand', 'Search'],
    center: ['Links'],
    end: ['Repo', 'Outlook'],
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
      Twitter: "https://twitter.com/HoyleLorel96127",
      Weibo: "https://weibo.com/u/5933479313",
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

      // 在启用之前安装 chart.js
      // chart: true,

      // insert component easily

      // 在启用之前安装 echarts
      // echarts: true,

      // 在启用之前安装 flowchart.ts
      // flowchart: true,

      // gfm requires mathjax-full to provide tex support
      // gfm: true,

      // 在启用之前安装 katex
      // katex: true,

      // 在启用之前安装 mathjax-full
      // mathjax: true,

      // 在启用之前安装 mermaid
      // mermaid: true,

      // playground: {
      //   presets: ["ts", "vue"],
      // },

      // 在启用之前安装 reveal.js
      // revealJs: {
      //   plugins: ["highlight", "math", "search", "notes", "zoom"],
      // },

      // 在启用之前安装 @vue/repl
      // vuePlayground: true,

      // install sandpack-vue3 before enabling it
      // sandpack: true,
    },

    // 如果你需要 PWA。安装 vuepress-plugin-pwa2 并取消下方注释
    pwa: {
      cacheHTML: true,
      cachePic: true,
      appendBase: true,
      apple: {
        icon: "/assets/icon/apple-icon-152.png",
        statusBarColor: "black",
      },
      msTile: {
        image: "/assets/icon/ms-icon-144.png",
        color: "#ffffff",
      },
      manifest: {
        name: "桂花小站",
          short_name: "gui-blog",
          description: "桂花拉糕的博客",
          theme_color: "#5c92d1",
        icons: [
          {
            src: "/assets/icon/chrome-mask-512.png",
            sizes: "512x512",
            purpose: "maskable",
            type: "image/png",
          },
        ],
        shortcuts: [
          {
            name: "Demo",
            short_name: "Demo",
            url: "/demo/",
            icons: [
              {
                src: "/assets/icon/guide-maskable.png",
                sizes: "192x192",
                purpose: "maskable",
                type: "image/png",
              },
            ],
          },
        ],
      },
    },
  },
});
