<script setup>
import { ref } from 'vue'

const namesInput = ref('') 
const groupCount = ref(2)
const groups = ref([])

// 特效與狀態控制
const isProcessing = ref(false)
const isAssembling = ref(false)
const isExploding = ref(false) // 這裡的 Explosiding 改為控制粒子噴發
const statusText = ref('READY')

const startGrouping = () => {
  // 如果為空則預設 1-100
  let names = namesInput.value.split('\n').filter(n => n.trim() !== '')
  if (names.length === 0) names = Array.from({ length: 100 }, (_, i) => (i + 1).toString())

  if (names.length < groupCount.value) return alert('系統警告：實體座標不足，無法完成分割！')

  isProcessing.value = true
  isAssembling.value = true
  isExploding.value = false // 初始化大爆炸特效
  statusText.value = 'MAPPING...'
  groups.value = []

  // 1. 能量匯聚 (比照你原本的 1.5s)
  setTimeout(() => {
    statusText.value = 'SINGULARITY'
    isAssembling.value = false
    
    // 2. 觸發奇點 (800ms 凝聚)
    setTimeout(() => {
      // --- 核心改動：觸發粒子爆炸特效，取消螢幕震動 ---
      isExploding.value = true 
      isProcessing.value = false
      
      const shuffled = [...names].sort(() => Math.random() - 0.5)
      const result = Array.from({ length: groupCount.value }, () => [])
      shuffled.forEach((name, index) => {
        result[index % groupCount.value].push(name)
      })
      groups.value = result

      // 爆炸光芒持續時間
      setTimeout(() => { isExploding.value = false }, 1200)
    }, 800) 
  }, 1500)
}
</script>

<template>
  <div class="cyber-group-terminal">
    <div class="crt-overlay"></div>
    <div class="header-laser">
      <div class="laser-beam"></div>
      <div class="terminal-id">PROTOCOL: QUANTUM_GROUPING_v3.1</div>
    </div>

    <div class="terminal-layout">
      <div class="display-stage">
        
        <div class="quantum-fx-layer">
          <div class="singularity-core" :class="{ 'gathering': isAssembling }"></div>
          
          <div class="quantum-field" v-if="isAssembling"></div>

          <div class="big-bang-burst" v-if="isExploding">
            <div v-for="n in 12" :key="n" class="burst-streak"></div>
          </div>
        </div>

        <div v-if="isProcessing" class="overlay-msg">
          <h1 class="status-title" :class="{ 'singularity-text': statusText === 'SINGULARITY' }">
            {{ statusText }}
          </h1>
        </div>

        <div v-else-if="groups.length > 0" class="results-grid">
          <TransitionGroup name="teleport">
            <div v-for="(group, idx) in groups" :key="idx" class="result-quadrant">
              <div class="quadrant-label">第 {{ idx + 1 }} 區塊 / QUADRANT_{{ idx + 1 }}</div>
              <div class="member-list">
                <span v-for="m in group" :key="m" class="entity-tag">{{ m }}</span>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <div v-else class="idle-state">
          <div class="glitch-hint" data-text="等待次元分割指令...">等待次元分割指令...</div>
        </div>
      </div>

      <div class="control-panel">
        <div class="input-panel">
          <div class="panel-label">組數設定 / SECTION_COUNT</div>
          <div class="cyber-stepper">
            <button @click="groupCount > 2 ? groupCount-- : null" class="step-btn">－</button>
            <div class="num-display">{{ groupCount }}</div>
            <button @click="groupCount++" class="step-btn">＋</button>
          </div>
        </div>

        <div class="action-panel">
          <button @click="startGrouping" :disabled="isProcessing" class="bang-btn">
            <div class="btn-scan"></div>
            <div class="btn-label">
              <span class="main-txt">{{ isProcessing ? statusText : '隨機分組：領域展開' }}</span>
              <span class="sub-txt">EXECUTE TRANSMISSION PROTOCOL</span>
            </div>
            <div class="btn-neon-glow"></div>
          </button>
        </div>

        <div class="input-panel">
          <div class="panel-label">實體名單 (預設 1-100)</div>
          <div class="textarea-wrapper">
            <textarea v-model="namesInput" placeholder="預設使用 1-100 號，或在此手動輸入名單..."></textarea>
            <div class="corner t-l"></div>
            <div class="corner b-r"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 基礎設定 */
.cyber-group-terminal {
  background: #000; min-height: 650px; padding: 25px; color: #fff;
  font-family: 'Orbitron', 'Microsoft JhengHei', sans-serif; position: relative; overflow: hidden;
}
.crt-overlay { position: absolute; inset: 0; pointer-events: none; z-index: 100; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.05) 50%); background-size: 100% 4px; }
.header-laser { margin-bottom: 25px; }
.laser-beam { height: 2px; width: 100%; background: linear-gradient(90deg, transparent, #7c3aed, #0ff, transparent); box-shadow: 0 0 15px #7c3aed; }
.terminal-id { font-size: 0.6rem; color: #7c3aed; margin-top: 5px; opacity: 0.8; letter-spacing: 2px; }

.terminal-layout { display: grid; grid-template-columns: 1fr 320px; gap: 30px; height: 500px; }

/* 左側：量子傳送顯示區 (取消震動) */
.display-stage {
  background: rgba(10, 10, 15, 0.8); border: 1px solid #1a1a2e; position: relative;
  overflow-y: auto; padding: 20px; border-radius: 4px;
}

/* --- 全新粒子大爆炸特效 (取代震動) --- */
.quantum-fx-layer { position: absolute; inset: 0; pointer-events: none; z-index: 5; }
.singularity-core {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 200px; height: 200px; background: radial-gradient(circle, #7c3aed 0%, transparent 70%);
  filter: blur(40px); opacity: 0; transition: 1.5s;
}
.gathering { opacity: 1; transform: translate(-50%, -50%) scale(0.1); filter: blur(10px); }

/* 量子格 (凝聚時浮現) */
.quantum-field {
  position: absolute; inset: 0; background-image: radial-gradient(#0ff 1px, transparent 1px), linear-gradient(60deg, rgba(0, 255, 255, 0.05) 25%, transparent 25%);
  background-size: 20px 20px, 40px 40px; animation: field-pulse 0.2s infinite; opacity: 0.4;
}

/* 粒子噴發 */
.big-bang-burst { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 2px; height: 2px; }
.burst-streak {
  position: absolute; top: 50%; left: 50%; width: 150px; height: 2px;
  background: linear-gradient(90deg, #fff, #7c3aed, transparent);
  transform-origin: left center; animation: streak-explode 0.8s forwards ease-out;
}
.burst-streak:nth-child(n) { transform: rotate(calc(30deg * var(--n))); } /* 這裡需要動態設定角度 */
/* 這裡用手寫 angles 取代 var(--n) 確保相容性 */
.burst-streak:nth-child(1) { transform: rotate(0deg); } .burst-streak:nth-child(2) { transform: rotate(30deg); } .burst-streak:nth-child(3) { transform: rotate(60deg); } .burst-streak:nth-child(4) { transform: rotate(90deg); } .burst-streak:nth-child(5) { transform: rotate(120deg); } .burst-streak:nth-child(6) { transform: rotate(150deg); } .burst-streak:nth-child(7) { transform: rotate(180deg); } .burst-streak:nth-child(8) { transform: rotate(210deg); } .burst-streak:nth-child(9) { transform: rotate(240deg); } .burst-streak:nth-child(10) { transform: rotate(270deg); } .burst-streak:nth-child(11) { transform: rotate(300deg); } .burst-streak:nth-child(12) { transform: rotate(330deg); }

/* 結果卡片優化 */
.results-grid { display: flex; flex-direction: column; gap: 15px; width: 100%; height: 100%; }
.result-quadrant {
  background: rgba(124, 58, 237, 0.1); border: 1px solid #333; border-left: 5px solid #7c3aed;
  padding: 15px; position: relative;
}
.quadrant-label { font-size: 0.8rem; color: #7c3aed; font-weight: bold; margin-bottom: 10px; }
.entity-tag {
  display: inline-block; background: #000; border: 1px solid #0ff;
  padding: 3px 10px; margin: 3px; font-size: 0.85rem; color: #fff;
}

/* 步進器與按鈕 (消滅白框、強化高亮) */
.cyber-stepper { display: flex; background: #111; border: 1px solid #333; border-radius: 4px; border-left: 4px solid #0ff; }
.num-display { flex: 1; text-align: center; font-size: 1.8rem; color: #0ff; line-height: 50px; text-shadow: 0 0 10px #0ff; }
.step-btn { width: 50px; height: 50px; background: #222; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
.step-btn:hover { background: #7c3aed; }

.bang-btn {
  width: 100%; height: 85px; background: #000; border: 2px solid #7c3aed; cursor: pointer;
  position: relative; overflow: hidden; clip-path: polygon(5% 0, 100% 0, 95% 100%, 0 100%); transition: 0.3s;
}
.domain-btn:active { transform: scale(0.96); }
.main-txt { font-size: 1.4rem; font-weight: 900; color: #fff; text-shadow: 0 0 10px #7c3aed, 0 0 20px #7c3aed; }
.sub-txt { font-size: 0.6rem; color: #0ff; opacity: 0.8; }
.btn-scan { position: absolute; inset: 0; background: linear-gradient(180deg, transparent, rgba(124, 58, 237, 0.3), transparent); animation: scan-move 2s infinite; }

/* 輸入框 (Placeholder 模式) */
textarea {
  width: 100%; height: 260px; background: #080808; border: 1px solid #222;
  color: #0ff; padding: 15px; font-family: monospace; outline: none; border-left: 2px solid #7c3aed;
}
textarea::placeholder { color: rgba(0, 255, 255, 0.3); font-style: italic; }

/* 動畫定義 */
@keyframes field-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.6; filter: hue-rotate(30deg); } }
@keyframes streak-explode {
  0% { transform: rotate(calc(var(--n))) scaleX(0); opacity: 1; filter: brightness(3); }
  20% { transform: rotate(calc(var(--n))) scaleX(1.5); opacity: 1; }
  100% { transform: rotate(calc(var(--n))) scaleX(2.5) translateX(100px); opacity: 0; filter: brightness(1); }
}
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes scan-move { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }

/* 贏家傳送特效 (Transition) */
.teleport-enter-active { animation: teleport-in 0.5s forwards ease-out; }
@keyframes teleport-in {
  0% { opacity: 0; transform: translateY(30px); filter: contrast(3) blur(10px); }
  50% { opacity: 1; transform: translateY(0); filter: contrast(1) blur(0px); }
  70% { background: rgba(0, 255, 255, 0.2); } /* 電子閃爍 */
  100% { background: rgba(124, 58, 237, 0.1); }
}
</style>