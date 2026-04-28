<script setup>
import { ref, computed, onMounted } from 'vue'

const seconds = ref(0)
const customMinutes = ref(5)
const isAlarm = ref(false)
const isRunning = ref(false)
let interval = null

// 為了確保聲音正常，我們建立一個函式來初始化
const alarmAudio = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg')
alarmAudio.loop = true

const formattedTime = computed(() => `${Math.floor(seconds.value / 60)}:${(seconds.value % 60).toString().padStart(2, '0')}`)

const setTime = (m) => { 
  if (isAlarm.value) stopAlarm()
  customMinutes.value = m 
}

const startTimer = () => {
  stopAlarm()
  seconds.value = customMinutes.value * 60
  isRunning.value = true
  
  interval = setInterval(() => {
    if (seconds.value > 0) {
      seconds.value--
    } else {
      clearInterval(interval)
      isRunning.value = false
      isAlarm.value = true
      // 確保播放聲音
      alarmAudio.play().catch(e => console.error("音訊播放失敗，請檢查瀏覽器設定", e))
    }
  }, 1000)
}

const stopAlarm = () => {
  clearInterval(interval)
  isRunning.value = false
  isAlarm.value = false
  alarmAudio.pause()
  alarmAudio.currentTime = 0
}
</script>

<template>
  <div class="timer-card" :class="{ 'shake-alarm': isAlarm }">
    <div class="time-display">{{ formattedTime }}</div>
    
    <div class="shortcuts" v-if="!isAlarm">
      <button @click="setTime(5)" class="shortcut-btn">5分</button>
      <button @click="setTime(10)" class="shortcut-btn">10分</button>
      <button @click="setTime(15)" class="shortcut-btn">15分</button>
    </div>

    <div class="controls">
      <button v-if="isAlarm" @click="stopAlarm" class="stop-btn">停止鬧鈴</button>
      
      <template v-else>
        <input type="number" v-model="customMinutes" class="big-input" placeholder="分鐘">
        <button @click="startTimer" class="big-btn">開始計時</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.timer-card { background: var(--card); padding: 40px; border-radius: 12px; border: 1px solid #27272a; text-align: center; transition: background 0.3s; }
.time-display { font-size: 6rem; font-weight: 800; color: var(--text); margin-bottom: 20px; }

/* 抖動警報特效 */
.shake-alarm { 
  background: #7f1d1d !important; 
  animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) infinite;
}

@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }

/* 控制區間距調整 */
.controls { display: flex; justify-content: center; align-items: center; gap: 30px; margin-top: 20px; }

.shortcut-btn { padding: 12px 25px; background: #27272a; border: 1px solid #3f3f46; color: white; border-radius: 8px; cursor: pointer; }
.big-input { font-size: 2rem; padding: 15px; width: 140px; background: #09090b; border: 2px solid #3f3f46; color: white; border-radius: 8px; text-align: center; }
.big-btn { font-size: 1.5rem; padding: 18px 40px; background: var(--accent); color: white; border: none; border-radius: 8px; cursor: pointer; }

/* 停止按鈕 */
.stop-btn { font-size: 2rem; padding: 20px 60px; background: white; color: #7f1d1d; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; }
</style>