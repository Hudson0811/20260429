<script setup>
import { ref, computed } from 'vue'

const questions = [
  { q: "Vue 3 建立『基礎型別』響應式數據用？", options: ["reactive()", "ref()", "computed()", "watch()"], ans: 1, reason: "ref() 專門處理基礎型別，它會包裝成物件並透過 .value 存取；reactive() 則是用於物件或陣列。" },
  { q: "要在畫面上循環渲染陣列清單，應使用？", options: ["v-if", "v-model", "v-for", "v-show"], ans: 2, reason: "v-for 是 Vue 的標準循環指令，能遍歷數據並生成對應的 DOM 元素。" },
  { q: "2D 遊戲處理重力與物理位移的核心組件？", options: ["Sprite Renderer", "Box Collider 2D", "Rigidbody 2D", "Audio Source"], ans: 2, reason: "Rigidbody 2D (剛體) 是物理引擎的核心，負責計算重力、速度與力學反應。" },
  { q: "父組件傳遞數據給子組件是透過？", options: ["Props", "Emits", "Provide", "Expose"], ans: 0, reason: "Props 是 Vue 定義的單向數據流，由父組件向下傳遞參數給子組件。" },
  { q: "哪個 Git 指令可將本地變更同步到 GitHub？", options: ["git pull", "git status", "git commit", "git push"], ans: 3, reason: "Push 代表『推送』，將本地紀錄推送到遠端伺服器。" },
  { q: "JavaScript 將字串轉換成整數的方法？", options: ["toString()", "parseInt()", "join()", "split()"], ans: 1, reason: "parseInt() 會解析字串並回傳整數。toString() 則是反過來將數據轉為字串。" },
  { q: "Vite 專案中，管理套件依賴的核心檔案？", options: ["index.html", "main.js", "package.json", "vite.config.js"], ans: 2, reason: "package.json 紀錄了專案名稱、版本、依賴套件清單及執行腳本。" },
  { q: "v-show 與 v-if 的主要區別在於？", options: ["v-show 銷毀 DOM", "v-if 切換 CSS", "v-if 會銷毀/重建 DOM", "無區別"], ans: 2, reason: "v-if 是真實的條件渲染，會確保事件監聽器和子組件被銷毀與重建；v-show 只是切換 CSS 的 display。" },
  { q: "偵測玩家是否踩到地面的常用方法？", options: ["Raycast (射線偵測)", "Play Audio", "Changing Alpha", "Screen Shake"], ans: 0, reason: "Raycast 可以從玩家腳底向下發射射線，偵測特定距離內是否有碰撞體 (Collider)。" },
  { q: "Vue 中監聽點擊事件的正確縮寫？", options: [":click", "v-click", "@click", "#click"], ans: 2, reason: "@ 是 v-on: 的語法糖，用於監聽 DOM 事件。" }
]

const currentIndex = ref(0)
const userAnswers = ref([])
const isFinished = ref(false)
const showDetails = ref(false) 

const currentQuestion = computed(() => questions[currentIndex.value])
const progress = computed(() => ((currentIndex.value + 1) / questions.length) * 100)

const selectOption = (idx) => {
  userAnswers.value[currentIndex.value] = idx
  if (currentIndex.value < questions.length - 1) {
    setTimeout(() => { currentIndex.value++ }, 300)
  } else {
    setTimeout(() => { isFinished.value = true }, 300)
  }
}

const score = computed(() => {
  let correct = 0
  questions.forEach((q, i) => { if (userAnswers.value[i] === q.ans) correct++ })
  return Math.round((correct / questions.length) * 100)
})
</script>

<template>
  <div class="cyber-exam-v7">
    <div v-if="!isFinished" class="quiz-stage">
      <div class="monitor-header">
        <div class="progress-track"><div class="progress-fill" :style="{ width: progress + '%' }"></div></div>
        <div class="p-tag">NODE_{{ currentIndex + 1 }} // DATA_STREAMING</div>
      </div>
      <h2 class="q-title">{{ currentQuestion.q }}</h2>
      <div class="options-list">
        <div v-for="(opt, idx) in currentQuestion.options" :key="idx" 
             @click="selectOption(idx)" class="opt-item" :class="{ 'selected': userAnswers[currentIndex] === idx }">
          <span class="prefix">{{ String.fromCharCode(65+idx) }}</span> {{ opt }}
          <div class="opt-scan"></div>
        </div>
      </div>
    </div>

    <div v-else class="summary-stage">
      
      <div class="matrix-bg"></div>

      <div class="score-core" :class="{ 'meltdown': score < 60, 'syncing': true }">
        <div class="core-particles"></div>
        <div class="val">{{ score }}</div>
        <div class="unit">MATCH_RATE</div>
        <div class="status-box">{{ score >= 60 ? 'AUTHORIZED' : 'DEVIATION' }}</div>
      </div>

      <div class="result-msg" :class="{ 'granted': score >= 60 }">
        {{ score >= 60 ? 'ACCESS_GRANTED' : 'ACCESS_DENIED' }}
      </div>

      <div class="action-row">
        <button @click="showDetails = !showDetails" class="cyber-btn" :class="{ 'active': showDetails }">
          <span class="btn-text">{{ showDetails ? '關閉分析報告' : '傳送詳解報告' }}</span>
          <div class="btn-glow"></div>
        </button>
        <button @click="isFinished = false; currentIndex = 0; userAnswers = []; showDetails = false;" class="reset-link">初始化核心</button>
      </div>

      <Transition name="data-stream">
        <div v-if="showDetails" class="details-list">
          <div v-for="(q, i) in questions" :key="i" class="report-item" :class="{ 'wrong': userAnswers[i] !== q.ans }">
            <div class="item-header">
              <span class="status-icon">{{ userAnswers[i] === q.ans ? '✔' : '✘' }}</span>
              <span class="item-q">Q{{ i + 1 }}. {{ q.q }}</span>
            </div>
            <div class="item-body">
              <p>用戶選擇：<span class="u-ans">{{ q.options[userAnswers[i]] || '未作答' }}</span></p>
              <p>正確密鑰：<span class="c-ans">{{ q.options[q.ans] }}</span></p>
              <div class="reason-box">解析：{{ q.reason }}</div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.cyber-exam-v7 { background: #000; color: #fff; padding: 40px; font-family: 'Orbitron', 'Microsoft JhengHei', sans-serif; min-height: 650px; border: 1px solid #1a1a2e; position: relative; overflow: hidden; }

/* 答題樣式 */
.progress-track { height: 2px; background: #111; margin-bottom: 8px; }
.progress-fill { height: 100%; background: #0ff; box-shadow: 0 0 10px #0ff; transition: 0.3s; }
.p-tag { font-size: 0.7rem; color: #7c3aed; margin-bottom: 30px; letter-spacing: 2px; }
.q-title { font-size: 1.6rem; margin-bottom: 40px; }
.opt-item { background: #080808; border: 1px solid #222; padding: 18px 25px; margin-bottom: 12px; cursor: pointer; transition: 0.3s; position: relative; overflow: hidden; }
.opt-item:hover { border-color: #7c3aed; background: rgba(124, 58, 237, 0.05); }
.opt-item.selected { border-color: #0ff; color: #0ff; background: rgba(0, 255, 255, 0.05); }
.prefix { color: #7c3aed; font-weight: bold; margin-right: 15px; }
.opt-scan { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.1), transparent); transform: translateX(-100%); }
.opt-item:hover .opt-scan { animation: scan 1.5s infinite; }

/* --- 結算與詳解特效 --- */
.summary-stage { text-align: center; position: relative; z-index: 10; animation: fade-in 1s; }
.matrix-bg { position: absolute; inset: 0; background-image: radial-gradient(#200 1px, transparent 1px); background-size: 20px 20px; opacity: 0.2; pointer-events: none; }

/* 核心同步器 */
.score-core {
  width: 160px; height: 160px; border: 4px double #7c3aed; border-radius: 50%; margin: 0 auto 20px;
  display: flex; flex-direction: column; justify-content: center; position: relative;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%);
  animation: breathe 2s infinite, gather-in 1s ease-out;
}
.score-core.meltdown { border-color: #ff0055; animation: meltdown-pulse 0.5s infinite; background: radial-gradient(circle, rgba(255, 0, 85, 0.1) 0%, transparent 70%); }
.val { font-size: 4rem; color: #0ff; font-weight: 900; line-height: 1; }
.meltdown .val { color: #ff0055; text-shadow: 0 0 10px #ff0055; }
.unit { font-size: 0.6rem; color: #7c3aed; }
.meltdown .unit { color: #ff0055; }
.status-box { font-size: 0.6rem; margin-top: 5px; color: #aaa; background: #000; padding: 2px 8px; border-radius: 4px; }

.result-msg { font-size: 1.5rem; font-weight: bold; color: #555; animation: glitch-text 0.2s 3, blink-text 1s infinite; letter-spacing: 4px; margin-bottom: 30px; }
.result-msg.granted { color: #0ff; text-shadow: 0 0 15px #0ff; }

/* 詳解按鈕 */
.action-row { display: flex; justify-content: center; gap: 20px; margin-bottom: 40px; }
.cyber-btn {
  background: transparent; border: 2px solid #7c3aed; color: #fff; padding: 12px 30px; cursor: pointer;
  clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%); position: relative; transition: 0.3s;
}
.cyber-btn.active { background: #7c3aed; box-shadow: 0 0 15px #7c3aed; }
.cyber-btn:hover:not(.active) { box-shadow: 0 0 10px rgba(124, 58, 237, 0.5); }
.btn-text { font-family: 'Orbitron'; letter-spacing: 1px; }

.reset-link { background: transparent; border: none; color: #444; cursor: pointer; text-decoration: underline; font-size: 0.8rem; }
.reset-link:hover { color: #fff; }

/* 詳解列表 */
.details-list { text-align: left; background: #050505; padding: 20px; border: 1px solid #111; max-width: 800px; margin: 0 auto; }
.report-item { border-left: 3px solid #0f0; padding: 15px; margin-bottom: 15px; background: rgba(0,255,0,0.02); }
.report-item.wrong { border-left-color: #f00; background: rgba(255,0,0,0.02); }
.status-icon { font-weight: bold; margin-right: 10px; }
.u-ans { color: #f00; }
.report-item:not(.wrong) .u-ans { color: #0f0; }
.c-ans { color: #0ff; font-weight: bold; }
.reason-box { margin-top: 10px; padding: 10px; background: #111; font-size: 0.8rem; color: #aaa; border-radius: 4px; }

/* --- 動畫定義 --- */
@keyframes scan { 100% { transform: translateX(100%); } }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes breathe { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.9; } }
@keyframes meltdown-pulse { 0% { opacity: 1; transform: scale(1); filter: brightness(1.5); } 100% { opacity: 0.7; transform: scale(1.02); filter: brightness(1); } }
@keyframes gather-in { from { transform: scale(1.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes glitch-text { 0% { transform: translate(0); } 20% { transform: translate(-2px, 2px); } 40% { transform: translate(2px, -2px); } 100% { transform: translate(0); } }
@keyframes blink-text { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.data-stream-enter-active { animation: stream-in 0.5s ease-out; }
@keyframes stream-in { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>