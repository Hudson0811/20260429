<script setup>
import { ref, computed } from 'vue'

const subjects = ref(['自然生態', '程式設計', '數位藝術', '遊戲開發'])
const selectedSubject = ref('自然生態')
const newSubName = ref('')
const supervisor = ref('')

// 時間數據
const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
const mins = ['00', '10', '20', '30', '40', '50'] // 考試常用間隔

const startH = ref('08'); const startM = ref('00')
const endH = ref('09'); const endM = ref('00')

const missions = ref([])

// 核心邏輯：部署並自動按時間排序
const addMission = () => {
  const startTimeVal = parseInt(startH.value + startM.value)
  const endTimeVal = parseInt(endH.value + endM.value)
  
  if (endTimeVal <= startTimeVal) {
    alert('警告：結束時間不可早於開始時間')
    return
  }

  const mission = {
    id: `OP-${Math.floor(Math.random()*999)}`,
    subject: selectedSubject.value,
    start: `${startH.value}:${startM.value}`,
    end: `${endH.value}:${endM.value}`,
    startTimeVal, // 用於排序的權重
    supervisor: supervisor.value || '系統管理員'
  }

  missions.value.push(mission)
  // 自動按時間排序：從早到晚
  missions.value.sort((a, b) => a.startTimeVal - b.startTimeVal)
}

const removeMission = (id) => {
  missions.value = missions.value.filter(m => m.id !== id)
}

const addNewSubject = () => {
  if (newSubName.value.trim()) {
    subjects.value.push(newSubName.value.trim())
    selectedSubject.value = newSubName.value.trim()
    newSubName.value = ''
  }
}
</script>

<template>
  <div class="cyber-scheduler-v5">
    <div class="terminal-layout">
      
      <div class="mission-timeline">
        <div class="panel-header">TIMELINE // 時序序列</div>
        <div class="scroll-area">
          <TransitionGroup name="flip-list">
            <div v-for="(m, idx) in missions" :key="m.id" class="m-card">
              <div class="m-index">SESSION_{{ idx + 1 }}</div>
              <div class="m-time-box">
                <span class="t-start">{{ m.start }}</span>
                <span class="t-arrow">▶</span>
                <span class="t-end">{{ m.end }}</span>
              </div>
              <div class="m-main">
                <div class="m-sub">{{ m.subject }}</div>
                <div class="m-user">監考：{{ m.supervisor }}</div>
              </div>
              <button @click="removeMission(m.id)" class="abort-btn">×</button>
            </div>
          </TransitionGroup>
          <div v-if="missions.length === 0" class="empty-hint">等待任務注入...</div>
        </div>
      </div>

      <div class="config-console">
        <div class="console-tag">MISSION_CONFIG_UNIT</div>

        <div class="config-section">
          <div class="label">科目選取</div>
          <div class="sub-dial">
            <div v-for="s in subjects" :key="s" 
                 class="dial-item" :class="{ 'active': selectedSubject === s }"
                 @click="selectedSubject = s">
              {{ s }}
            </div>
            <input v-model="newSubName" @keyup.enter="addNewSubject" placeholder="+ 自訂" class="sub-add-input" />
          </div>
        </div>

        <div class="config-section">
          <div class="label">考試時段設定 (START / END)</div>
          <div class="dual-wheel-box">
            <div class="wheel-group">
              <select v-model="startH" class="cyber-select"><option v-for="h in hours" :value="h">{{h}}</option></select>
              <span>:</span>
              <select v-model="startM" class="cyber-select"><option v-for="m in mins" :value="m">{{m}}</option></select>
            </div>
            <div class="to-text">TO</div>
            <div class="wheel-group">
              <select v-model="endH" class="cyber-select"><option v-for="h in hours" :value="h">{{h}}</option></select>
              <span>:</span>
              <select v-model="endM" class="cyber-select"><option v-for="m in mins" :value="m">{{m}}</option></select>
            </div>
          </div>
        </div>

        <div class="config-section">
          <div class="label">監考權限</div>
          <input v-model="supervisor" placeholder="輸入監考官姓名" class="name-input" />
        </div>

        <button @click="addMission" class="deploy-button">
          部署任務到時序軸
          <div class="scan-effect"></div>
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.cyber-scheduler-v5 {
  background: #000; padding: 30px; color: #fff; font-family: 'Orbitron', sans-serif;
}
.terminal-layout { display: grid; grid-template-columns: 380px 1fr; gap: 40px; height: 620px; }

/* 左側：自動排序卡片 */
.mission-timeline { background: rgba(5,5,10,0.8); border: 1px solid #1a1a2e; padding: 20px; display: flex; flex-direction: column; }
.scroll-area { flex: 1; overflow-y: auto; padding-right: 10px; }
.m-card {
  background: #080808; border: 1px solid #222; border-left: 4px solid #7c3aed;
  padding: 15px; margin-bottom: 15px; position: relative; transition: all 0.5s;
}
.m-index { font-size: 0.6rem; color: #7c3aed; margin-bottom: 5px; }
.m-time-box { display: flex; align-items: center; gap: 10px; color: #0ff; font-weight: bold; margin-bottom: 8px; }
.t-arrow { font-size: 0.7rem; opacity: 0.5; }
.m-sub { font-size: 1.2rem; font-weight: bold; }
.m-user { font-size: 0.8rem; color: #666; margin-top: 5px; }
.abort-btn { position: absolute; right: 10px; top: 10px; background: none; border: none; color: #333; cursor: pointer; }

/* 排序動畫 */
.flip-list-move { transition: transform 0.5s ease; }

/* 右側：滾輪樣式設定 (採用簡潔的 Cyber Select) */
.config-console { display: flex; flex-direction: column; gap: 30px; }
.sub-dial { display: flex; flex-wrap: wrap; gap: 10px; }
.dial-item {
  padding: 6px 15px; background: #111; border: 1px solid #333; cursor: pointer;
  border-radius: 4px; font-size: 0.85rem; transition: 0.3s;
}
.dial-item.active { border-color: #0ff; color: #0ff; box-shadow: 0 0 10px rgba(0,255,255,0.2); }
.sub-add-input { background: transparent; border: 1px dashed #333; color: #fff; width: 80px; padding: 5px; outline: none; }

.dual-wheel-box { display: flex; align-items: center; gap: 20px; background: #0a0a0a; padding: 20px; border-radius: 8px; }
.wheel-group { display: flex; align-items: center; gap: 10px; }
.cyber-select {
  background: #111; border: 1px solid #333; color: #0ff; font-size: 1.5rem;
  padding: 5px; outline: none; cursor: pointer; font-family: 'Orbitron';
}
.to-text { color: #7c3aed; font-weight: bold; }

.name-input {
  width: 100%; background: transparent; border: none; border-bottom: 1px solid #333;
  color: #fff; padding: 10px 0; outline: none;
}
.name-input:focus { border-bottom-color: #7c3aed; }

.deploy-button {
  height: 60px; background: #7c3aed; border: none; color: #fff; font-weight: 900;
  font-size: 1.1rem; cursor: pointer; position: relative; overflow: hidden;
  clip-path: polygon(3% 0, 100% 0, 97% 100%, 0 100%);
}
.scan-effect { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); animation: scan 2s infinite; }

@keyframes scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
.label { font-size: 0.7rem; color: #7c3aed; margin-bottom: 10px; letter-spacing: 1px; font-weight: bold; }
</style>