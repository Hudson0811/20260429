export default defineConfig(({ command }) => {
  return {
    // 這裡最重要：
    // 當你在電腦跑 (serve) 時用 '/'
    // 當你要傳到 GitHub (build) 時，必須指定專案資料夾名稱
    base: command === 'serve' ? '/' : '/20260429/', 
    
    plugins: [
      vue(),
      vueDevTools(),
    ],
    // ...其餘代碼保持不變
  }
})