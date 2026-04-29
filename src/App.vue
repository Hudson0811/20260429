<script setup>
import { ref, onMounted } from 'vue'
import LotteryTool from './components/LotteryTool.vue'
import Scoreboard from './components/Scoreboard.vue'
import TimerTool from './components/TimerTool.vue'
import ExamSettings from './components/ExamSettings.vue'
import QuizSystem from './components/QuizSystem.vue'
import GroupTool from './components/GroupTool.vue'

const currentTab = ref('Lottery')
const currentTime = ref('')

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('zh-TW', { hour12: false })
}
onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})
</script>

<template>
  <div class="app-layout">
    <div class="cyber-full-bg">
      <div class="heavy-grid"></div>
      <div class="active-data-stream"></div>
      <div class="vignette-overlay"></div>
    </div>

    <header class="app-header">
      <div class="user-info">
        <div class="title-container">
          <h1 class="electromagnetic-glitch" data-text="課堂互動工具箱">
            課堂互動工具箱
          </h1>
          <div class="glitch-particles"></div>
        </div>
        <div class="header-laser-line"></div>
        <p class="sub-info-line">
          <a href="https://www.et.tku.edu.tw/" target="_blank" class="dept-link cyber-signal-blink">淡江教育科技學系</a>
          <span class="divider">|</span> 413730465 <span class="divider">|</span> 賴渙升
        </p>
      </div>
      
      <div class="time-widget-box">
        <div class="time-label">NODE_SYNC_CLOCK</div>
        <div class="time-widget">{{ currentTime }}</div>
      </div>
    </header>

    <nav class="tabs">
      <button @click="currentTab = 'Lottery'" :class="{ active: currentTab === 'Lottery' }">抽籤</button>
      <button @click="currentTab = 'Group'" :class="{ active: currentTab === 'Group' }">隨機分組</button> 
      <button @click="currentTab = 'Scoreboard'" :class="{ active: currentTab === 'Scoreboard' }">記分</button>
      <button @click="currentTab = 'Timer'" :class="{ active: currentTab === 'Timer' }">計時</button>
      <button @click="currentTab = 'ExamSettings'" :class="{ active: currentTab === 'ExamSettings' }">考試設定</button>
      <button @click="currentTab = 'QuizSystem'" :class="{ active: currentTab === 'QuizSystem' }">測驗卷</button>
    </nav>

    <main class="content-view">
      <Transition name="cyber-fade" mode="out-in">
        <component :is="{ 
          Lottery: LotteryTool, 
          Group: GroupTool,
          Scoreboard: Scoreboard, 
          Timer: TimerTool, 
          ExamSettings: ExamSettings, 
          QuizSystem: QuizSystem 
        }[currentTab]" />
      </Transition>
    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Share+Tech+Mono&display=swap');

:root { 
  --bg: #000; 
  --accent: #7c3aed; 
  --cyan: #00ffff;
  --text: #f4f4f5; 
}

body { 
  background: var(--bg); color: var(--text); 
  font-family: 'Orbitron', 'Microsoft JhengHei', sans-serif; 
  margin: 0; padding: 20px; overflow: hidden;
}

/* === 背景：內斂化微調 === */
.cyber-full-bg { position: fixed; inset: 0; z-index: -1; background: #050505; }
.heavy-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(124, 58, 237, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(124, 58, 237, 0.1) 1px, transparent 1px);
  background-size: 80px 80px; animation: grid-scroll 15s linear infinite;
}
.active-data-stream {
  position: absolute; inset: 0;
  background-image: linear-gradient(180deg, transparent 0%, rgba(0, 255, 255, 0.08) 50%, transparent 100%);
  background-size: 100% 900px; animation: stream-fall 5s linear infinite;
}
.vignette-overlay {
  position: absolute; inset: 0;
  background: radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%);
  pointer-events: none;
}

@keyframes grid-scroll { from { background-position: 0 0; } to { background-position: 0 80px; } }
@keyframes stream-fall { from { background-position: 0 -900px; } to { background-position: 0 900px; } }

/* === 標題：完全保留你的原始參數 === */
.title-container { position: relative; display: inline-block; }

.electromagnetic-glitch {
  font-size: 5rem; font-weight: 900; margin: 0; color: #fff;
  position: relative; letter-spacing: -1px;
  text-shadow: 4px 0px 0px var(--accent), -4px 0px 0px var(--cyan);
  animation: pulse-vibrate 4s infinite ease-in-out;
}

.electromagnetic-glitch::before, .electromagnetic-glitch::after {
  content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%;
}

.electromagnetic-glitch::before {
  color: var(--cyan); z-index: -1;
  animation: strong-slice-left 4s infinite steps(1);
  opacity: 0.7;
}

.electromagnetic-glitch::after {
  color: var(--accent); z-index: -2;
  animation: strong-slice-right 4s infinite steps(1);
  opacity: 0.7;
}

@keyframes pulse-vibrate {
  0%, 80%, 100% { transform: translate(0); filter: brightness(1); }
  82% { transform: translate(4px, -2px) skewX(2deg); filter: brightness(2); }
  84% { transform: translate(-4px, 2px) skewX(-2deg); filter: brightness(1.2); }
  86% { transform: translate(6px, 0); filter: contrast(2); }
  88% { transform: translate(0); }
}

@keyframes strong-slice-left {
  0%, 80%, 100% { transform: translate(-5px, 0); clip-path: inset(20% 0 70% 0); opacity: 0.4; }
  82% { transform: translate(-25px, 5px); clip-path: inset(0% 0 50% 0); opacity: 1; }
  84% { transform: translate(-15px, -5px); clip-path: inset(50% 0 0% 0); opacity: 0.8; }
  88% { transform: translate(-5px, 0); clip-path: inset(20% 0 70% 0); }
}

@keyframes strong-slice-right {
  0%, 80%, 100% { transform: translate(5px, 0); clip-path: inset(70% 0 20% 0); opacity: 0.4; }
  82% { transform: translate(25px, -5px); clip-path: inset(40% 0 10% 0); opacity: 1; }
  84% { transform: translate(15px, 5px); clip-path: inset(10% 0 60% 0); opacity: 0.8; }
  88% { transform: translate(5px, 0); clip-path: inset(70% 0 20% 0); }
}

.glitch-particles {
  position: absolute; inset: -20px; z-index: -3;
  background-image: radial-gradient(var(--cyan) 1px, transparent 1px),
                    radial-gradient(var(--accent) 1px, transparent 1px);
  background-size: 40px 40px; background-position: 0 0, 20px 20px;
  opacity: 0; animation: particle-fade 4s infinite;
}
@keyframes particle-fade {
  0%, 80%, 100% { opacity: 0; transform: scale(1); }
  82% { opacity: 0.4; transform: scale(1.1); }
  86% { opacity: 0; transform: scale(1.2); }
}

/* === 排版與微閃爍優化 === */
.app-layout { max-width: 1400px; margin: 0 auto; position: relative; z-index: 10; }

.app-header { 
  display: flex; justify-content: space-between; align-items: flex-end; 
  margin-bottom: 25px; 
  padding: 10px 0; 
}

.sub-info-line { font-size: 1.1rem; margin-top: 8px; color: #777; letter-spacing: 1px; }

/* 連結微閃爍動畫 */
.cyber-signal-blink {
  color: var(--cyan) !important;
  text-decoration: none;
  font-weight: bold;
  animation: mini-blink 2s infinite ease-in-out;
}

@keyframes mini-blink {
  0%, 100% { opacity: 1; text-shadow: 0 0 5px var(--cyan); }
  50% { opacity: 0.6; text-shadow: none; }
}

.time-widget-box { text-align: right; border-right: 6px solid var(--accent); padding-right: 20px; }
.time-label { font-size: 0.8rem; color: var(--accent); font-weight: bold; letter-spacing: 3px; }
.time-widget { 
  font-size: 5rem; font-weight: 900; color: #fff; 
  font-family: 'Share Tech Mono', monospace; text-shadow: 0 0 20px var(--accent);
}

.header-laser-line { height: 2px; width: 200px; background: linear-gradient(90deg, var(--cyan), transparent); margin: 10px 0; }

.tabs { display: flex; gap: 10px; margin-bottom: 25px; border-bottom: 1px solid #222; }
.tabs button { 
  padding: 12px 24px; background: transparent; border: none; color: #666; 
  cursor: pointer; font-family: 'Orbitron'; transition: 0.3s; font-weight: 700;
}
.tabs button.active { 
  color: #fff; background: var(--accent); 
  clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
  box-shadow: 0 0 20px var(--accent);
}

.content-view { 
  height: calc(100vh - 220px);
  overflow-y: auto;
  padding-top: 10px;
}

.cyber-fade-enter-active, .cyber-fade-leave-active { transition: opacity 0.2s; }
.cyber-fade-enter-from { opacity: 0; }
</style>