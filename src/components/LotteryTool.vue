<script setup>
import { ref } from 'vue'

// --- 核心狀態 (完全保留你的邏輯) ---
const namesInput = ref('')
const minNum = ref(1)
const maxNum = ref(100)
const isSpinning = ref(false)
const isAssembling = ref(false)
const isExploding = ref(false)
const display = ref('READY')
const winner = ref(null)
const history = ref([])
const allowRepeat = ref(false)

const getAvailableItems = () => {
  let list = []
  if (namesInput.value.trim() === '') {
    for (let i = minNum.value; i <= maxNum.value; i++) list.push(i.toString())
  } else {
    list = namesInput.value.split('\n').filter(n => n.trim() !== '')
  }
  return allowRepeat.value ? list : list.filter(item => !history.value.includes(item))
}

const startLottery = () => {
  const availableItems = getAvailableItems()
  if (availableItems.length === 0) return alert('宇宙真空，目前沒有可抽取的實體！')
  
  isSpinning.value = true
  isAssembling.value = true
  isExploding.value = false
  winner.value = null
  
  let counter = 0
  const interval = setInterval(() => {
    display.value = availableItems[Math.floor(Math.random() * availableItems.length)]
    counter++
    
    if (counter >= 40) {
      clearInterval(interval)
      triggerBigBang(availableItems)
    }
  }, 50)
}

const triggerBigBang = (availableItems) => {
  isAssembling.value = false
  display.value = 'SINGULARITY' 
  
  setTimeout(() => {
    isExploding.value = true
    isSpinning.value = false
    const finalWinner = availableItems[Math.floor(Math.random() * availableItems.length)]
    winner.value = finalWinner
    display.value = finalWinner
    history.value.push(finalWinner)
    
    setTimeout(() => { isExploding.value = false }, 1500)
  }, 800)
}

const clearHistory = () => { history.value = [] }
</script>

<template>
  <div class="cosmic-lottery" :class="{ 'shake-heavy': isExploding }">
    <div class="crt-scanlines"></div>
    
    <div class="system-top-bar">
      <div class="status-panel">
        <div class="mode-tag">
          <span class="pulse-dot"></span>
          {{ namesInput.trim() === '' ? 'RANGE_SCAN' : 'ENTITY_SCAN' }}
        </div>
      </div>
      
      <div class="control-panel-mini">
        <label class="cyber-checkbox">
          <input type="checkbox" v-model="allowRepeat">
          <span class="check-box"></span>
          <span class="label-text">允許重複</span>
        </label>
        <div class="history-pill" @click="clearHistory">
          <span class="pill-label">已排除</span>
          <span class="pill-count">{{ history.length }}</span>
          <span class="pill-reset">RESET</span>
        </div>
      </div>
    </div>

    <div class="void-fx" v-if="isSpinning || winner">
      <div class="black-hole" :class="{ 'swallow': isAssembling }"></div>
      <div v-for="n in 5" :key="n" class="orbit-line"></div>
      <div class="victory-drift" v-if="winner && !isSpinning"></div>
    </div>

    <div class="display-container">
      <div class="glitch-overlay" v-if="isExploding"></div>
      
      <Transition name="winner-zoom">
        <div 
          :key="display"
          class="main-display" 
          :class="{ 
            'assembling': isAssembling || display === 'SINGULARITY', 
            'bang': isExploding,
            'is-winner': winner && !isSpinning 
          }"
        >
          <span class="cipher-text">{{ display }}</span>
          <div class="energy-aura" v-if="winner && !isSpinning"></div>
        </div>
      </Transition>
    </div>

    <div class="config-section">
      <div class="btn-container">
        <button @click="startLottery" :disabled="isSpinning" class="cyber-bang-btn">
          <div class="btn-inner">
            <span class="btn-text">{{ isSpinning ? '能量匯聚中...' : '發動宇宙抽籤' }}</span>
          </div>
          <div class="btn-neon-border"></div>
        </button>
        <div class="btn-label-deco">>>> STATUS: READY TO EXPLODE <<<</div>
      </div>

      <div class="settings-grid">
        <div class="cyber-field">
          <div class="field-label">座標區間 / RANGE</div>
          <div class="range-row">
            <input type="number" v-model="minNum" class="cyber-input-s">
            <span class="spacer">~</span>
            <input type="number" v-model="maxNum" class="cyber-input-s">
          </div>
        </div>

        <div class="cyber-field">
          <div class="field-label">ENTITY DATABASE / 名單庫</div>
          <div class="textarea-wrapper">
            <textarea v-model="namesInput" placeholder="每行一個實體..." class="cyber-textarea"></textarea>
            <div class="corner-deco tl"></div>
            <div class="corner-deco br"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="chromatic-aberration" v-if="isExploding || (winner && !isSpinning)"></div>
  </div>
</template>

<style scoped>
/* 基礎樣式 */
.cosmic-lottery {
  background: #000; min-height: 700px; padding: 35px; border-radius: 15px;
  border: 1px solid #1a1a2e; position: relative; overflow: hidden;
  color: #fff; font-family: 'Orbitron', sans-serif;
}
.crt-scanlines {
  position: absolute; inset: 0; pointer-events: none; z-index: 5;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%);
  background-size: 100% 4px;
}

/* 狀態列 */
.system-top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; z-index: 60; position: relative; }
.mode-tag { background: rgba(124, 58, 237, 0.1); border: 1px solid #7c3aed; padding: 5px 12px; border-radius: 4px; font-size: 0.7rem; color: #a78bfa; display: flex; align-items: center; gap: 8px; }
.pulse-dot { width: 6px; height: 6px; background: #0ff; border-radius: 50%; animation: blink 1s infinite; }

/* 核心黑洞與後續特效 (由你的錄影還原) */
.void-fx { position: absolute; inset: 0; pointer-events: none; }
.black-hole {
  position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%);
  width: 200px; height: 200px; background: radial-gradient(circle, #7c3aed 0%, transparent 70%);
  filter: blur(40px); opacity: 0.5; transition: 2s cubic-bezier(0.19, 1, 0.22, 1);
}
.black-hole.swallow { transform: translate(-50%, -50%) scale(0.1); opacity: 1; filter: blur(10px); }
.orbit-line { position: absolute; top: 40%; left: 50%; border: 1px solid rgba(0, 255, 255, 0.1); border-radius: 50%; transform: translate(-50%, -50%); animation: orbit-spin 10s linear infinite; }
.victory-drift { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(0, 255, 255, 0.05) 1px, transparent 1px); background-size: 30px 30px; animation: drift 10s linear infinite; }

/* 顯示與大爆炸 */
.display-container { height: 220px; display: flex; justify-content: center; align-items: center; position: relative; z-index: 10; }
.main-display { font-size: 4rem; font-weight: 900; letter-spacing: 5px; transition: all 0.5s; position: relative; }
.assembling { transform: scale(0.4); opacity: 0.3; filter: blur(5px); }
.bang { animation: bang-flare 0.5s forwards; color: #fbbf24; text-shadow: 0 0 30px #f59e0b, 0 0 60px #fff; }
.is-winner { font-size: 6.5rem; color: #fff; text-shadow: 0 0 20px #0ff, 0 0 40px #7c3aed, 0 0 60px #7c3aed; animation: winner-float 3s ease-in-out infinite; }
.energy-aura { position: absolute; top: 50%; left: 50%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%); transform: translate(-50%, -50%); pointer-events: none; }

/* 直覺化按鈕設計 */
.btn-container { display: flex; flex-direction: column; align-items: center; margin-bottom: 30px; }
.cyber-bang-btn {
  position: relative;
  background: transparent;
  border: none;
  padding: 2px;
  cursor: pointer;
  width: 320px;
  transition: transform 0.1s active;
}
.cyber-bang-btn:active { transform: scale(0.96); }
.cyber-bang-btn:disabled { opacity: 0.6; filter: grayscale(1); }

.btn-inner {
  background: #000;
  padding: 15px;
  clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
  border: 1px solid #7c3aed;
  z-index: 2;
  position: relative;
  color: #fff;
}
.btn-text { font-size: 1.1rem; font-weight: 800; letter-spacing: 3px; text-shadow: 0 0 10px #7c3aed; }

.btn-neon-border {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #7c3aed, #0ff, #7c3aed);
  clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
  opacity: 0.3;
  transition: 0.3s;
}
.cyber-bang-btn:hover .btn-neon-border { opacity: 1; filter: blur(5px); }
.btn-label-deco { font-size: 0.5rem; color: #7c3aed; margin-top: 8px; opacity: 0.6; animation: blink 1s infinite; }

/* 配置區 */
.settings-grid { display: grid; gap: 20px; text-align: left; }
.field-label { font-size: 0.7rem; color: #7c3aed; margin-bottom: 8px; }
.range-row { display: flex; gap: 10px; align-items: center; }
.cyber-input-s { background: #111; border: 1px solid #333; color: #0ff; width: 80px; padding: 5px; border-radius: 4px; text-align: center; }
.textarea-wrapper { position: relative; }
.cyber-textarea { width: 100%; height: 80px; background: rgba(15, 15, 20, 0.8); border: 1px solid #222; color: #0ff; padding: 10px; font-family: monospace; outline: none; border-radius: 4px; resize: none; }
.corner-deco { position: absolute; width: 8px; height: 8px; border: 2px solid #7c3aed; }
.tl { top: -2px; left: -2px; border-right: none; border-bottom: none; }
.br { bottom: -2px; right: -2px; border-left: none; border-top: none; }

/* 動畫定義 */
@keyframes orbit-spin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
@keyframes bang-flare { 0% { transform: scale(0.1); filter: brightness(10); } 50% { transform: scale(2.2); filter: brightness(2); } 100% { transform: scale(1.15); filter: brightness(1); } }
@keyframes winner-float { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-15px) scale(1.05); } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
@keyframes drift { from { background-position: 0 0; } to { background-position: 100px 100px; } }
@keyframes screen-shake-heavy { 0%, 100% { transform: translate(0,0); } 25% { transform: translate(-8px, 8px); } 50% { transform: translate(8px, -8px); } }
.shake-heavy { animation: screen-shake-heavy 0.1s infinite; }
</style>