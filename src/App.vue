<script setup>
import { ref } from 'vue'
import LotteryTool from './components/LotteryTool.vue'
import Scoreboard from './components/Scoreboard.vue'
import TimerTool from './components/TimerTool.vue'
import ExamSettings from './components/ExamSettings.vue'
import QuizSystem from './components/QuizSystem.vue'

const currentTab = ref('Lottery')
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="user-info">
        <h1>課堂互動工具箱</h1>
        <p>
          <a href="https://www.et.tku.edu.tw/" target="_blank" class="dept-link">淡江教育科技學系</a>
          | 413730465 | 賴渙升
        </p>
      </div>
      <div class="time-widget">{{ new Date().toLocaleTimeString() }}</div>
    </header>

    <nav class="tabs">
      <button @click="currentTab = 'Lottery'" :class="{ active: currentTab === 'Lottery' }">抽籤</button>
      <button @click="currentTab = 'Scoreboard'" :class="{ active: currentTab === 'Scoreboard' }">記分</button>
      <button @click="currentTab = 'Timer'" :class="{ active: currentTab === 'Timer' }">計時</button>
      <button @click="currentTab = 'ExamSettings'" :class="{ active: currentTab === 'ExamSettings' }">考試設定</button>
      <button @click="currentTab = 'QuizSystem'" :class="{ active: currentTab === 'QuizSystem' }">測驗卷</button>
    </nav>

    <main class="content-view">
      <component :is="{ 
        Lottery: LotteryTool, 
        Scoreboard: Scoreboard, 
        Timer: TimerTool, 
        ExamSettings: ExamSettings, 
        QuizSystem: QuizSystem 
      }[currentTab]" />
    </main>
  </div>
</template>

<style>
:root { --bg: #09090b; --card: #18181b; --accent: #7c3aed; --text: #f4f4f5; }
body { background: var(--bg); color: var(--text); font-family: 'Inter', system-ui; margin: 0; padding: 20px; overflow-x: hidden; }
.app-layout { max-width: 1000px; margin: 0 auto; position: relative; }
.app-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
.user-info h1 { margin: 0; font-size: 3rem; font-weight: 800; letter-spacing: -1px; }

/* 系所連結樣式 */
.dept-link { 
  color: #a1a1aa; 
  text-decoration: none; 
  border-bottom: 1px solid #a1a1aa; 
  transition: all 0.2s;
}
.dept-link:hover { color: var(--accent); border-color: var(--accent); }

.user-info p { color: #a1a1aa; font-size: 0.85rem; margin-top: 5px; }
.time-widget { font-size: 3.5rem; font-weight: 800; color: var(--accent); letter-spacing: -2px; }
.tabs { display: flex; gap: 10px; margin-bottom: 30px; border-bottom: 1px solid #27272a; padding-bottom: 10px; position: relative; z-index: 10; }
.tabs button { padding: 10px 24px; border: none; background: transparent; color: #a1a1aa; cursor: pointer; border-radius: 6px; font-size: 1rem; }
.tabs button.active { background: var(--accent); color: white; }
</style>