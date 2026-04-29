<script setup>
import { ref, reactive, computed, watch } from 'vue'

const teams = reactive([
  { id: Date.now(), name: '第一組', score: 0 },
  { id: Date.now() + 1, name: '第二組', score: 0 },
])

const floatingTexts = ref([])
const isShaking = ref(false)
const showResetConfirm = ref(false)
const glitchTrigger = ref(false)
const burstShockwave = ref(false) // +10 的全屏衝擊波

const addTeam = () => {
  teams.push({ id: Date.now(), name: `第 ${teams.length + 1} 組`, score: 0 })
}
const removeTeam = (id) => {
  if (teams.length <= 1) return
  teams.splice(teams.findIndex(t => t.id === id), 1)
}
const triggerReset = () => { showResetConfirm.value = true }
const confirmReset = () => {
  teams.forEach(t => t.score = 0)
  showResetConfirm.value = false
}

const highestScore = computed(() => {
  const max = Math.max(...teams.map(t => t.score))
  return max > 0 ? max : null
})
const currentLeaderId = computed(() => {
  if (highestScore.value === null) return null
  return teams.find(t => t.score === highestScore.value)?.id
})

// 監聽冠軍換人，觸發更強烈的雜訊
watch(currentLeaderId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    glitchTrigger.value = true
    setTimeout(() => glitchTrigger.value = false, 300) // 延長雜訊時間
  }
})

const addScore = (team, amount, event) => {
  team.score += amount
  if (team.score < 0) team.score = 0

  if (Math.abs(amount) >= 10) {
    isShaking.value = true
    burstShockwave.value = true 
    setTimeout(() => {
      isShaking.value = false
      burstShockwave.value = false
    }, 600) // 延長震撼時間
  }

  const id = Date.now()
  // 隨機顏色，更有霓虹感
  const neonColors = ['#ff00ff', '#00ffff', '#ff0055', '#00ff00', '#ffff00']
  floatingTexts.value.push({ 
    id, x: event.clientX, y: event.clientY, text: amount >= 0 ? `+${amount}` : amount,
    color: amount >= 10 ? neonColors[Math.floor(Math.random()*neonColors.length)] : '#fff',
    isBig: amount >= 10 
  })
  setTimeout(() => { floatingTexts.value = floatingTexts.value.filter(t => t.id !== id) }, 1000)
}
</script>

<template>
  <div class="cyber-cosmos-container" :class="{ 'vibrate-cyber': isShaking, 'system-glitch': glitchTrigger }">
    
    <div class="crt-overlay"></div>
    <div class="noise-overlay"></div>

    <div class="energy-shockwave" v-if="burstShockwave"></div>

    <div class="void-bg" v-if="highestScore">
      <div class="vortex-core"></div>
      <div v-for="i in 15" :key="i" class="warp-ring"></div>
    </div>

    <div class="ui-layer">
      <div class="toolbar">
        <button @click="addTeam" class="neo-btn add">召喚戰隊</button>
        <div class="status-display" v-if="highestScore">
          <span class="warning-blink">SYSTEM ALERT</span> 能量奇點：
          <span class="leader-name">{{ teams.find(t => t.id === currentLeaderId)?.name }}</span>
        </div>
        <button @click="triggerReset" class="neo-btn reset">重新計分</button>
      </div>

      <div class="battle-grid">
        <div 
          v-for="team in teams" 
          :key="team.id" 
          class="warrior-card"
          :class="{ 'cosmos-master': team.id === currentLeaderId && team.score !== 0 }"
        >
          <div class="god-beam" v-if="team.id === currentLeaderId && team.score !== 0"></div>

          <button @click="removeTeam(team.id)" class="delete-btn">解散</button>

          <div class="card-inner">
            
            <div class="leader-fx-layer" v-if="team.id === currentLeaderId && team.score !== 0">
              <div class="cyber-magic-circle"></div>
              <div class="code-rain">
                <span v-for="i in 10" :key="i">{{ Math.random().toString(36).substring(2, 5) }}</span>
              </div>
            </div>

            <div class="name-container">
              <input v-model="team.name" class="name-input" placeholder="組名..." spellcheck="false" />
              <div class="input-scanner"></div> </div>
            
            <div class="score-box">
              <div class="glow-num">{{ team.score }}</div>
              <div class="sub-text">戰力等級 // LEVEL</div>
            </div>

            <div class="control-stack">
              <div class="main-actions">
                <button @click.stop="addScore(team, 1, $event)" class="btn-action plus">+ 1</button>
                <button @click.stop="addScore(team, -1, $event)" class="btn-action minus">- 1</button>
              </div>
              <button @click.stop="addScore(team, 10, $event)" class="btn-burst">+ 10</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showResetConfirm" class="modal-overlay">
        <div class="modal-content">
          <div class="confirm-header">!! CRITICAL SYSTEM COMMAND !!</div>
          <h3>確定重置所有戰力？</h3>
          <p>此操作將重置所有資料，並觸發系統重啟...</p>
          <div class="modal-btns">
            <button @click="confirmReset" class="m-btn confirm">確認執行</button>
            <button @click="showResetConfirm = false" class="m-btn cancel">取消</button>
          </div>
        </div>
      </div>
    </Transition>

    <TransitionGroup name="burst-v5">
      <div v-for="f in floatingTexts" :key="f.id" 
           class="floating-num" 
           :class="{ 'big-num': f.isBig }"
           :style="{ left: f.x + 'px', top: f.y + 'px', color: f.color, '--floating-color': f.color }">
        {{ f.text }}
        <span class="cyber-particle" v-for="i in 8" :key="i"></span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
/* 基本容器與背景 */
.cyber-cosmos-container { 
  min-height: 90vh; position: relative; padding: 20px; overflow: hidden; 
  background: #000; color: #fff; font-family: 'Avenir', 'Orbitron', sans-serif; 
}

/* === 賽博龐克核心特效 1：CRT 掃描線與噪點 === */
.crt-overlay {
  position: fixed; inset: 0; pointer-events: none; z-index: 100;
  background: repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, transparent 1px, rgba(255,255,255,0.03) 2px);
  opacity: 0.8;
}
.noise-overlay {
  position: fixed; inset: 0; pointer-events: none; z-index: 99;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3Y%3Cfilter id='noiseFilter'%3Y%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3Y%3C/filter%3Y%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3Y%3C/svg%3Y");
  opacity: 0.05;
}

/* 全屏能量衝擊波 (霓虹色色差) */
.energy-shockwave {
  position: fixed; inset: 0; pointer-events: none; z-index: 1;
  background: radial-gradient(circle, transparent 20%, rgba(255, 0, 255, 0.4) 40%, rgba(0, 255, 255, 0.4) 60%, transparent 70%);
  animation: shockwave-cyber 0.6s ease-out forwards;
}
@keyframes shockwave-cyber { 0% { transform: scale(0); opacity: 1; filter: blur(0px); } 100% { transform: scale(4); opacity: 0; filter: blur(20px); } }

/* 背景宇宙特效 (火力全開 + 霓虹) */
.void-bg { position: absolute; inset: 0; pointer-events: none; display: flex; justify-content: center; align-items: center; opacity: 0.9; }
.vortex-core { position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(124, 58, 237, 0.7) 0%, transparent 80%); border-radius: 50%; animation: pulse-core 1.2s infinite; }
.warp-ring { position: absolute; border: 1px solid rgba(124, 58, 237, 0.4); border-radius: 50%; animation: warp-cyber v-bind('Math.random() * 2 + 1 + "s"') linear infinite; }
@keyframes warp-cyber { 0% { transform: scale(0.5); opacity: 0; } 50% { opacity: 0.9; border-color: rgba(0, 255, 255, 0.5); } 100% { transform: scale(4); opacity: 0; border-color: rgba(255, 0, 255, 0.5); } }

/* 頂部工具列 */
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 50px; position: relative; z-index: 10; }
.neo-btn { 
  background: rgba(124, 58, 237, 0.1); border: 2px solid #7c3aed; color: #fff; 
  padding: 12px 24px; border-radius: 0px; cursor: pointer; transition: 0.3s; 
  font-weight: bold; text-transform: uppercase; letter-spacing: 2px;
  clip-path: polygon(0% 0%, 90% 0%, 100% 10%, 100% 100%, 10% 100%, 0% 90%);
  position: relative;
}
.neo-btn::after { content: ""; position: absolute; inset: 0; background: #fff; opacity: 0; transition: 0.2s; }
.neo-btn:hover::after { opacity: 0.1; }
.neo-btn:hover { box-shadow: 0 0 20px #7c3aed, inset 0 0 10px #7c3aed; }

.neo-btn.reset { border-color: #ef4444; background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.neo-btn.reset:hover { border-color: #fff; color: #fff; box-shadow: 0 0 20px #ef4444, inset 0 0 10px #ef4444; }

.status-display { color: #888; font-size: 0.9rem; letter-spacing: 2px; }
.warning-blink { background: #ef4444; color: #fff; padding: 2px 6px; font-weight: bold; animation: blink 0.4s infinite alternate; }
@keyframes blink { from { opacity: 0.2; } to { opacity: 1; } }
.leader-name { color: #00ffff; font-weight: 900; text-shadow: 0 0 15px #00ffff; }

/* 網格與卡片 (賽博風格) */
.battle-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 40px; position: relative; z-index: 5; }
.warrior-card {
  background: rgba(10, 10, 10, 0.98); border: 1px solid #333;
  padding: 50px 24px 30px; position: relative; transition: 0.5s;
  clip-path: polygon(0 0, 95% 0, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0 95%, 0 0);
  backdrop-filter: blur(20px);
}
.warrior-card::before {
  content: ""; position: absolute; inset: 0;
  border: 2px solid transparent;
  background: linear-gradient(90deg, #ff00ff, #00ffff) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out; mask-composite: exclude;
  opacity: 0.3; transition: 0.5s;
}

/* 組名輸入 (掃描線) */
.name-container { margin-bottom: 15px; position: relative; }
.name-input { background: rgba(255, 255, 255, 0.03); border: 1px solid transparent; color: #fff; font-size: 1.2rem; text-align: center; width: 100%; padding: 10px; outline: none; transition: 0.3s; }
.name-input:focus { background: rgba(255, 255, 255, 0.08); border-color: #00ffff; box-shadow: 0 0 15px rgba(0, 255, 255, 0.5); }
.input-scanner {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 1px;
  background: #00ffff; animation: scan 2s linear infinite; opacity: 0;
}
.name-input:focus + .input-scanner { opacity: 1; }
@keyframes scan { 0% { bottom: 0%; opacity: 0; } 50% { opacity: 1; } 100% { bottom: 100%; opacity: 0; } }

/* 分數與領先者 */
.glow-num { font-size: 7rem; font-weight: 900; line-height: 1; background: linear-gradient(to bottom, #fff, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 15px rgba(124, 58, 237, 0.6)); transition: 0.3s; }
.sub-text { color: #555; letter-spacing: 2px; font-size: 0.8rem; margin-top: 5px; }

/* === 領先者至尊炫酷模式 === */
.cosmos-master { border-color: #00ffff; background: rgba(0, 255, 255, 0.03); transform: translateY(-10px); box-shadow: 0 0 100px rgba(0, 255, 255, 0.3); }
.cosmos-master::before { opacity: 1; animation: neon-border-pulse 2s infinite alternate; }
@keyframes neon-border-pulse { from { opacity: 0.5; } to { opacity: 1; box-shadow: 0 0 20px #00ffff; } }
.cosmos-master .glow-num { background: linear-gradient(to bottom, #fff, #00ffff, #ff00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 25px #00ffff) drop-shadow(0 0 10px #ff00ff); }

.god-beam { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0, 255, 255, 0.2), transparent); animation: beam-flicker-cyber 0.05s infinite alternate; z-index: -1; }
@keyframes beam-flicker-cyber { 0% { opacity: 0.7; } 100% { opacity: 1; } }

/* 領先者電子魔法陣與代碼流 */
.leader-fx-layer { position: absolute; top: 15px; left: 50%; transform: translateX(-50%); z-index: 10; pointer-events: none; }
.cyber-magic-circle {
  width: 50px; height: 50px; border: 2px dashed rgba(0, 255, 255, 0.7); border-radius: 50%;
  animation: rotate-circle 4s linear infinite;
  box-shadow: 0 0 15px #00ffff;
}
@keyframes rotate-circle { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.code-rain { position: absolute; top: 60px; left: 50%; transform: translateX(-50%); color: #00ffff; font-size: 0.6rem; font-family: monospace; opacity: 0.5; text-align: center; }
.code-rain span { display: block; animation: code-fall v-bind('Math.random() * 2 + 1 + "s"') linear infinite; opacity: 0; }
@keyframes code-fall { 0% { transform: translateY(-10px); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(30px); opacity: 0; } }

/* 按鈕控制 (賽博龐克升級) */
.control-stack { display: flex; flex-direction: column; gap: 15px; margin-top: 30px; position: relative; z-index: 20; }
.main-actions { display: flex; gap: 15px; }
.btn-action { 
  flex: 1; border: 2px solid #333; border-radius: 0px; padding: 18px; 
  font-weight: bold; cursor: pointer; transition: 0.2s; 
  background: rgba(255,255,255,0.02); color: #fff; font-size: 1.1rem;
  clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 10% );
}
.btn-action:hover { background: rgba(255,255,255,0.05); border-color: #555; box-shadow: 0 0 10px rgba(255,255,255,0.2); }

/* +10 按鈕 (霓虹電漿爆裂) */
.btn-burst { 
  padding: 20px; border: none; border-radius: 0px; font-weight: 900; cursor: pointer; font-size: 1.2rem;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #00ffff 100%);
  background-size: 200% 200%; animation: plasma-flow 2s linear infinite;
  color: #fff; text-shadow: 0 0 15px #fff, 0 0 5px #fff;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.6), inset 0 0 10px rgba(255, 0, 255, 0.5);
  clip-path: polygon(0% 0%, 100% 0%, 90% 100%, 0% 100%);
}
@keyframes plasma-flow { 0% { background-position: 0% 50%; } 100% { background-position: -200% 50%; } }
.btn-burst:hover { transform: scale(1.05) translateY(-3px); box-shadow: 0 0 50px rgba(0, 255, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.6); }

/* 解散按鈕 */
.delete-btn { position: absolute; top: 15px; right: 15px; background: none; border: none; color: #444; font-size: 0.8rem; cursor: pointer; transition: 0.3s; z-index: 40; }
.delete-btn:hover { color: #ff0055; text-shadow: 0 0 10px #ff0055; }

/* 確認視窗 (賽博龐克) */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.96); display: flex; justify-content: center; align-items: center; z-index: 100; backdrop-filter: blur(20px); }
.modal-content { 
  background: #000; border: 2px solid #ef4444; padding: 40px; text-align: center; 
  box-shadow: 0 0 100px rgba(239, 68, 68, 0.6), inset 0 0 20px rgba(239, 68, 68, 0.4); min-width: 400px;
  clip-path: polygon(0 0, 90% 0, 100% 10%, 100% 100%, 10% 100%, 0 90%);
}
.confirm-header { color: #ef4444; font-size: 0.75rem; font-weight: bold; letter-spacing: 3px; margin-bottom: 15px; animation: glitch-text 2s infinite alternate; }
@keyframes glitch-text { 0% { transform: translate(0, 0); } 10% { transform: translate(-2px, 2px); color: #00ffff; } 20% { transform: translate(2px, -2px); color: #ff00ff; } 100% { transform: translate(0, 0); } }

.modal-btns { display: flex; gap: 20px; margin-top: 30px; }
.m-btn { flex: 1; padding: 15px; border: none; cursor: pointer; font-weight: bold; font-size: 1rem; text-transform: uppercase; }
.confirm { background: #ef4444; color: #fff; border: 1px solid #fff; animation: warning-glitch 0.4s infinite; }
@keyframes warning-glitch { 0% { box-shadow: 0 0 10px #ef4444; transform: translate(0,0); } 50% { box-shadow: 0 0 30px #fff; transform: translate(2px,-1px); } 100% { box-shadow: 0 0 10px #ef4444; transform: translate(-1px,2px); } }
.cancel { background: #1a1a1a; color: #fff; border: 1px solid #333; }

/* 震動與系統雜訊 (賽博化) */
.vibrate-cyber { animation: shake-hard-glitch 0.4s cubic-bezier(.36,.07,.19,.97) both; }
@keyframes shake-hard-glitch { 
  10%, 90% { transform: translate3d(-3px, 0, 0) scaleX(1.02); filter: hue-rotate(10deg); } 
  20%, 80% { transform: translate3d(5px, 0, 0) scaleY(1.02); filter: hue-rotate(-10deg); } 
  30%, 50%, 70% { transform: translate3d(-8px, 0, 0); filter: saturate(200%); } 
  40%, 60% { transform: translate3d(8px, 0, 0); filter: saturate(100%); } 
}

.system-glitch::before { content: ""; position: fixed; inset: 0; background: repeating-linear-gradient(rgba(255,0,255,0.15) 0px, transparent 1px, rgba(0,255,255,0.15) 2px); z-index: 999; animation: glitch-flash-cyber 0.25s forwards; }
@keyframes glitch-flash-cyber { 0% { opacity: 0; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } 100% { opacity: 0; transform: scale(1); } }

/* === 粒子噴發浮動文字 (霓虹) === */
.floating-num { position: fixed; font-size: 4rem; font-weight: 900; pointer-events: none; z-index: 1000; text-shadow: 0 0 20px var(--floating-color), 0 0 10px #000; animation: burst-cyber 1s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
.big-num { font-size: 6rem; filter: brightness(1.3); }
@keyframes burst-cyber { 0% { transform: translate(-50%, 0) scale(0) rotate(10deg); opacity: 0; } 20% { opacity: 1; transform: translate(-50%, -100px) scale(1.4) rotate(0deg); } 100% { transform: translate(-50%, -350px) scale(1.1); opacity: 0; } }

.cyber-particle { position: absolute; width: 4px; height: 4px; background: var(--floating-color); border-radius: 0px; opacity: 0; animation: particle-explode-cyber 1s ease-out forwards; }
@keyframes particle-explode-cyber { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 100% { transform: translate(v-bind('Math.random()*150-75+"px"'), v-bind('Math.random()*150-75+"px"')) scale(0.5); opacity: 0; } }
</style>