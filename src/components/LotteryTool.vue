<script setup>
import { ref } from 'vue'

const namesInput = ref('')
const isSpinning = ref(false)
const display = ref('抽籤系統')
const winner = ref(null)
const winnerEffectTrigger = ref(false) // 用於觸發所有特效

const startLottery = () => {
  let items = namesInput.value.trim() === '' 
    ? Array.from({ length: 100 }, (_, i) => (i + 1).toString())
    : namesInput.value.split('\n').filter(n => n.trim() !== '')

  if (items.length === 0) return alert('請先輸入名單！')
  
  isSpinning.value = true
  winner.value = null
  winnerEffectTrigger.value = false 
  
  let counter = 0
  const interval = setInterval(() => {
    display.value = items[Math.floor(Math.random() * items.length)]
    counter++
    if (counter >= 30) {
      clearInterval(interval)
      isSpinning.value = false
      winner.value = display.value
      
      // 觸發特效
      winnerEffectTrigger.value = true
      // 1.5 秒後關閉特效以供下次使用
      setTimeout(() => { winnerEffectTrigger.value = false }, 1500)
    }
  }, 50)
}
</script>

<template>
  <div class="lottery-card">
    <div v-if="winnerEffectTrigger" class="full-screen-quake">
      <div class="crack-lines"></div>
    </div>

    <div class="display-area" :class="{ 'winner-explode': winnerEffectTrigger }">
      {{ display }}
    </div>

    <button @click="startLottery" :disabled="isSpinning" class="draw-btn">
      {{ isSpinning ? '滾動中...' : '開始抽籤' }}
    </button>

    <div class="input-section">
      <p class="hint">提示：留空則預設抽 1-100 數字，或在此輸入名單</p>
      <textarea v-model="namesInput" placeholder="在此輸入名單..." class="name-input"></textarea>
    </div>
  </div>
</template>

<style scoped>
.lottery-card { background: var(--card); padding: 30px; border-radius: 12px; border: 1px solid #27272a; text-align: center; position: relative; }

/* --- 1. 文字爆炸特效 --- */
.display-area { 
  font-size: 5rem; font-weight: 800; color: var(--text); 
  margin: 20px 0; min-height: 120px;
  display: flex; justify-content: center; align-items: center;
  transition: all 0.3s ease;
}

.winner-explode {
  color: #fbbf24;
  text-shadow: 0 0 20px #f59e0b, 0 0 40px #b45309;
  animation: explode 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes explode { 
  0% { transform: scale(1); opacity: 0.5; } 
  50% { transform: scale(1.8); opacity: 1; } 
  100% { transform: scale(1); } 
}

/* --- 2. 全螢幕震動與裂痕特效 --- */
.full-screen-quake {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  z-index: 9999;
  pointer-events: none;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
  animation: screen-shake 0.8s cubic-bezier(.36,.07,.19,.97) both;
}

.crack-lines {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.8) 50%, transparent 55%),
              linear-gradient(-45deg, transparent 45%, rgba(255,255,255,0.8) 50%, transparent 55%);
  background-size: 200% 200%;
  animation: crack-spread 0.8s ease-out;
}

@keyframes screen-shake {
  0% { transform: translate(0, 0); }
  10%, 30%, 50%, 70%, 90% { transform: translate(-20px, -20px); }
  20%, 40%, 60%, 80% { transform: translate(20px, 20px); }
  100% { transform: translate(0, 0); }
}

@keyframes crack-spread {
  0% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0; transform: scale(1.5); }
}

/* --- 其他基礎樣式 --- */
.draw-btn { padding: 15px 40px; background: var(--accent); color: white; border: none; border-radius: 8px; font-size: 1.2rem; cursor: pointer; margin-bottom: 20px; }
.hint { color: #71717a; font-size: 0.9rem; margin-bottom: 10px; }
.name-input { width: 100%; height: 120px; background: #09090b; border: 1px solid #3f3f46; color: white; padding: 10px; border-radius: 6px; }
</style>