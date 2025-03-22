import{a9 as t}from"./app-dyrDoZW9.js";var o={provider:"Waline",dark:'html[data-theme="dark"]',serverURL:"https://www.comment-waline.fun/",reaction:["https://unpkg.com/@waline/emojis@1.1.0/weibo/weibo_smile.png","https://unpkg.com/@waline/emojis@1.1.0/weibo/weibo_blush.png","https://unpkg.com/@waline/emojis@1.1.0/weibo/weibo_shuai.png","https://unpkg.com/@waline/emojis@1.1.0/weibo/weibo_sad.png"]};const n=async()=>{try{const{pageviewCount:e}=await t(()=>import("./app-dyrDoZW9.js").then(i=>i.aa),__vite__mapDeps([]));return e({serverURL:o.serverURL})}catch{console.error("@waline/client is not installed!");return}};export{n as updatePageview};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
