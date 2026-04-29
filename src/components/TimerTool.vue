<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const isMinuteMode = ref(true) 
const inputValue = ref(1) 
const timeLeft = ref(60)  
const isRunning = ref(false)
const isMeltdown = ref(false) // 核心熔毀特效開關
const timerInterval = ref(null)

const updateTimeFromInput = () => {
  timeLeft.value = isMinuteMode.value ? inputValue.value * 60 : inputValue.value
}

// 快捷鍵功能
const quickSet = (min) => {
  isMinuteMode.value = true
  inputValue.value = min
  isMeltdown.value = false
  resetTimer()
}

watch([isMinuteMode, inputValue], () => {
  if (!isRunning.value) updateTimeFromInput()
})

const displayTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60)
  const s = timeLeft.value % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

const toggleTimer = () => {
  if (isRunning.value) {
    clearInterval(timerInterval.value)
    isRunning.value = false
  } else {
    if (timeLeft.value <= 0) return
    isMeltdown.value = false
    isRunning.value = true
    timerInterval.value = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        clearInterval(timerInterval.value)
        isRunning.value = false
        isMeltdown.value = true // 觸發創新警告特效
      }
    }, 1000)
  }
}

const resetTimer = () => {
  clearInterval(timerInterval.value)
  isRunning.value = false
  isMeltdown.value = false
  updateTimeFromInput()
}

onUnmounted(() => clearInterval(timerInterval.value))
</script>

<template>
  <div class="cyber-timer-terminal" :class="{ 'meltdown-active': isMeltdown }">
    <div v-if="isMeltdown" class="particles-overlay"></div>

    <div class="header-laser">
      <div class="laser-beam"></div>
      <div class="status-id">TIME_STABILIZER // {{ isMeltdown ? 'CORE_MELTDOWN' : 'ONLINE' }}</div>
    </div>

    <div class="display-stage">
      <div class="time-readout" :class="{ 'warning': timeLeft <= 10 && isRunning, 'glitch-out': isMeltdown }">
        {{ isMeltdown ? '00:00' : displayTime }}
      </div>
      <div class="energy-track">
        <div class="energy-fill" :style="{ width: (timeLeft / (isMinuteMode ? inputValue*60 : inputValue)) * 100 + '%' }"></div>
      </div>
    </div>

    <div class="control-grid">
      <div class="quick-presets">
        <button @click="quickSet(1)" class="preset-btn">1M</button>
        <button @click="quickSet(3)" class="preset-btn">3M</button>
        <button @click="quickSet(5)" class="preset-btn">5M</button>
      </div>

      <div class="settings-row">
        <div class="mode-switch" @click="isMinuteMode = !isMinuteMode">
          <div class="switch-base">
            <div class="switch-slider" :class="{ 'on-right': !isMinuteMode }"></div>
          </div>
          <span class="mode-label">{{ isMinuteMode ? '分鐘' : '秒數' }}</span>
        </div>

        <div class="stepper">
          <button @click="inputValue > 1 ? inputValue-- : null" class="step-btn">－</button>
          <input type="number" v-model.number="inputValue" class="cyber-input" @focus="isRunning = false" />
          <button @click="inputValue++" class="step-btn">＋</button>
        </div>
      </div>

      <div class="actions-row">
        <button @click="toggleTimer" class="mega-btn" :class="{ 'running': isRunning }">
          <span class="btn-label">{{ isRunning ? '中止倒數' : '啟動序列' }}</span>
          <div class="btn-scan"></div>
        </button>
        <button @click="resetTimer" class="reset-link">重置核心</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cyber-timer-terminal {
  background: #000; padding: 40px; border: 1px solid #1a1a2e; color: #fff;
  font-family: 'Orbitron', 'Microsoft JhengHei', sans-serif; position: relative; overflow: hidden;
  transition: background 0.3s;
}

/* 熔毀特效樣式 */
.meltdown-active { background: #200 !important; border-color: #f00 !important; }
.particles-overlay {
  position: absolute; inset: 0; pointer-events: none;
  background-image: radial-gradient(#f00 1px, transparent 1px);
  background-size: 20px 20px; animation: particle-drift 0.5s infinite; opacity: 0.3;
}

.laser-beam { height: 2px; background: linear-gradient(90deg, transparent, #7c3aed, #0ff, transparent); box-shadow: 0 0 10px #7c3aed; }

/* 數字顯示與警告 */
.display-stage { text-align: center; margin-bottom: 30px; }
.time-readout {
  font-size: 8rem; font-weight: 900; line-height: 1; text-shadow: 0 0 20px #7c3aed;
}
.warning { color: #ff0055; animation: pulse 0.5s infinite; }
.glitch-out { color: #f00; text-shadow: 0 0 30px #f00; animation: glitch-shake 0.1s infinite; }

.energy-track { width: 100%; height: 4px; background: #111; margin-top: 20px; overflow: hidden; }
.energy-fill { height: 100%; background: #0ff; box-shadow: 0 0 10px #0ff; transition: width 0.3s linear; }
.meltdown-active .energy-fill { background: #f00; box-shadow: 0 0 10px #f00; }

/* 快捷鍵 */
.quick-presets { display: flex; gap: 10px; margin-bottom: 20px; }
.preset-btn {
  background: #111; border: 1px solid #333; color: #7c3aed; padding: 5px 15px;
  cursor: pointer; font-size: 0.8rem; transition: 0.3s;
}
.preset-btn:hover { border-color: #0ff; color: #0ff; }

.control-grid { display: flex; flex-direction: column; align-items: center; }
.settings-row { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }

/* 切換與輸入 (消滅白框) */
.mode-switch { cursor: pointer; display: flex; align-items: center; gap: 8px; width: 80px; }
.switch-base { width: 36px; height: 18px; background: #222; border-radius: 9px; position: relative; }
.switch-slider { position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; background: #7c3aed; border-radius: 50%; transition: 0.3s; }
.switch-slider.on-right { left: 20px; background: #0ff; }
.mode-label { font-size: 0.75rem; color: #aaa; }

.stepper { display: flex; background: #080808; border: 1px solid #333; border-radius: 4px; border-left: 3px solid #7c3aed; overflow: hidden; }
.step-btn { width: 40px; height: 40px; background: #1a1a1a; border: none; color: #fff; cursor: pointer; }
.cyber-input { width: 60px; background: transparent; border: none; color: #0ff; text-align: center; font-size: 1.4rem; outline: none; }
.cyber-input::-webkit-inner-spin-button { -webkit-appearance: none; }

/* 大按鈕 */
.mega-btn {
  width: 260px; height: 65px; background: #000; border: 2px solid #7c3aed; color: #fff;
  cursor: pointer; position: relative; overflow: hidden; clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
}
.mega-btn.running { border-color: #ff0055; box-shadow: inset 0 0 10px rgba(255,0,85,0.3); }

.reset-link { background: transparent; border: none; color: #444; cursor: pointer; text-decoration: underline; margin-top: 15px; }

/* 特效動畫 */
@keyframes particle-drift { 0% { transform: translateY(0); } 100% { transform: translateY(10px); } }
@keyframes glitch-shake { 
  0% { transform: translate(0); } 
  25% { transform: translate(-2px, 2px); } 
  50% { transform: translate(2px, -2px); } 
  100% { transform: translate(0); } 
}
@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
@keyframes scan-line { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
</style>