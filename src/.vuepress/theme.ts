import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://guihuala.github.io/",

  author: {
    name: "桂花拉糕",
    url: "https://github.com/guihuala",
  },

  iconAssets: "//at.alicdn.com/t/c/font_4429117_ieyl61ep8k.css",

  logo: "/桂花泥图标.png",

  favicon: "/logo.ico",

  repo: "https://github.com/guihuala",

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
    editLink: "在 GitHub 上编辑此页",
  },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 在这里配置主题提供的插件
  plugins: {
    blog: true,

    git: true,

    searchPro: true,

    comment: {
      provider: "Waline",
      serverURL: "https://www.comment-waline.fun/", // your server url
    },

    components: {
      components: [
      "Badge", 
      "VPCard",
      "BiliBili",
      "Share",
      "SiteInfo"
    ],
    },

    // 此处开启了很多功能用于演示，你应仅保留用到的功能。
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
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cachePic: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
